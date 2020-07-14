import React, { Component } from 'react';
import './EditFormQuestion.css';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';

export class EditFormQuestion extends Component {
    static displayName = EditFormQuestion.name;

    constructor(props){
        super(props);

        this.state = {
            error: null,
            loading: true,
            currPageNumber: 1,
            data: [],
            overlay: false
        };

        this.survey = null;
        this.questionTemplates = null;
    
        this.onPageButtonClicked = this.onPageButtonClicked.bind(this);
        this.addNewPage = this.addNewPage.bind(this);
        this.deleteCurrPage = this.deleteCurrPage.bind(this);
        this.getQuestionsOfCurrentPage = this.getQuestionsOfCurrentPage.bind(this);
        this.renderQuestions = this.renderQuestions.bind(this);
        this.saveSurvey = this.saveSurvey.bind(this);
        this.questionTypeChange = this.questionTypeChange.bind(this);
        this.deleteAnswer = this.deleteAnswer.bind(this);
        this.addNewAnswer = this.addNewAnswer.bind(this);
        this.removeQuestion = this.removeQuestion.bind(this);
        this.addNewQuestion = this.addNewQuestion.bind(this);
        this.saveQuestionText = this.saveQuestionText.bind(this);
        this.saveAnswerLabel = this.saveAnswerLabel.bind(this);
        this.addQuestionTemplate = this.addQuestionTemplate.bind(this);
        this.addToQuestionTemplates = this.addToQuestionTemplates.bind(this);
    }


    componentDidMount(){
        this.getSurvey();
        this.getAllQuestionTemplates();
    }

    async getSurvey(){
        const cookies = new Cookies();
        var token = cookies.get('token');
        const response = await fetch('https://localhost:44309/Survey/getSurvey/' + this.props.match.params.id,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if(!response.ok) this.setState({ error: "Survey not found!" });
        else{
            this.survey = await response.json();
            if(this.survey.status !== "created"){
                this.setState({ error: "Survey is not active, and cannot be edited!" });
            }
            else{
                this.setState({loading: false, data: this.survey.pages.reduce((acc1, page) => {
                    return acc1.concat({
                        pageNumber: page.pageNumber,
                        questions: page.questions.reduce((acc2, question) => {
                            return acc2.concat({
                                questionId: question.questionId,
                                type: question.type,
                                questionOptions: [{
                                    type: question.type,
                                    label: question.label,
                                    answers: question.answers
                                }]
                            })
                        }, [])
                    })
                }, [])});
            }
        }
    }


    // save data as survey
    async saveSurvey(){
        
        this.survey.pages = this.state.data.map(page => {return {
            pageNumber: page.pageNumber,
            questions: page.questions.map(question => {
                let answersOfQuestion = question.questionOptions.filter(option => { return option.type === question.type })[0];
                return {
                    questionId: question.questionId,
                    type: question.type,
                    label: answersOfQuestion.label,
                    answers: answersOfQuestion.answers
            }})
        }});


        const cookies = new Cookies();
        var token = cookies.get('token');
        
        const response = await fetch('https://localhost:44309/Survey/editSurvey/' + this.props.match.params.id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(this.survey)
        });
        if(!response.ok) alert("Survey saving failed!");
        else alert("Survey saved!");
        window.location.href = window.location.href.replace("editformquestion/" + this.props.match.params.id, "SurveyDashboard");
    }

    async getAllQuestionTemplates(){
        const cookies = new Cookies();
        var token = cookies.get('token');
        const response = await fetch('https://localhost:44309/QuestionTemplate/getAllQuestionTemplates',{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if(response.ok) this.questionTemplates = await response.json();
    }

    async createQuestionTemplate(question){
        const cookies = new Cookies();
        var token = cookies.get('token');
        const response = await fetch('https://localhost:44309/QuestionTemplate/createQuestionTemplate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(question)
        });
        if(!response.ok) alert("Something went wrong!");
        else {
            await this.getAllQuestionTemplates();
            alert("Question is added to question templates!");
        }
    }

    /*
        -------------------
        Auxiliary functions
        -------------------
    */


    setUpQuestionIds(data){
        let questionCounter = 0;
        for(let page of data){
            for(let question of page.questions){
                question.questionId = ++questionCounter;
            }
        }
        return data;
    }

    setUpAnswerIds(answers){
        let answerCounter = 0;
        for(let answer of answers){
            answer.answerId = ++answerCounter;
        }
        return answers;
    }

    // get questions of page
    getQuestionsOfCurrentPage(){
        let page = this.state.data.filter(page => {
            return page.pageNumber === this.state.currPageNumber;
        });
        return page.length === 1 ? page[0].questions : [];
    }

    /*
        -----------------------
        Event handler functions
        -----------------------
    */

    // selection page
    onPageButtonClicked(event){
        let pageNumber = parseInt(event.target.id.split("-")[1]);
        let prevPage = document.getElementById("page-"+this.state.currPageNumber);
        prevPage.style.backgroundColor = "white";
        prevPage.style.color = "black";
        event.target.style.backgroundColor = "blue";
        event.target.style.color = "white";
        this.setState({ currPageNumber: pageNumber});
    }

    // adding new page
    addNewPage(event){
        let nextPageNumber = this.state.data.length + 1;
        let data = this.state.data;
        data.push({
            pageNumber: nextPageNumber,
            questions: []
        });
        this.setState({ data: data });
    }

    // deleting page
    deleteCurrPage(event){
        if(this.state.data.length === 1){
            alert("You have only one page, you can't delete it!");
            return false;
        }

        let data = this.setUpQuestionIds(this.state.data.filter(page => page.pageNumber !== this.state.currPageNumber));
        
        let pageCounter = 0;
        data.map(page => {
            page.pageNumber = (++pageCounter);
            return page;
        });

        let currPage = document.getElementById("page-"+this.state.currPageNumber);
        let prevPage = currPage.previousSibling;
        let pageNumber = this.state.currPageNumber;
        if(prevPage){
            pageNumber = parseInt(prevPage.id.split("-")[1]);
            currPage.style.backgroundColor = "white";
            currPage.style.color = "black";
            prevPage.style.backgroundColor = "blue";
            prevPage.style.color = "white";
        }

        this.setState({ data: data, currPageNumber: pageNumber });
    }

    questionTypeChange(event){
        let newType = event.target.value;
        let questionId = parseInt(event.target.name.split("-")[2]);
        let data = this.state.data;
        for(let page of data){
            if(page.pageNumber === this.state.currPageNumber){
                for(let question of page.questions){
                    if(question.questionId === questionId){
                        let option = null;
                        for(let qOption of question.questionOptions){
                            if(qOption.type === newType){
                                option = qOption;
                                break;
                            }
                        }
                        if(!option){
                            switch(newType){
                                case "input":
                                    option = {
                                        type: newType,
                                        label: "",
                                        answers: []
                                    };
                                    question.questionOptions.push(option);
                                    break;
                                case "radio":
                                case "checkbox":
                                    option = {
                                        type: newType,
                                        label: "",
                                        answers: [{
                                            answerId: 1,
                                            value: ""
                                        }]
                                    };
                                    question.questionOptions.push(option);
                                    break;
                                case "rating":
                                    option = {
                                        type: newType,
                                        label: "",
                                        answers: [{
                                            answerId: 1,
                                            value: "1"
                                        },{
                                            answerId: 2,
                                            value: "2"
                                        },{
                                            answerId: 3,
                                            value: "3"
                                        },{
                                            answerId: 4,
                                            value: "4"
                                        },{
                                            answerId: 5,
                                            value: "5"
                                        }]
                                    };
                                    question.questionOptions.push(option);
                                    break;
                                default:
                            }
                        }
                        question.type = newType;
                        break;
                    }
                }
                break;
            }
        }
        this.setState({ data: data });
    }

    deleteAnswer(event){
        let array = event.target.id.split("-");
        let questionId = parseInt(array[1]);
        let answerId = parseInt(array[3]);
        let data = this.state.data;
        for(let page of data){
            if(page.pageNumber === this.state.currPageNumber){
                for(let question of page.questions){
                    if(question.questionId === questionId){
                        for(let option of question.questionOptions){
                            if(option.type === question.type){
                                option.answers = this.setUpAnswerIds(option.answers.filter(answer => answer.answerId !== answerId));
                                break;
                            }
                        }
                        break;
                    }
                }
                break;
            }
            break;
        }
        this.setState({ data: data });
    }

    addNewAnswer(event){
        let questionId = parseInt(event.target.parentElement.id.split("-")[1]);
        let data = this.state.data;
        for(let page of data){
            if(page.pageNumber === this.state.currPageNumber){
                for(let question of page.questions){
                    if(question.questionId === questionId){
                        for(let option of question.questionOptions){
                            if(question.type !== "input" && option.type === question.type){
                                let nextAnswerId = -1;
                                for(let answer of option.answers){
                                    if(answer.answerId > nextAnswerId){
                                        nextAnswerId = answer.answerId;
                                    }
                                }
                                ++nextAnswerId;
                                option.answers.push({
                                    answerId: nextAnswerId,
                                    value: ""
                                });
                                break;
                            }
                        }
                        break;
                    }
                }
                break;
            }
        }
        this.setState({ data: data});
    }

    removeQuestion(event){
        let questionId = parseInt(event.target.parentElement.id.split("-")[1]);
        let data = this.state.data;
        for(let page of data){
            if(page.pageNumber === this.state.currPageNumber){
                page.questions = page.questions.filter(question => question.questionId !== questionId);
                break;
            }
        }
        data = this.setUpQuestionIds(data);
        this.setState({ data: data });
    }

    addNewQuestion(event){
        let data = this.state.data;
        data.filter(page => page.pageNumber === this.state.currPageNumber)[0].questions.push({
            questionId: 0,
            type: "input",
            questionOptions: [{
                type: "input",
                label: "",
                answers: []
            }]
        });
        data = this.setUpQuestionIds(data);
        this.setState({ data: data });
    }

    saveQuestionText(event){
        let newValue = event.target.value;
        let questionId = parseInt(event.target.id.split("-")[2]);
        let data = this.state.data;
        for(let page of data){
            if(page.pageNumber === this.state.currPageNumber){
                for(let question of page.questions){
                    if(question.questionId === questionId){
                        for(let option of question.questionOptions){
                            if(option.type === question.type){
                                option.label = newValue;
                                break;
                            }
                        }
                        break;
                    }
                }
                break;
            }
        }
        this.setState({ data: data });
    }

    saveAnswerLabel(event){
        let newValue = event.target.value;
        let data = this.state.data;
        if(event.target.id.split("_")[2] === "from"){
            let questionId = parseInt(event.target.id.split("_")[3]);
            data.filter(page => page.pageNumber === this.state.currPageNumber)[0].questions.filter(question => question.questionId === questionId)[0].questionOptions.filter(option => option.type === "rating")[0].answers[0].value = event.target.value;
        }
        else if(event.target.id.split("_")[2] === "to"){
            let questionId = parseInt(event.target.id.split("_")[3]);
            data.filter(page => page.pageNumber === this.state.currPageNumber)[0].questions.filter(question => question.questionId === questionId)[0].questionOptions.filter(option => option.type === "rating")[0].answers[4].value = event.target.value;
        }
        else{
            let array = event.target.id.split("-");
            let questionId = parseInt(array[1]);
            let answerId = parseInt(array[3]);
            for(let page of data){
                if(page.pageNumber === this.state.currPageNumber){
                    for(let question of page.questions){
                        if(question.questionId === questionId){
                            for(let option of question.questionOptions){
                                if(option.type === question.type){
                                    for(let answer of option.answers){
                                        if(answer.answerId === answerId){
                                            answer.value = newValue;
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }
        this.setState({ data: data });
    }

    addQuestionTemplate(event){
        let questionId = parseInt(event.currentTarget.id.split("-")[2]);
        let template = this.questionTemplates.filter(template => template.questionTemplateId === questionId)[0];
        let data = this.state.data;
        data.filter(page => page.pageNumber === this.state.currPageNumber)[0].questions.push({
            questionId: 0,
            type: template.type,
            questionOptions: [{
                type: template.type,
                label: template.label,
                answers: template.answers
            }]
        });
        data = this.setUpQuestionIds(data);
        this.setState({ overlay: false, data: data });
    }

    addToQuestionTemplates(event){
        let questionId = parseInt(event.target.parentElement.id.split("-")[1]);
        let question = this.state.data.filter(page => page.pageNumber === this.state.currPageNumber)[0].questions.filter(question => question.questionId === questionId)[0];
        this.createQuestionTemplate({
            questionId: 0,
            label: question.questionOptions.filter(option => option.type === question.type)[0].label,
            type: question.type,
            answers: question.questionOptions.filter(option => option.type === question.type)[0].answers
        });
    }

    /*
        ----------------
        Render functions
        ----------------
    */

    renderOverlay(){
        return (
            <div id="overlay">
                <div id="template-questions">
                    <h2 id="overlay-title">Question templates</h2>
                    <div id="templates">
                        {this.questionTemplates ? this.renderQuestionTemplates() : "There are no question templates!"}
                    </div>
                    <button id="overlay-back" className="button" onClick={() => this.setState({ overlay: false })}>Back</button>
                </div>
            </div>
        );
    }

    renderQuestionTemplates(){
        return (
            this.questionTemplates.map(template => 
                <div className="question-template" id={"question-template-"+template.questionTemplateId} key={template.questionTemplateId} onClick={this.addQuestionTemplate}>
                    <div className="question-label">{template.label}</div>
                    <div className="question-type">Question type: {template.type}</div>
                    {template.type === "input" ? null : template.type === "rating" ? 
                    <div className="question-answers">
                        <p>Answers:</p>
                        <label>{template.answers[0].value}</label>
                        {template.answers.map(answer => 
                            <input type="radio" key={answer.answerId} id={"question_" + template.questionTemplateId + "_answer_" + answer.answerId} className="rating_answer" disabled/>
                        )}
                        <label>{template.answers[4].value}</label>
                    </div>
                    :
                    <div className="question-answers">
                        <p>Answers:</p>
                        {template.answers.map(answer => 
                            <div id={"answer-"+answer.answerId} key={answer.answerId} className="question-answer">
                                <input type={template.type} name={"answer-"+answer.answerId} disabled></input>
                                <label htmlFor={"answer-"+answer.answerId}>{answer.value}</label>
                            </div>
                        )}
                    </div>}
                </div>
            )
        );
    }

    // rendering current page
    renderQuestionForm(){
        return (
            <div id="content-holder">
                <div id="page-buttons">
                    {this.state.data.map(page => 
                        <button id={"page-"+page.pageNumber} key={page.pageNumber} className="page-button" onClick={this.onPageButtonClicked}>Page {page.pageNumber}</button>
                    )}
                    <button id="new-page" className="page-button" onClick={this.addNewPage}>+</button>
                    <button id="delete-page" className="page-button" onClick={this.deleteCurrPage}>Delete current page</button>
                </div>
                {this.renderQuestions()}
                <div id="buttons-holder">
                    <div id="question-buttons">
                        <button className="button button-left" onClick={this.addNewQuestion}>Add new question</button>
                        <button className="button button-right" onClick={() => this.setState({ overlay: true })}>Add template question</button>
                    </div>
                    <div id="save-buttons">
                        <button className="button button-left" id="save-survey" onClick={this.saveSurvey}>Save survey</button>
                    </div>
                </div>
            </div>
        );
    }

    // rendering questions of page
    renderQuestions(){
        let questions = this.getQuestionsOfCurrentPage();
        if(questions.length === 0){
            return (
                <div id="questions-holder">
                    <p className="message">Empty page</p>
                </div>
            );
        }
        return (
            <div id="questions-holder">
                {questions.map(question =>
                    <div id={"question-"+question.questionId} key={question.questionId} className="create-question">
                        <p><b>{question.questionId}</b></p>
                        <div className="question-type-holder">
                            <label htmlFor={"question-type-"+question.questionId}>Answer type: </label>
                            <select className="question-type" name={"question-type-"+question.questionId} defaultValue={question.type} onChange={this.questionTypeChange}>
                                <option value="input">Text input</option>
                                <option value="radio">Radio buttons</option>
                                <option value="checkbox">Checkboxes</option>
                                <option value="rating">Rating</option>
                            </select>
                        </div>
                        <div className="question-text-holder">
                            <label htmlFor={"question-text-"+question.questionId}>Question text: </label>
                            <input className="question-text" id={"question-text-"+question.questionId} name={"question-text-"+question.questionId} defaultValue={question.questionOptions.filter(option => option.type === question.type)[0].label} onChange={this.saveQuestionText}></input>
                        </div>
                        {question.type === "input" ? null : question.type === "rating" ?
                            <div className="answer-options-holder">
                                <div className="answer-option">
                                    <input type="text" id={"rating_label_from_"+question.questionId} className="rating_label" placeholder="from" defaultValue={question.questionOptions.filter(option => option.type === question.type)[0].answers[0].value} onChange={this.saveAnswerLabel}></input>
                                    {question.questionOptions.filter(option => option.type === question.type)[0].answers.map(answer => 
                                        <input type="radio" key={answer.answerId} disabled className="rating_answer"></input>
                                    )}
                                    <input type="text" id={"rating_label_to_"+question.questionId} className="rating_label" placeholder="to" defaultValue={question.questionOptions.filter(option => option.type === question.type)[0].answers[4].value} onChange={this.saveAnswerLabel}></input>
                                </div>
                            </div> 
                            :
                            <div className="answer-options-holder">
                                <label>Answer options:</label>
                                {question.questionOptions.filter(option => option.type === question.type)[0].answers.map(answer => 
                                    <div className="answer-option" key={answer.answerId}>
                                        <input type={question.type} id={"question-"+question.questionId+"-answer-"+answer.answerId} name={"question-answer-"+question.questionId} disabled></input>
                                        <label htmlFor={"question-"+question.questionId+"-answer-"+answer.answerId}><input type="text" id={"question-"+question.questionId+"-answer-"+answer.answerId+"-label"} name={"question-answer-label-"+question.questionId} defaultValue={answer.value} onChange={this.saveAnswerLabel}></input></label>
                                        <button id={"q-"+question.questionId+"-a-"+answer.answerId} className="delete-answer-button" onClick={this.deleteAnswer}>x</button>
                                    </div>
                                )}
                            </div>
                        }
                        {question.type === "input" || question.type === "rating" ? null : <button className="button add-answer-button" onClick={this.addNewAnswer}>Add answer</button>}
                        <button className="button add-to-templates-button" onClick={this.addToQuestionTemplates}>Add to question templates</button>
                        <button className="button remove-question-button" onClick={this.removeQuestion}>Remove question</button>
                    </div>
                )}
            </div>
        );
    }

    render(){
        if(this.state.error){
            return (
                <div>
                    <div id="homepage_button_holder">
                        <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                    </div>
                    <p>{this.state.error}</p>
                </div>
            );
        }
        else if(this.state.loading){
            return (
                <div>
                    <div id="homepage_button_holder">
                        <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                    </div>
                    <p>Loading...</p>
                </div>
            );
        }
        else{
            return (
                <div id="create-survey-page">
                    <div id="homepage_button_holder">
                        <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                    </div>
                    <h2 id="edit_question_title">Edit Form's Questions</h2>
                    {this.renderQuestionForm()}
                    {this.state.overlay ? this.renderOverlay() : null}
                </div>
            );
        }
    }
}