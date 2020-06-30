import React, { Component } from 'react';
import './Survey.css';

export class Survey extends Component {
  static displayName = Survey.name;

    constructor(props) {
        super(props);
        this.state = {  
            loading: true, 
            not_found: false, 
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
            if(this.survey.pages.length === 1) this.setState({last_page: true});
            this.setState({loading: false, questions: this.survey.pages[0].questions});
        }
    }

    componentDidMount(){
        this.getSurvey();
    }

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

    generateAnswers(question){
        switch(question.type){
            case "input":
                return (
                    <div className="answer">
                        <input type="text" id={"question_" + question.questionId + "_answer_0"} name={"question_" + question.questionId} defaultValue={this.getDefaultValue(question.questionId, 0)}/>
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
        /*var answers = Array.from(document.getElementsByClassName("answer"));
        answers.forEach(answerDiv => {
            let inputElement = answerDiv.getElementsByTagName('INPUT')[0];
            let array = inputElement.id.split("_");
            let questionId = parseInt(array[1]);
            let answerId = array.length < 4 ? 0 : parseInt(array[3]);
            if(!this.user_answers[questionId]) this.user_answers[questionId] = [];
            if(array.length < 4 || (array.length === 4 && inputElement.checked)){
                this.user_answers[questionId][answerId] = inputElement.value;
            }
            else if(array.length === 4 && !inputElement.checked && this.user_answers[questionId][answerId]){
                this.user_answers[questionId].splice(answerId, 1);
            }
        });*/
        this.survey.pages[this.state.curr_page].questions.forEach(question => {
            question.answers = question.answers.filter(answer => { return !answer.selected; });
            //let questionDiv = document.getElementById("question_" + question.questionId);
            if(question.type === "input"){
                let answerInput = document.getElementById("question_" + question.questionId + "_answer_0");
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
    }

    submitSurvey(){
        this.saveAnswers();
        this.setState({submit: true});
    }

    render() {
        var info = this.state.not_found ? <p>Survey not found!</p> : this.state.loading ? <p>Loading...</p> : null;
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
            var submit_button = this.state.last_page ? <button type="submit" className="survey-button" onClick={this.submitSurvey}>Submit survey</button> : null;
            
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
}