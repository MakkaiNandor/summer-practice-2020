import React, { Component } from 'react';
import './Survey.css';

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

        this.survey = {
            surveyId: 1,
            title: "Test survey",
            description: "This is a test survey.",
            ending: "This is the end of survey!",
            status: "active",
            pages: [
                {
                    pageNumber: 1,
                    questions: [
                        {
                            questionId: 1,
                            type: "input",
                            label: "What's your hobby?",
                            answers: []
                        },
                        {
                            questionId: 2,
                            type: "radio",
                            label: "Do you like chocolate?",
                            answers: [
                                {
                                    answerId: 1,
                                    value: "Yes"
                                },
                                {
                                    answerId: 2,
                                    value: "No"
                                }
                            ]
                        },
                        {
                            questionId: 3,
                            type: "input",
                            label: "What's your favorite movie?",
                            answers: []
                        },
                        {
                            questionId: 4,
                            type: "checkbox",
                            label: "What foods do you like?",
                            answers: [
                                {
                                    answerId: 1,
                                    value: "pizza"
                                },
                                {
                                    answerId: 2,
                                    value: "hamburger"
                                },
                                {
                                    answerId: 3,
                                    value: "hotdog"
                                }
                            ]
                        }
                    ]
                },
                {
                    pageNumber: 2,
                    questions: [
                        {
                            questionId: 5,
                            type: "input",
                            label: "What's your hobby?",
                            answers: []
                        },
                        {
                            questionId: 6,
                            type: "radio",
                            label: "Do you like chocolate?",
                            answers: [
                                {
                                    answerId: 1,
                                    value: "Yes"
                                },
                                {
                                    answerId: 2,
                                    value: "No"
                                }
                            ]
                        },
                        {
                            questionId: 7,
                            type: "input",
                            label: "What's your favorite movie?",
                            answers: []
                        },
                        {
                            questionId: 8,
                            type: "checkbox",
                            label: "What foods do you like?",
                            answers: [
                                {
                                    answerId: 1,
                                    value: "pizza"
                                },
                                {
                                    answerId: 2,
                                    value: "hamburger"
                                },
                                {
                                    answerId: 3,
                                    value: "hotdog"
                                }
                            ]
                        }
                    ]
                },
                {
                    pageNumber: 3,
                    questions:[
                        {
                            questionId: 9,
                            type: "input",
                            label: "What's your hobby?",
                            answers: []
                        },
                        {
                            questionId: 10,
                            type: "radio",
                            label: "Do you like chocolate?",
                            answers: [
                                {
                                    answerId: 1,
                                    value: "Yes"
                                },
                                {
                                    answerId: 2,
                                    value: "No"
                                }
                            ]
                        },
                        {
                            questionId: 11,
                            type: "input",
                            label: "What's your favorite movie?",
                            answers: []
                        },
                        {
                            questionId: 12,
                            type: "checkbox",
                            label: "What foods do you like?",
                            answers: [
                                {
                                    answerId: 1,
                                    value: "pizza"
                                },
                                {
                                    answerId: 2,
                                    value: "hamburger"
                                },
                                {
                                    answerId: 3,
                                    value: "hotdog"
                                }
                            ]
                        }
                    ]
                }
            ]
        };

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
    }

    // get survey by id
    async getSurvey(){
        const response = await fetch('https://localhost:44309/Survey/getSurvey/' + this.props.match.params.id);
        if(!response.ok) this.setState({ error: "Survey not found!" });
        else{
            this.survey = await response.json();
            if(this.survey.status !== "active"){
                this.setState({ error: "Survey is not active!" });
            }
            else{
                if(this.survey.pages.length === 1) this.setState({last_page: true});
                this.setState({loading: false, numberOfPages: this.survey.pages.length });
            }
        }
    }

    // save survey's one page
    async savePageOfSurvey(){
        const response = await fetch('https://localhost:44309/Answer/sendAnswers/' + this.survey.surveyId, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                personalData: this.personalData,
                pages: [this.userAnswers[this.state.currPage]]
            })
        });
        console.log(response);
    }

    componentDidMount(){
        //this.getSurvey();

        if(!this.survey){
            this.setState({ error: "Survey not found!" });
        }
        else if(this.survey.status !== "active"){
            this.setState({ error: "Survey is not active!" });
        }
        else{
            this.setState({ numberOfPages: this.survey.pages.length });
            if(this.survey.pages.length === 1) this.setState({ lastPage: true });
        }
        this.getParameters();
        this.setState({ loading: false });
        console.log(this.personalData);
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
    nextPage(){
        this.saveAnswersOfPage();
        if(this.state.firstPage) this.setState({ firstPage: false });
        if(this.state.currPage === this.state.numberOfPages - 2) this.setState({ lastPage: true });
        this.setState({ currPage: this.state.currPage + 1 });
    }
    
    prevPage(){
        this.saveAnswersOfPage();
        if(this.state.lastPage) this.setState({ lastPage: false });
        if(this.state.currPage === 1) this.setState({ firstPage: true });
        this.setState({ currPage: this.state.currPage - 1 });
    }
    
    submitSurvey(){
        this.saveAnswersOfPage();
        this.setState({ submitted: true });
        console.log(this.userAnswers);
    }

    // generate questions of page
    generateQuestions(){
        return (
            this.survey.pages[this.state.currPage].questions.map(question => 
                <div className="question" id={"question_" + question.questionId} key={question.questionId}>
                    <p className="question-label"><b>{question.questionId + ": "}</b>{question.label}</p>
                    <div className="answer-holder">
                        {this.generateAnswers(question)}
                    </div>
                </div>
            )
        );
    }
    
    // generate answers of question
    generateAnswers(question){
        switch(question.type){
            case "input":
                return (
                    <div className="answer">
                        <input type="text" id={"question_" + question.questionId + "_answer_1"} name={"question_" + question.questionId} defaultValue={this.getOldValue(question.questionId, 1)}/>
                    </div>
                );
            case "radio":
                return (
                    question.answers.map(answer =>
                        <div className="answer" key={answer.answerId}>
                            <input type="radio" id={"question_" + question.questionId + "_answer_" + answer.answerId} name={"question_" + question.questionId} value={answer.value} defaultChecked={this.getOldValue(question.questionId, answer.answerId)}/>
                            <label htmlFor={"question_" + question.questionId + "_answer_" + answer.answerId}>{answer.value}</label>
                        </div>
                    )
                );
            case "checkbox":
                return (
                    question.answers.map(answer => 
                        <div className="answer" key={answer.answerId}>
                            <input type="checkbox" id={"question_" + question.questionId + "_answer_" + answer.answerId} name={"question_" + question.questionId} value={answer.value} defaultChecked={this.getOldValue(question.questionId, answer.answerId)}/>
                            <label htmlFor={"question_" + question.questionId + "_answer_" + answer.answerId}>{answer.value}</label>
                        </div>
                    )
                );
            default: return null;
        }
    }
    
    // save answers of one page
    saveAnswersOfPage(){
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
        });
        //this.savePageOfSurvey();
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
                <p>{this.state.error}</p>
            );
        }
        else if(this.state.loading){
            return (
                <p>Loading...</p>
            );
        }
        else if(this.state.submitted){
            return (
                <div id="survey-page">
                <h2 id="survey-title">{this.survey.title}</h2>
                <div id="progress-bar-holder">
                    <p>End of survey</p>
                    <div id="progress-bar-frame">
                        <div id="progress-bar" style={{width: 100 + '%'}}></div>
                    </div>
                </div>
                <p>Thank you for submitting!</p>
                </div>
            );
        }
        else{
            let prevPageButton = !this.state.firstPage ? <button className="survey-button" onClick={this.prevPage}>Previous Page</button> : null;
            let nextPageButton = !this.state.lastPage ? <button className="survey-button" onClick={this.nextPage}>Next Page</button> : null;
            let submitSurveyButton = this.state.lastPage ? <button className="survey-button" onClick={this.submitSurvey}>Submit Survey</button> : null;

            let description = this.state.firstPage ? <p className="description"><b>Description: </b>{this.survey.description}</p> : null; 
            let ending = this.state.lastPage ? <p className="description">{this.survey.ending}</p> : null; 

            let percentage = (100 * this.state.currPage) / this.state.numberOfPages;

            return (
                <div id="survey-page">
                    <h2 id="survey-title">{this.survey.title}</h2>
                    <div id="progress-bar-holder">
                        <p>Page {this.state.currPage + 1} of {this.state.numberOfPages}</p>
                        <div id="progress-bar-frame">
                            <div id="progress-bar" style={{width: percentage + '%'}}></div>
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

/*export class Survey extends Component {
  static displayName = Survey.name;

    constructor(props) {
        super(props);
        this.elseAnswers = null;
        this.state = {  
            loading: true, 
            not_found: false, 
            not_active: false,
            curr_page: 0, 
            first_page: true, 
            last_page: false, 
            submit: false,
            questions: null
        };
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.generateQuestions = this.generateQuestions.bind(this);
        this.saveAnswers = this.saveAnswers.bind(this);
        this.submitSurvey = this.submitSurvey.bind(this);
        this.getDefaultValue = this.getDefaultValue.bind(this);
        this.survey = null;
    }

    async getSurvey(){
        const response = await fetch('https://localhost:44309/Survey/getSurvey/' + this.props.match.params.id);
        if(!response.ok){
            this.setState({not_found: true});
        }
        else{
            this.survey = await response.json();
            if(this.survey.status !== "active"){
                this.setState({not_active: true});
            }
            else{
                if(this.survey.pages.length === 1) this.setState({last_page: true});
                console.log(this.survey.pages[0].questions.answers)
                this.setState({loading: false, questions: this.survey.pages[0].questions});
                ++this.survey.leftCounter;
            }
        }
    }

    async saveSurvey(){
        const response = await fetch('https://localhost:44309/Survey/editSurvey/' + this.survey.surveyId, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.survey)
        });
        console.log(response);
    }

    componentDidMount(){
        this.getSurvey();
    }


    // event handlers for buttons
    nextPage(){
        this.saveAnswers();
        if(this.state.first_page) this.setState({first_page: false});
        if(this.state.curr_page === this.survey.pages.length - 2) this.setState({last_page: true});
        this.setState({curr_page: this.state.curr_page + 1, questions: this.survey.pages[this.state.curr_page+1].questions});
    }

    prevPage(){
        this.saveAnswers();
        if(this.state.last_page) this.setState({last_page: false});
        if(this.state.curr_page === 1) this.setState({first_page: true});
        this.setState({curr_page: this.state.curr_page - 1, questions: this.survey.pages[this.state.curr_page-1].questions});
    }
    
    submitSurvey(){
        --this.survey.leftCounter;
        ++this.survey.completedCounter;
        this.saveAnswers();
        this.setState({submit: true});
    }

    // generate answer options for question
    generateAnswers(question){
        switch(question.type){
            case "input":
                return (
                    <div className="answer">
                        <input type="text" id={"question_" + question.questionId + "_answer"} name={"question_" + question.questionId} defaultValue={this.getDefaultValue(question.questionId, 0)}/>
                    </div>
                );
            case "radio":
                return (
                    question.answers.filter(answer => !answer.selected).map(answer =>
                        <div className="answer" key={answer.answerId}>
                            <input type="radio" id={"question_" + question.questionId + "_answer_" + answer.answerId} name={"question_" + question.questionId} value={answer.value} defaultChecked={this.getDefaultValue(question.questionId, answer.answerId)}/>
                            <label htmlFor={"question_" + question.questionId + "_answer_" + answer.answerId}>{answer.value}</label>
                        </div>
                    )
                );
            case "checkbox":
                return (
                    question.answers.filter(answer => !answer.selected).map(answer => 
                        <div className="answer" key={answer.answerId}>
                            <input type="checkbox" id={"question_" + question.questionId + "_answer_" + answer.answerId} name={"question_" + question.questionId} value={answer.value} defaultChecked={this.getDefaultValue(question.questionId, answer.answerId)}/>
                            <label htmlFor={"question_" + question.questionId + "_answer_" + answer.answerId}>{answer.value}</label>
                        </div>
                    )
                );
            default: return null;
        }
    }

    // generate questions for page
    generateQuestions(){
        return (
            <div className="question-holder">
                {this.state.questions.map(question => 
                    <div className="question" id={"question_" + question.questionId} key={question.questionId}>
                        <p className="question_label"><b>{question.questionId + ": "}</b>{question.label}</p>
                        <div className="answer-holder">{this.generateAnswers(question)}</div>
                    </div>
                )}
            </div>
        );
    }

    saveAnswers(){
        this.survey.pages[this.state.curr_page].questions.forEach(question => {
            question.answers = question.answers.filter(answer => { return !answer.selected; });
            if(question.type === "input"){
                let answerInput = document.getElementById("question_" + question.questionId + "_answer");
                if(answerInput.value !== ""){
                    let userAnswer = {
                        answerId: this.generateNextId(question.answers),
                        value: answerInput.value,
                        selected: true
                    };
                    question.answers.push(userAnswer);
                }
            }
            else{
                question.answers.forEach(answer => {
                    let answerInput = document.getElementById("question_" + question.questionId + "_answer_" + answer.answerId);
                    if(answerInput.checked){
                        let userAnswer = {
                            answerId: this.generateNextId(question.answers),
                            value: answerInput.value,
                            selected: true
                        };
                        question.answers.push(userAnswer);
                    }
                });
            }
        });
        console.log(this.survey);
        this.saveSurvey();
    }

    render() {
        var info = this.state.not_found ? <p>Survey not found!</p> : this.state.not_active ? <p>Survey is not active!</p> : this.state.loading ? <p>Loading...</p> : null;
        if(info){
            return (
                <div>{info}</div>
            );
        }
        else if(this.state.submit){
            return(
                <div id="survey_page">
                    <h2>{this.survey.title}</h2>
                    <p>Thank you for submitting!</p>
                </div>
            );
        }
        else{
            var desc = this.state.first_page ? this.survey.description : null;
            var footer_desc = this.state.last_page ? this.survey.footer_description : null;
            
            var next_button = this.state.last_page ? null : <button className="survey-button" onClick={this.nextPage}>Next page</button>;
            var prev_button = this.state.first_page ? null : <button className="survey-button" onClick={this.prevPage}>Previous page</button>;
            var submit_button = !this.state.last_page ? null : <button type="submit" className="survey-button" onClick={this.submitSurvey}>Submit survey</button>;
            
            var questions = this.state.questions ? this.generateQuestions() : null;
            
            return (
            <div id="survey_page">
                <h2 id="survey_title">{this.survey.title}</h2>
                <p className="description"><b>{desc ? "Description: " : null}</b>{desc}</p>
                {questions}
                <p className="description">{footer_desc}</p>
                {prev_button}
                {next_button}
                {submit_button}
            </div>
            );
        }
    }

    generateNextId(answers){
        let maxId = 0;
        answers.forEach(answer => {
            if(answer.answerId > maxId){
                maxId = answer.answerId;
            }
        });
        return maxId + 1;
    }

    getDefaultValue(questionId, answerId){
        let question = this.survey.pages[this.state.curr_page].questions.filter(question => { return question.questionId === questionId; })[0];
        if(question.type === "input"){
            let answer = question.answers.filter(answer => { return answer.selected; });
            if(answer.length === 1)
                return answer[0].value;
            else
                return "";
        }
        else{
            let answerValue = question.answers.filter(answer => { return answer.answerId === answerId; })[0].value;
            let checked = question.answers.filter(answer => { return answer.selected && answer.value === answerValue; }).length;
            return checked > 0;
        }
    }
}*/