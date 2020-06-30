import React, { Component } from 'react';
import './Personal.css';

export class Personal extends Component {
    static displayName = Personal.name;

    constructor(props) {
        super(props);
        this.elseAnswers = null;
        this.state = { loading: true, not_found: false, not_active: false, questions: null}; //variables
        this.generateQuestions = this.generateQuestions.bind(this);
        this.saveAnswers = this.saveAnswers.bind(this);
        this.getDefaultValue = this.getDefaultValue.bind(this);
        this.survey = null;
        this.descriptions = {title: "Personal information part", description: "We appreciate the time spent on us, we promise your personal datas will not be publicated!", footer_description: "This is the end of the personal information part, questions related to the topic will appear on the next pages!"};
    }  //elements of a survey: title, description, footer, questions, answers
        
        componentDidMount(){
            this.getSurvey();
        }
    
        //this function helps us to show the proper form of the questions(input text, checkbox, radio button)
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
    
        //with this function we generate the questions, and in some cases(if we use radio button or checkbox), we have options to choose our answer
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
    
      render() {
        var info = this.state.not_found ? <p>Survey not found!</p> : this.state.not_active ? <p>Survey is not active!</p> : this.state.loading ? <p>Loading...</p> : null;
        if(info){
            return (
                <div>{info}</div>
            );
        }
        else{
            var start_survey_button = <button onClick={this.saveAnswers} className="survey-button" >Begin the questions</button>; //if we are on the last page of the personal information, this button will appear, and will redirect to the questions related to the survey's topic 
        
            var questions = this.state.questions ? this.generateQuestions() : null; //if there are questions, we generate them, other case we don't
        
            return (
            <div id="survey_page">
                <h2 id="survey_title">{this.descriptions.title}</h2> {/*the survey's title */}
                <p className="description"><b>{this.descriptions.description ? "What will happen with your data: " : null}</b>{this.descriptions.description}</p> {/*description */}
                {questions} {/*the questions */}
                <p className="description">{this.descriptions.footer_description}</p> {/*the survey's footer */}
                {start_survey_button} {/*Begin the questions button */}
            </div>
            );
        }
    }

    async getSurvey(){
        const response = await fetch('https://localhost:44309/Survey/getSurvey/' + this.props.match.params.id);
        if(!response.ok){
            this.setState({not_found: true});
        }
        else{
            this.survey.survey_ = await response.json();
            if(this.survey.status !== "active"){
                this.setState({not_active: true});
            }
            else{
                //if(this.survey.pages.length === 1) this.setState({last_page: true});
                /*this.elseAnswers = this.survey.pages[0].questions.forEach(question => {
                    question.answers.filter(answer => { return answer.selected; });
                });
                console.log(this.elseAnswers);
                this.survey.pages[0].questions.forEach(question => {
                    question.answers = question.answers.filter(answer => { return !answer.selected; });
                });*/
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


    saveAnswers(){
        this.survey.pages[0].questions.forEach(question => {
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
        let question = this.survey.pages[0].questions.filter(question => { return question.questionId === questionId; })[0];
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