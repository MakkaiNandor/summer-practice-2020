import React, { Component } from 'react';
import './Survey.css';
import Cookies from 'universal-cookie';

export class Survey extends Component {
    static displayName = Survey.name;

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            error: null,
            numberOfPages: null,
            currPage: 0,
            firstPage: true,
            lastPage: false,
            submitted: false
        };

        this.getParameters = this.getParameters.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.submitSurvey = this.submitSurvey.bind(this);
        this.saveAnswers = this.saveAnswersOfPage.bind(this);
        this.getDefaultValue = this.getOldValue.bind(this);

        this.personalData = {name: null, age: null, email: null, gender: null};
        this.survey = null;
        this.userAnswers = null;
        this.counters = null;
    }

    // get survey by id
    async getSurvey(){
        const cookies = new Cookies();
        var token = cookies.get('token');
        const response = await fetch('https://localhost:44309/Survey/getSurvey/' + this.props.match.params.id,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if(!response.ok) this.setState({ error: "Survey not found!" });
        else{
            this.survey = await response.json();
            if(this.survey.status !== "active"){
                this.setState({ error: "Survey is not active!" });
            }
            else{
                this.userAnswers = this.survey.pages.map(page => {
                    return {
                        pageNumber: page.pageNumber,
                        questions: page.questions.map(question => {
                            return {
                                questionId: question.questionId,
                                type: question.type,
                                label: question.label,
                                answers: []
                            }
                        })
                    }
                });
                if(this.survey.pages.length === 1) this.setState({lastPage: true});
                this.setState({loading: false, numberOfPages: this.survey.pages.length });
            }
        }
    }

    // save survey's one page
    async savePageOfSurvey(){
        const cookies = new Cookies();
        var token = cookies.get('token');
        const response = await fetch('https://localhost:44309/Answer/sendAnswer/' + this.survey.surveyId, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`

            },
            body: JSON.stringify({
                personalData: this.personalData,
                pages: [this.userAnswers[this.state.currPage]]
            })
        });
        if(!response.ok) this.setState({ error: "Submittion went wrong!" });
        //console.log(response);
    }

    async getCounters(){
        const cookies = new Cookies();
        var token = cookies.get('token');
        const response = await fetch('https://localhost:44309/Answer/getReport/' + this.props.match.params.id,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if(!response.ok) this.setState({ error: "Survey not found!" });
        else{
            this.counters = await response.json();
            ++this.counters.leftCounter;
            this.setCounters();
        }
    }

    async setCounters(){
        const cookies = new Cookies();
        var token = cookies.get('token');
        const response = await fetch('https://localhost:44309/Answer/setCounters/' + this.props.match.params.id, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(this.counters)
        });
        if(!response.ok) this.setState({ error: "Setting counters went wrong!" });
    }  

    componentDidMount(){
        this.getSurvey();
        this.getCounters();
        this.getParameters();
    }

    // get parameters from URL (personal data)
    getParameters(){
        this.props.location.search.substr(1).split("&").forEach(parameter => {
            let [key, value] = parameter.split("=");
            switch(key){
                case "name":
                    this.personalData.name = value;
                    break;
                case "age":
                    this.personalData.age = value;
                    break;
                case "email":
                    this.personalData.email = value;
                    break;
                case "gender":
                    this.personalData.gender = value;
                    break;
                default:
            }
        });
        if(!this.personalData.name || !this.personalData.age || !this.personalData.email || !this.personalData.gender){
            this.setState({ error: "Parameter(s) not found!" });
        }
    }

    // event handlers for buttons
    nextPage(event){
        if(this.saveAnswersOfPage()) this.savePageOfSurvey();
        else return;
        if(this.state.firstPage) this.setState({ firstPage: false });
        if(this.state.currPage === this.state.numberOfPages - 2) this.setState({ lastPage: true });
        this.setState({ currPage: this.state.currPage + 1 });
    }
    
    prevPage(event){
        this.saveAnswersOfPage(); 
        this.savePageOfSurvey();
        if(this.state.lastPage) this.setState({ lastPage: false });
        if(this.state.currPage === 1) this.setState({ firstPage: true });
        this.setState({ currPage: this.state.currPage - 1 });
    }
    
    async submitSurvey(event){
        if(this.saveAnswersOfPage()) await this.savePageOfSurvey();
        else return;
        --this.counters.leftCounter;
        ++this.counters.completedCounter;
        this.setCounters();
        this.setState({ submitted: true });
        //console.log(this.userAnswers);
    }

    // generate questions of page
    generateQuestions(){
        return (
            this.survey.pages[this.state.currPage].questions.map(question => 
                <div className="survey_page_question" id={"question_" + question.questionId} key={question.questionId}>
                    <p className="question-label"><b>{question.questionId + ": "}</b>{question.label}</p>
                    {this.generateAnswers(question)}
                </div>
            )
        );
    }
    
    // generate answers of question
    generateAnswers(question){
        switch(question.type){
            case "input":
                return (
                    <div className="survey_page_answer_holder">
                        <div className="answer">
                            <input type="text" id={"question_" + question.questionId + "_answer_1"} name={"question_" + question.questionId} defaultValue={this.getOldValue(question.questionId, 1)}/>
                        </div>
                    </div>
                );
            case "radio":
                return (
                    <div className="survey_page_answer_holder">
                        {question.answers.map(answer =>
                            <div className="answer" key={answer.answerId}>
                                <input type="radio" id={"question_" + question.questionId + "_answer_" + answer.answerId} name={"question_" + question.questionId} value={answer.value} defaultChecked={this.getOldValue(question.questionId, answer.answerId)}/>
                                <label htmlFor={"question_" + question.questionId + "_answer_" + answer.answerId}>{answer.value}</label>
                            </div>
                        )}
                    </div>
                );
            case "checkbox":
                return (
                    <div className="survey_page_answer_holder">
                        {question.answers.map(answer => 
                            <div className="answer" key={answer.answerId}>
                                <input type="checkbox" id={"question_" + question.questionId + "_answer_" + answer.answerId} name={"question_" + question.questionId} value={answer.value} defaultChecked={this.getOldValue(question.questionId, answer.answerId)}/>
                                <label htmlFor={"question_" + question.questionId + "_answer_" + answer.answerId}>{answer.value}</label>
                            </div>
                        )}
                    </div>
                );
            case "rating":
                return (
                    <div className="survey_page_answer_holder">
                        <label>{question.answers[0].value}</label>
                        {question.answers.map(answer => 
                            <input type="radio" key={answer.answerId} id={"question_" + question.questionId + "_answer_" + answer.answerId} className="survey_page_rating_answer" name={"question_" + question.questionId} value={answer.value} defaultChecked={this.getOldValue(question.questionId, answer.answerId)}/>
                        )}
                        <label>{question.answers[4].value}</label>
                    </div>
                );
            default: return null;
        }
    }
    
    // save answers of one page
    saveAnswersOfPage(){
        let noAnswer = false;
        this.userAnswers[this.state.currPage].questions.map(question => {
            question.answers = [];
            return question;
        });
        this.userAnswers[this.state.currPage].questions.forEach(question => {
            let answerInputs = Array.from(document.getElementById("question_" + question.questionId).getElementsByTagName("INPUT"));
            answerInputs.forEach(answerInput => {
                if((question.type === "input" && answerInput.value !== "") || (question.type !== "input" && answerInput.checked)){
                    question.answers.push({
                        answerId: parseInt(answerInput.id.split("_")[3]),
                        value: answerInput.value
                    });
                }
            });
            if(question.answers.length === 0){
                document.getElementById("question_" + question.questionId).style.borderColor = "red";
                noAnswer = true;
            }
            else document.getElementById("question_" + question.questionId).style.borderColor = "black";
        });
        return !noAnswer;
    }
    
    // set up user's old answers
    getOldValue(questionId, answerId){
        let question = this.userAnswers[this.state.currPage].questions.filter(question => { return question.questionId === questionId; })[0];
        let answer = question.answers.filter(answer => { return answer.answerId === answerId; })[0];
        if(!answer){
            if(question.type === "input") return "";
            else return false;
        }
        else{
            if(question.type === "input") return answer.value;
            else return true;
        }
    }
    
    render() {
        if(this.state.error){
            return (
                <div id="GeneralPieErrorContainer">
                    <h3 id="GeneralPieError">{this.state.error}</h3>
                </div>
            );
        }
        else if(this.state.loading){
            return (
                <div id="GeneralPieErrorContainer">
                    <h3 id="GeneralPieError">Loading...</h3>
                </div>
            );
        }
        else if(this.state.submitted){
            return (
                <div id="survey_page">
                    <h2 id="survey_page_title">{this.survey.title}</h2>
                <div id="survey_page_progress_bar_holder">
                    <p>End of survey</p>
                    <div id="survey_page_progress_bar_frame">
                        <div id="survey_page_progress_bar" style={{width: 100 + '%'}}></div>
                    </div>
                </div>
                <p>Thank you for submitting!</p>
                </div>
            );
        }
        else{
            let prevPageButton = !this.state.firstPage ? <button className="survey-button2" onClick={this.prevPage}>Previous Page</button> : null;
            let nextPageButton = !this.state.lastPage ? <button className="survey-button" onClick={this.nextPage}>Next Page</button> : null;
            let submitSurveyButton = this.state.lastPage ? <button className="survey-button" onClick={this.submitSurvey}>Submit Survey</button> : null;

            let description = this.state.firstPage ? <p className="survey_page_description"><b>Description: </b>{this.survey.description}</p> : null; 
            let ending = this.state.lastPage ? <p className="survey_page_description">{this.survey.ending}</p> : null; 

            let percentage = (100 * this.state.currPage) / this.state.numberOfPages;

            return (
                <div id="survey_page">
                    <h2 id="survey_page_title">{this.survey.title}</h2>
                    <div id="survey_page_progress_bar_holder">
                        <p>Page {this.state.currPage + 1} of {this.state.numberOfPages}</p>
                        <div id="survey_page_progress_bar_frame">
                            <div id="survey_page_progress_bar" style={{width: percentage + '%'}}></div>
                        </div>
                    </div>
                    {description}
                    <div className="question-holder">
                        {this.generateQuestions()}
                    </div>
                    {ending}
                    {prevPageButton}
                    {nextPageButton}
                    {submitSurveyButton}
                </div>
            );
        }
    }
}