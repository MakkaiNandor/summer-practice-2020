import React, { Component } from 'react';
import './EditFormQuestion.css';
import { Link } from 'react-router-dom';

export class EditFormQuestion extends Component {
    static displayName = EditFormQuestion.name;

    constructor(props){
        super(props);

        this.state = {
            error: null,
            loading: true,
            currPageNumber: 1,
            data: []
        };

        this.survey = null;
    
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
    }


    componentDidMount(){
        this.getSurvey();
    }

    async getSurvey(){
        const response = await fetch('https://localhost:44309/Survey/getSurvey/' + this.props.match.params.id);
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



        const response = await fetch('https://localhost:44309/Survey/editSurvey/' + this.props.match.params.id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.survey)
        });
        if(!response.ok) alert("Survey saving failed!");
        else alert("Survey saved!");
        window.location.href = window.location.href.replace("editformquestion/" + this.props.match.params.id, "SurveyDashboard");
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
                                option.answers = this.setUpAnswerIds(option.answers.filter(answer => {return answer.answerId !== answerId}));
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
        let newValue = event.target.value;
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
        this.setState({ data: data });
    }

    /*
        ----------------
        Render functions
        ----------------
    */

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
                        <button className="button button-right">Add template question</button>
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
                            </select>
                        </div>
                        <div className="question-text-holder">
                            <label htmlFor={"question-text-"+question.questionId}>Question text: </label>
                            <input className="question-text" id={"question-text-"+question.questionId} name={"question-text-"+question.questionId} defaultValue={question.questionOptions.filter(option => { return option.type === question.type })[0].label} onChange={this.saveQuestionText}></input>
                        </div>
                        {question.type === "input" ? null : 
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
                        {question.type === "input" ? null : <button className="button add-answer-button" onClick={this.addNewAnswer}>Add answer</button>}
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
                </div>
            );
        }
    }
}