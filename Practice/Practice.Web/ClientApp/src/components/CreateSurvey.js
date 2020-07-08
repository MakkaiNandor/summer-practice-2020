import React, { Component } from 'react';
import './CreateSurvey.css';

export class CreateSurvey extends Component {
    static displayName = CreateSurvey.name;

    constructor(props){
        super(props);

        this.state = {
            error: null,
            loading: true,
            pageStatus: "templates",
            baseTemplate: null,
            currPageNumber: null,
            data: []
        };

        this.survey = null;
        this.surveyTemplates = null;

        this.onTemplateClicked = this.onTemplateClicked.bind(this);
        this.nextToTheQuestions = this.nextToTheQuestions.bind(this);
        this.backToTheTemplates = this.backToTheTemplates.bind(this);
        this.backToTheProperties = this.backToTheProperties.bind(this);
        this.onPageButtonClicked = this.onPageButtonClicked.bind(this);
        this.addNewPage = this.addNewPage.bind(this);
        this.deleteCurrPage = this.deleteCurrPage.bind(this);
        this.getQuestionsOfCurrentPage = this.getQuestionsOfCurrentPage.bind(this);
        this.renderQuestions = this.renderQuestions.bind(this);
        this.saveSurveyClicked = this.saveSurveyClicked.bind(this);
    }

    componentDidMount(){
        this.getAllSurveyTemplates();
    }

    async getAllSurveyTemplates(){
        const response = await fetch('https://localhost:44309/SurveyTemplate/getAllSurveyTemplates');
        if(!response.ok) this.setState({ error: "There are no form templates!" });
        else{
            this.surveyTemplates = await response.json();
            this.setState({ loading: false });
        }
    }

    onTemplateClicked(event){
        let templateId = parseInt(event.target.id.split("-")[1]);
        let template = this.getTemplateById(templateId);
        this.setState({ pageStatus: "creation_1", baseTemplate: template, data: template.pages.reduce((acc1, page) => {
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
        }, []) });
    }

    /*
    questionsAndAnswers = [{
        pageNumber: 1,
        questions: [{
            questionId: 1,
            type: "radio",
            questionOptions: [{
                type: "radio",
                answers: [{
                    answerId: 1,
                    value: "Yes"
                },{
                    anserId: 2,
                    value: "No"
                }]
            }]
        }]
    }];
    */
    
    getTemplateById(templateId){
        let result = null;
        this.surveyTemplates.forEach(template => {
            if(template.surveyTemplateId === templateId){
                result = template;
                return;
            }
        });
        if(result && !result.pages) result.pages = [];
        if(result.pages.length === 0) result.pages.push({
            pageNumber: 1,
            questions: []
        });
        return result;
    }

    renderSurveyTemplates(){
        return (
            <div id="survey-template-holder">
                {this.surveyTemplates.map(template => 
                    <button id={"template-"+template.surveyTemplateId} className="template-button" key={template.surveyTemplateId} onClick={this.onTemplateClicked}>{template.name}</button>
                )}
            </div>
        );
    }

    renderPropertiesForm(){
        let date = null;
        if(this.state.baseTemplate.expirationDate){
            date = this.state.baseTemplate.expirationDate.slice(0, 10);
        }
        else{
            let datetime = new Date();
            datetime.setDate(datetime.getDate() + 1);
            date = datetime.toISOString().slice(0, 10);
        }
        return (
            <form id="properties-form">
                <div className="label-holder">
                    <label htmlFor="title">Title:</label>
                </div>
                <div className="input-holder">
                    <input type="text" name="title" defaultValue={this.state.baseTemplate.title}></input>
                </div>
                <div className="label-holder">
                    <label htmlFor="expirationDate">Expiration date:</label>
                </div>
                <div className="input-holder">
                    <input type="date" id="date" name="expirationDate" min={date} defaultValue={date}></input>
                    <input type="time" id="time" name="expirationDate" defaultValue="00:00"></input>
                </div>
                <div className="label-holder">
                    <label htmlFor="description">Description:</label>
                </div>
                <div className="input-holder">
                    <textarea name="description" defaultValue={this.state.baseTemplate.description}></textarea>
                </div>
                <div className="label-holder">
                    <label htmlFor="ending">Footer description:</label>
                </div>
                <div className="input-holder">
                    <textarea name="ending" defaultValue={this.state.baseTemplate.ending}></textarea>
                </div>
                <div className="buttons">
                    <button className="button float-button-left" onClick={this.backToTheTemplates}>Back to the templates</button>
                    <button className="button float-button-right" onClick={this.nextToTheQuestions}>Next to the questions</button>
                </div>
            </form>
        );
    }

    saveProperties(){
        let answers = Array.from(document.getElementsByClassName("input-holder"));
        let template = this.state.baseTemplate;
        answers.forEach(answer => {
            let value = null;
            if(answer.children.length === 2) value = answer.children[0].value + "T" + answer.children[1].value + ":00.000+00:00";
            else value = answer.children[0].value;
            template[answer.children[0].name] = value;
        });
        this.setState({ baseTemplate: template });
    }

    backToTheTemplates(event){
        event.preventDefault();
        this.setState({ pageStatus: "templates", baseTemplate: null , data: [] });
    }

    nextToTheQuestions(event){
        event.preventDefault();
        this.saveProperties();
        this.setState({ pageStatus: "creation_2", currPageNumber: 1 });
    }

    backToTheProperties(event){
        this.setState({ pageStatus: "creation_1" });
    }

    renderQuestionForm(){
        console.log(this.state.data);
        return (
            <div id="content-holder">
                <button className="button back-button" onClick={this.backToTheProperties}>Back to the properties</button>
                <div id="page-buttons">
                    {this.state.data.map(page => 
                        <button id={"page-"+page.pageNumber} key={page.pageNumber} className="page-button" onClick={this.onPageButtonClicked}>Page {page.pageNumber}</button>
                    )}
                    <button id="new-page" className="page-button" onClick={this.addNewPage}>+</button>
                    <button id="delete-page" className="page-button" onClick={this.deleteCurrPage}>Delete current page</button>
                </div>
                {this.state.currPageNumber}
                {this.renderQuestions()}
                <div id="buttons-holder">
                    <div id="question-buttons">
                        <button className="button button-left">Add new question</button>
                        <button className="button button-right">Add template question</button>
                    </div>
                    <div id="save-buttons">
                        <button className="button button-left" id="save-as-survey" onClick={this.saveSurveyClicked}>Save as survey</button>
                        <button className="button button-right" id="save-as-template" onClick={this.saveSurveyClicked}>Save as template</button>
                    </div>
                </div>
            </div>
        );
    }

    saveCurrPage(){

    }

    async saveAsSurvey(){
        const response = await fetch('https://localhost:44309/Survey/createSurvey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.survey)
        });
        if(!response.ok) alert("Survey saving failed!");
        else alert("Survey saved!");
    }

    async saveAsTemplate(){
        const response = await fetch('https://localhost:44309/SurveyTemplate/createSurveyTemplate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.survey)
        });
        if(!response.ok) alert("Survey saving failed!");
        else alert("Survey saved as template!");
    }

    saveSurveyClicked(event){
        //this.saveQuestions();
        this.survey = {
            surveyId: 0,
            title: this.state.baseTemplate.title,
            description: this.state.baseTemplate.description,
            ending: this.state.baseTemplate.ending,
            createDate: new Date().toISOString().replace("Z","+00:00"),
            expirationDate: this.state.baseTemplate.expirationDate,
            status: "created",
            creator: null,
            personalData: null,
            pages: this.state.data.map(page => {return {
                pageNumber: page.pageNumber,
                questions: page.questions.map(question => {
                    let answersOfQuestion = question.questionOptions.filter(option => { return option.type === question.type })[0];
                    return {
                        questionId: question.questionId,
                        type: question.type,
                        label: answersOfQuestion.label,
                        answers: answersOfQuestion.answers
                }})
            }})
        };
        if(event.target.id === "save-as-survey") this.saveAsSurvey();
        else this.saveAsTemplate();
    }

    onPageButtonClicked(event){
        let pageNumber = parseInt(event.target.id.split("-")[1]);
        let prevPage = document.getElementById("page-"+this.state.currPageNumber);
        prevPage.style.backgroundColor = "white";
        prevPage.style.color = "black";
        event.target.style.backgroundColor = "blue";
        event.target.style.color = "white";
        this.setState({ currPageNumber: pageNumber});
    }

    addNewPage(event){
        let nextPageNumber = this.state.data.length + 1;
        let data = this.state.data;
        data.push({
            pageNumber: nextPageNumber,
            questions: []
        });
        this.setState({ data: data });
    }

    deleteCurrPage(event){
        if(this.state.data.length === 1){
            alert("You have only one page, you can't delete it!");
            return false;
        }

        let data = this.state.data.filter(page => {
            return page.pageNumber !== this.state.currPageNumber;
        });
        
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

    getQuestionsOfCurrentPage(){
        let page = this.state.data.filter(page => {
            return page.pageNumber === this.state.currPageNumber;
        });
        return page.length === 1 ? page[0].questions : [];
    }

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
                            <select className="question-type" name={"question-type-"+question.questionId} defaultValue={question.type} onChange={this.changedQuestionType}>
                                <option value="input">Text input</option>
                                <option value="radio">Radio buttons</option>
                                <option value="checkbox">Checkboxes</option>
                            </select>
                        </div>
                        <div className="question-text-holder">
                            <label htmlFor={"question-text-"+question.questionId}>Question text: </label>
                            <input className="question-text" name={"question-text-"+question.questionId} defaultValue={question.questionOptions.filter(option => { return option.type === question.type })[0].label}></input>
                        </div>
                        {question.type === "input" ? null : 
                            <div className="answer-options-holder">
                                <label>Answer options:</label>
                                {question.questionOptions.filter(option => { return option.type === question.type })[0].answers.map(answer => 
                                    <div className="answer-option" key={answer.answerId}>
                                        <input type={question.type} id={"question-"+question.questionId+"-answer-"+answer.answerId} name={"question-answer-"+question.questionId} disabled></input>
                                        <label htmlFor={"question-"+question.questionId+"-answer-"+answer.answerId}><input type="text" name={"question-answer-label-"+question.questionId} defaultValue={answer.value}></input></label>
                                    </div>
                                )}
                            </div>
                        }
                    </div>
                )}
            </div>
        );
    }

    changedQuestionType(event){
        /*let data = this.state.data;
        let page = data.pages.filter(page => {return page.pageNumber === this.state.currPageNumber})[0];
        let 
        switch(event.target.value){
            case "input":

                break;
            case "radio":

                break;
            case "checkbox":

                break;
            default:
        }
        this.setState({ data: data });*/
    }

    render(){
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
        else{
            let content = null, message = null;
            switch(this.state.pageStatus){
                case "templates":
                    message = "Select a form template";
                    content = this.renderSurveyTemplates();
                    break;
                case "creation_1":
                    message = "Base template: " + this.state.baseTemplate.name;
                    content = this.renderPropertiesForm();
                    break;
                case "creation_2":
                    message = "Base template: " + this.state.baseTemplate.name;
                    content = this.renderQuestionForm();
                    break;
                default:
            }
            return (
                <div id="create-survey-page">
                    <h2 id="title">Create Form</h2>
                    <p className="message">{message}</p>
                    {content}
                </div>
            );
        }
    }
}