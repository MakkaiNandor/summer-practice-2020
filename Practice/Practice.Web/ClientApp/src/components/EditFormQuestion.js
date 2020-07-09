import React, { Component } from 'react';

export class EditFormQuestion extends Component {
    static displayName = EditFormQuestion.name;

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            error: null,
            numberOfPages: null,
            currPage: 0,
            firstPage: true,
            lastPage: false,
            submitted: false,
            answers: {}
        };

        this.prevPage = this.prevPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.selectType= this.selectType.bind(this);
        //this.addNewElement= this.addNewElement.bind(this);
        this.submitChangesSurvey = this.submitChangesSurvey.bind(this);
        this.submitChangesTemplate = this.submitChangesTemplate.bind(this);
        this.addToTemplates= this.addToTemplates.bind(this);

        this.survey=null;

        this.descriptions = {page_title:"Edit the form's questions"};
    }

    async getSurvey(){
        const response = await fetch('https://localhost:44309/Survey/getSurvey/' + this.props.match.params.id);
        if(!response.ok) this.setState({ error: "Survey's questions not found!" });
        else{
            this.survey = await response.json();
            if(this.survey.status ==="closed"){
                this.setState({ error: "Survey is not active, the questions cannot be changed!" });
            }
            else{
                this.generateList();
                if(this.survey.pages.length === 1) this.setState({lastPage: true});
                this.setState({loading: false, numberOfPages: this.survey.pages.length });
                
            }
        }
    }

    componentDidMount(){
        this.getSurvey();
    }

    generateList(){
        let response=null;
        let result=null;
        this.survey.pages[this.state.currPage].questions.map(question =>
            {switch(question.type){
                case "radio":
                    let x1 = 0;
                    response =(
                        <div className="answer">
                            <input type="radio" id={x1}/>
                            <label htmlFor={x1++}><input type="text" /></label>
                        </div>);
                    result={"response":response,"id":question.questionId,"type":question.type};
                    //console.log(result);
                    break;
                case "checkbox":
                    let x2 = 0;
                    response=(
                        <div className="answer">
                            <input type="checkbox" id={x2}/>
                            <label htmlFor={x2++}><input type="text" /></label>
                        </div>);
                    result={"response":response,"id":question.questionId,"type":question.type}; 
                    break;
                case "rating":
                    let x3 = 0;
                    response=(
                        <div className="answer">
                            <input type="radio" id={x3}/>
                            <label htmlFor={x3++}><input type="text" /></label>
                        </div>);
                    result={"response":response,"id":question.questionId,"type":question.type};
                    break;
                default:
                    response = null;
                    result={"response":response,"id":question.questionId,"type":question.type};
                    break;
                }
                let temp = this.state.answers;
                temp[question.questionId.toString()]=result;
                this.setState({answers:temp});
            }
        )
    }

    nextPage(){
        //this.saveAnswersOfPage();
        if(this.state.firstPage) this.setState({ firstPage: false });
        if(this.state.currPage === this.state.numberOfPages - 2) this.setState({ lastPage: true });
        this.setState({ currPage: this.state.currPage + 1 });
    }
    
    prevPage(){
        //this.saveAnswersOfPage();
        if(this.state.lastPage) this.setState({ lastPage: false });
        if(this.state.currPage === 1) this.setState({ firstPage: true });
        this.setState({ currPage: this.state.currPage - 1 });
    }

    generateQuestions(){
        //console.log(this.state.answers);
        return (
            this.survey.pages[this.state.currPage].questions.map(question => 
                <div className="question" id={"question_" + question.questionId} key={question.questionId}>
                    <div><b>Answer type: </b>   
                        <select name="answer_type" id={question.questionId} onChange={this.selectType}>
                            <option value="">Select new type</option>
                            <option value="text">Text</option>
                            <option value="radio">Radio</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="rating">Rating</option>
                        </select>
                    </div>
                    <p className="question-label"><b>Question text: </b><input type="text" defaultValue={question.label} /></p>
                    {this.state.answers[question.questionId].response}
                    <button onClick={this.addToTemplates}>Add question to templates</button>
                    <button>Remove question from survey</button>
                </div>
            )
        );
    }

    /*addNewElement(event){
        let response=null;
        let result=null;
        switch(this.state.answers[event.target.id.toString()].type){
            case "radio":
                let x1 = 1;
                response =(
                    <div className="answer">
                        <input type="radio" id={x1}/>
                        <label htmlFor={x1++}><input type="text" /></label>
                        <button onClick={this.addNewElement}>Add</button>
                    </div>);
                result={"response":response,"id":event.target.id,"type":"radio"};
                console.log(result);
                break;
                case "checkbox":
                    let x2 = 1;
                    response=(
                        <div className="answer">
                            <input type="checkbox" id={x2}/>
                            <label htmlFor={x2++}><input type="text" /></label>
                            <button onClick={this.addNewElement}>Add</button>
                        </div>);
                    result={"response":response,"id":event.target.id,"type":"checkbox"}; 
                    break;
                case "rating":
                    let x3 = 1;
                    response=(
                        <div className="answer">
                            <input type="radio" id={x3}/>
                            <label htmlFor={x3++}><input type="text" /></label>
                            <button onClick={this.addNewElement}>Add</button>
                        </div>);
                    result={"response":response,"id":event.target.id,"type":"rating"};
                    break;
                default:
                    if(event.target.value === "text"){
                        response = null;
                        result={"response":response,"id":event.target.id,"type":"input"};
                    }else{
                        response = null;
                        result={"response":response,"id":event.target.id,"type":event.target.value};
                    }
                    break;
        }
        let temp = this.state.answers;
        temp[event.target.id.toString()]=result;
        var clonedElement = React.cloneElement(
            this.state.answers, temp);
        return clonedElement;
    }*/

    selectType(event){
        let response=null;
        let result=null;
        switch(event.target.value){
            case "radio":
                let x1 = 0;
                response =(
                    <div className="answer">
                        <input type="radio" id={x1}/>
                        <label htmlFor={x1++}><input type="text" /></label>
                        <button id={event.target.id} onClick={this.addNewElement}>Add option</button>
                    </div>);
                result={"response":response,"id":event.target.id,"type":"radio"};
                //console.log(result);
                break;
            case "checkbox":
                let x2 = 0;
                response=(
                    <div className="answer">
                        <input type="checkbox" id={x2}/>
                        <label htmlFor={x2++}><input type="text" /></label>
                        <button onClick={this.addNewElement}>Add option</button>
                    </div>);
                result={"response":response,"id":event.target.id,"type":"checkbox"}; 
                break;
            case "rating":
                let x3 = 0;
                response=(
                    <div className="answer">
                        <input type="radio" id={x3}/>
                        <label htmlFor={x3++}><input type="text" /></label>
                        <button onClick={this.addNewElement}>Add option</button>
                    </div>);
                result={"response":response,"id":event.target.id,"type":"rating"};
                break;
            default:
                if(event.target.value === "text"){
                    response = null;
                    result={"response":response,"id":event.target.id,"type":"input"};
                }else{
                    response = null;
                    result={"response":response,"id":event.target.id,"type":event.target.value};
                }
                break;
        }
        //console.log(this.state.answers);
        let temp = this.state.answers;
        temp[event.target.id.toString()]=result;
        this.setState({answers:temp});
    }

    submitChangesSurvey(){
        this.submitChangesOnSurvey();
    }

    async submitChangesOnSurvey(){
        const response = await fetch('https://localhost:44309/Survey/editSurvey/' + this.survey.surveyId, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.survey)
        });
        console.log(response);
        if(response.ok){
            window.location.href = window.location.href.replace("editform/" + this.survey.surveyId,"SurveyDashboard");
        }
    }

    submitChangesTemplate(){
        this.submitChangesOnTemplate();
    }

    async submitChangesOnTemplate(){
        const response = await fetch('https://localhost:44309/SurveyTemplate/editSurveyTemplate/' + this.survey.surveyId, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.survey)
        });
        console.log(response);
        if(response.ok){
            window.location.href = window.location.href.replace("editform/" + this.survey.surveyId,"TemplateDashboard");
        }
    }

    async addToTemplates(){
        const response = await fetch('https://localhost:44309/QuestionTemplate/createQuestionTemplate', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            //body: JSON.stringify(this.survey)
        });
    }


    render() {
        if(this.state.error){
            return (
                <p>{this.state.error}</p>
            );
        }
        else if(this.state.loading){
            return (
                <p>Loading the questions...</p>
            );
        }
        else{
            let prevPageButton = !this.state.firstPage ? <button className="survey-button" onClick={this.prevPage}>Edit Previous Page</button> : null;
            let nextPageButton = !this.state.lastPage ? <button className="survey-button" onClick={this.nextPage}>Edit Next Page</button> : null;
            return (
                <div>
                    <div>
                        <h2 id="survey_title">{this.descriptions.page_title}</h2>
                        <div className="question-holder">
                            {this.generateQuestions()}
                        </div>
                        {prevPageButton}
                        {nextPageButton}
                    </div>
                    <div>
                        <button>Add a new question</button>
                        <button>Add a template question</button>
                        <button onClick={this.submitChangesSurvey}>Save the changes as survey</button>
                        <button onClick={this.submitChangesTemplate}>Save the changes as template</button>
                    </div>
                </div>
            );
        }
    }
}