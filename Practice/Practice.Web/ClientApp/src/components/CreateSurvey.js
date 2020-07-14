import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './CreateSurvey.css';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';

export class CreateSurvey extends Component {
    static displayName = CreateSurvey.name;

    constructor(props){
        super(props);

        this.state = {
            error: null,
            loading: true,
            pageStatus: this.props.match.path === "/EditTemplate/:id" ? "edit_1" : "templates",
            baseTemplate: null,
            currPageNumber: null,
            data: [],
            overlay: false,
            redirect: false,
            target: "",
            surveyTemplates: null
        };

        this.survey = null;
        this.questionTemplates = null;
        this.personalData = {
            name: {
                type: "input",
                label: "What's your name?",
                answer: ""
            },
            age: {
                type: "input",
                label: "How old are you?",
                answer: ""
            },
            email: {
                type: "input",
                label: "What's your email address?",
                answer: ""
            },
            gender: {
                type: "radio",
                label: "Select your gender:",
                answer: [{
                    answerId: 1,
                    value: "Male"
                },{
                    answerId: 2,
                    value: "Female"
                }]
            }
        };

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
        this.questionTypeChange = this.questionTypeChange.bind(this);
        this.deleteAnswer = this.deleteAnswer.bind(this);
        this.addNewAnswer = this.addNewAnswer.bind(this);
        this.removeQuestion = this.removeQuestion.bind(this);
        this.addNewQuestion = this.addNewQuestion.bind(this);
        this.saveQuestionText = this.saveQuestionText.bind(this);
        this.saveAnswerLabel = this.saveAnswerLabel.bind(this);
        this.searchTemplate = this.searchTemplate.bind(this);
        this.addQuestionTemplate = this.addQuestionTemplate.bind(this);
        this.addToQuestionTemplates = this.addToQuestionTemplates.bind(this);
    }


    componentDidMount(){
        if(this.props.match.path === "/EditTemplate/:id") this.getTemplate();
        else this.getAllSurveyTemplates();
        this.getAllQuestionTemplates();
    }

    /*
        -------------------------------
        Asynchronous database functions
        -------------------------------
    */

    // get all survey templates
    async getAllSurveyTemplates(){
        const cookies = new Cookies();
        var token = cookies.get('token');
        const response = await fetch('https://localhost:44309/SurveyTemplate/getAllSurveyTemplates',{
            headers: {
                'Authorization': `Bearer ${token}`
                
            }
        });
        if(!response.ok) this.setState({ error: "There are no form templates!" });
        else{
            this.state.surveyTemplates = await response.json();
            this.setState({ loading: false });
        }
    }

    async getTemplate(){
        const cookies = new Cookies();
        var token = cookies.get('token');
        const response = await fetch('https://localhost:44309/SurveyTemplate/getSurveyTemplateById/' + this.props.match.params.id,{
            headers: {
                'Authorization': `Bearer ${token}`
                
            }
        });
        if(!response.ok) this.setState({ error: "Survey template not found!" });
        else {
            let template = await response.json();
            this.setState({ baseTemplate: template, loading: false, data: template.pages.reduce((acc1, page) => {
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
    }

    // save data as survey
    async saveAsSurvey(){
        const cookies = new Cookies();
        var token = cookies.get('token');
        const response = await fetch('https://localhost:44309/Survey/createSurvey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(this.survey)
        });
        if(!response.ok) alert("Survey saving failed!");
        else{
            alert("Survey saved!");
            this.setState({ redirect: true, target: "/SurveyDashboard" });
        }
    }

    // save data as template
    async saveAsTemplate(){
        const cookies = new Cookies();
        var token = cookies.get('token');
        const response = await fetch('https://localhost:44309/SurveyTemplate/createSurveyTemplate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(this.survey)
        });
        if(!response.ok) alert("Survey saving failed!");
        else{
            alert("Survey saved as template!");
            this.setState({ redirect: true, target: "/TemplateDashboard" });
        }
    }

    async editSurveyTemplate(){
        const cookies = new Cookies();
        var token = cookies.get('token');
        const response = await fetch('https://localhost:44309/SurveyTemplate/editSurveyTemplate/' + this.props.match.params.id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(this.state.baseTemplate)
        });
        if(!response.ok) alert("Template saving failed!");
        else{
            alert("Template saved!");
            this.setState({ redirect: true, target: "/TemplateDashboard" });
        }
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
    
    // get selected template by id
    getTemplateById(templateId){
        let result = null;
        this.state.surveyTemplates.forEach(template => {
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

    // save data of properties
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

    // template selection
    onTemplateClicked(event){
        if(event.target.id === "template-default"){
            let template = {
                surveyTemplateId: 0,
                used: 0,
                createdSurveys: [],
                name: "Default",
                title: "",
                description: "",
                createDate: null,
                ending: "",
                pages: [{
                    pageNumber: 1,
                    questions: [{
                        questionId: 1,
                        label: "",
                        type: "input",
                        answers: []
                    }]
                }]
            }; 
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
            }, []) })
            return;
        }
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

    // back to the templates
    backToTheTemplates(event){
        event.preventDefault();
        this.setState({ pageStatus: "templates", baseTemplate: null , data: [] });
    }

    // next to the questions
    nextToTheQuestions(event){
        event.preventDefault();
        this.saveProperties();
        if(this.state.pageStatus === "edit_1") this.setState({ pageStatus: "edit_2", currPageNumber: 1 });
        else this.setState({ pageStatus: "creation_2", currPageNumber: 1 });
    }

    // back to the properties
    backToTheProperties(event){
        if(this.state.pageStatus === "edit_2") this.setState({ pageStatus: "edit_1" });
        else this.setState({ pageStatus: "creation_1" });
    }

    // saving data (as survey or template)
    saveSurveyClicked(event){
        //this.saveQuestions();
        if(event.target.id === "edit-template"){
            this.editSurveyTemplate();
            return;
        }
        this.survey = {
            surveyId: 0,
            title: this.state.baseTemplate.title,
            description: this.state.baseTemplate.description,
            ending: this.state.baseTemplate.ending,
            createDate: new Date().toISOString().replace("Z","+00:00"),
            expirationDate: this.state.baseTemplate.expirationDate,
            status: "created",
            creator: null,
            personalData: this.personalData,
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

        let data = this.setUpQuestionIds(this.state.data.filter(page => {
            return page.pageNumber !== this.state.currPageNumber;
        }));
        
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
                                option.answers = /*this.setUpAnswerIds(*/option.answers.filter(answer => {return answer.answerId !== answerId})/*)*/;
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
                page.questions = page.questions.filter(question => {return question.questionId !== questionId});
                break;
            }
        }
        data = this.setUpQuestionIds(data);
        this.setState({ data: data });
    }

    addNewQuestion(event){
        let data = this.state.data;
        data.filter(page => {return page.pageNumber === this.state.currPageNumber})[0].questions.push({
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
            let newValue = event.target.value;
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
        let template = this.questionTemplates.filter(template => {return template.questionTemplateId === questionId})[0];
        let data = this.state.data;
        data.filter(page => {return page.pageNumber === this.state.currPageNumber})[0].questions.push({
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
        let question = this.state.data.filter(page => {return page.pageNumber === this.state.currPageNumber})[0].questions.filter(question => {return question.questionId === questionId})[0];
        this.createQuestionTemplate({
            questionId: 0,
            label: question.questionOptions.filter(option => {return option.type === question.type})[0].label,
            type: question.type,
            answers: question.questionOptions.filter(option => {return option.type === question.type})[0].answers
        });
    }

    searchTemplate(){
        let input = document.getElementById("search_button");
        let filter = input.value.toUpperCase();
        let holder = document.getElementById("survey-template-holder");
        let button = holder.getElementsByTagName("button");
        for (let i = 0; i < button.length; ++i) {
            let a = button[i];
            let txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                button[i].style.display = "";
            } else {
                button[i].style.display = "none";
            }
        }
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

    // rendering survey templates
    renderSurveyTemplates(){
        return (
            <div>
                <div id="search_button_holder">
                    <input id="search_button" type="text" name="search" placeholder="Search.." onKeyUp={this.searchTemplate} title="Type in a template name"></input>
                </div>
                <div id="survey-template-holder">
                <button id="template-default" className="template-button" key="0" onClick={this.onTemplateClicked}>Default</button>
                    {this.state.surveyTemplates.map(template => 
                        <button id={"template-"+template.surveyTemplateId} className="template-button" key={template.surveyTemplateId} onClick={this.onTemplateClicked}>{template.name}</button>
                    )}
                </div>
            </div>
        );
    }

    // rendering form of properties
    renderPropertiesForm(edit){
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
                {edit ? <div className="label-holder"><label htmlFor="name">Name:</label></div> : null}
                {edit ? <div className="input-holder"><input type="text" name="name" defaultValue={this.state.baseTemplate.name}></input></div> : null}
                <div className="label-holder">
                    <label htmlFor="title">Title:</label>
                </div>
                <div className="input-holder">
                    <input type="text" name="title" defaultValue={this.state.baseTemplate.title}></input>
                </div>
                {edit ? null : <div className="label-holder"><label htmlFor="expirationDate">Expiration date:</label></div>}
                {edit ? null : <div className="input-holder">
                    <input type="date" id="date" name="expirationDate" min={date} defaultValue={date}></input>
                    <input type="time" id="time" name="expirationDate" defaultValue="00:00"></input>
                </div>}
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
                    {edit ? null : <button className="button float-button-left" onClick={this.backToTheTemplates}>Back to the templates</button>}
                    <button className="button float-button-right" onClick={this.nextToTheQuestions}>Next to the questions</button>
                </div>
            </form>
        );
    }

    // rendering current page
    renderQuestionForm(edit){
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
                {this.renderQuestions()}
                <div id="buttons-holder">
                    <div id="question-buttons">
                        <button className="button button-left" onClick={this.addNewQuestion}>Add new question</button>
                        <button className="button button-right" onClick={() => this.setState({ overlay: true })}>Add template question</button>
                    </div>
                    <div id="save-buttons">
                        {edit ? null : <button className="button button-left" id="save-as-survey" onClick={this.saveSurveyClicked}>Save as survey</button>}
                        {edit ? null : <button className="button button-right" id="save-as-template" onClick={this.saveSurveyClicked}>Save as template</button>}
                        {edit ? <button className="button" id="edit-template" onClick={this.saveSurveyClicked}>Save template</button> : null}
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
                            <input className="question-text" id={"question-text-"+question.questionId} name={"question-text-"+question.questionId} defaultValue={question.questionOptions.filter(option => { return option.type === question.type })[0].label} onChange={this.saveQuestionText}></input>
                        </div>
                        {question.type === "input" ? null : question.type === "rating" ?
                            <div className="answer-options-holder">
                                <div className="answer-option">
                                    <input type="text" id={"rating_label_from_"+question.questionId} className="rating_label" placeholder="from"  onChange={this.saveAnswerLabel}></input>
                                    {question.questionOptions.filter(option => { return option.type === question.type })[0].answers.map(answer => 
                                        <input type="radio" key={answer.answerId} disabled className="rating_answer"></input>
                                    )}
                                    <input type="text" id={"rating_label_to_"+question.questionId} className="rating_label" placeholder="to"  onChange={this.saveAnswerLabel}></input>
                                </div>
                            </div> 
                            :
                            <div className="answer-options-holder">
                                <label>Answer options:</label>
                                {question.questionOptions.filter(option => { return option.type === question.type })[0].answers.map(answer => 
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
        else if(this.state.redirect){
            return (
                <Redirect to={this.state.target}/>
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
                    content = this.renderPropertiesForm(false);
                    break;
                case "creation_2":
                    message = "Base template: " + this.state.baseTemplate.name;
                    content = this.renderQuestionForm(false);
                    break;
                case "edit_1":
                    content = this.renderPropertiesForm(true);
                    break;
                case "edit_2":
                    content = this.renderQuestionForm(true);
                    break;
                default:
            }
            return (
                <div id="create-survey-page">
                    <div id="homepage_button_holder">
                        <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                    </div>
                    <h2 id="title">Create Form</h2>
                    <p className="message">{message}</p>
                    {content}
                    {this.state.overlay ? this.renderOverlay() : null}
                </div>
            );
        }
    }
}