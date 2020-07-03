import React, { Component } from 'react';
import './Personal.css';

export class Personal extends Component {
    static displayName = Personal.name;

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            error: null
        };

        this.submitData = this.submitData.bind(this);
        this.saveAnswers = this.saveAnswers.bind(this);

        this.personalData = {name: null, age: null, email: null, gender: null};
        this.survey=null;

        this.descriptions = {title: "Personal information part", description: "We appreciate the time spent on us, we promise your personal datas will not be publicated!", footer_description: "This is the end of the personal information part, questions related to the topic will appear on the next pages!"};
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
                this.setState({loading: false,});
            }
        }
    }

    componentDidMount(){
        this.getSurvey();
    }

    submitData(){
        this.saveAnswers();
        if(!this.personalData.name || !this.personalData.age || !this.personalData.email || !this.personalData.gender){
            alert("Personal datas are not completed correctly!");
            return;
        }
        console.log(this.personalData);
        this.submitPersonalData();
    }

    // generate questions of page
    generateQuestions(){
        return (
            <div className="question-holder">
                <div className="question" id={"question_name"} >
                    <p className="question_label"><b>1.</b>{this.survey.personalData.name.label}</p>
                    <div className="answer-holder">{this.generateAnswers(this.survey.personalData.name,"name")}</div>
                </div>

                <div className="question" id={"question_" + this.survey.personalData.age} >
                        <p className="question_label"><b>2.</b>{this.survey.personalData.age.label}</p>
                        <div className="answer-holder">{this.generateAnswers(this.survey.personalData.age,"age")}</div>
                </div>

                <div className="question" id={"question_" + this.survey.personalData.email} >
                    <p className="question_label"><b>3.</b>{this.survey.personalData.email.label}</p>
                    <div className="answer-holder">{this.generateAnswers(this.survey.personalData.email,"email")}</div>
                </div>

                <div className="question" id={"question_" + this.survey.personalData.gender} >
                    <p className="question_label"><b>4.</b>{this.survey.personalData.gender.label}</p>
                    <div className="answer-holder">{this.generateAnswers(this.survey.personalData.gender,"gender")}</div>
                </div>
            </div>
        );
    }
    
    // generate answers of question
    generateAnswers(question, key){
        switch(question.type){
            case "input":
                return (
                    <div className="answer">
                        <input type="text" name={"question_" + key}/>
                    </div>
                );
            case "radio":
                return (
                    question.answer.map(answer =>
                        <div className="answer" key={answer.answerId}>
                            <input type="radio" id={"question_" + key + "_answer_" + answer.answerId} name={"question_" + key} value={answer.value}/>
                            <label htmlFor={"question_" + key + "_answer_" + answer.answerId}>{answer.value}</label>
                        </div>
                    )
                );
            case "checkbox":
                return (
                    question.answer.map(answer => 
                        <div className="answer" key={answer.answerId}>
                            <input type="checkbox" id={"question_" + key + "_answer_" + answer.answerId} name={"question_" + key} value={answer.value}/>
                            <label htmlFor={"question_" + key + "_answer_" + answer.answerId}>{answer.value}</label>
                        </div>
                    )
                );
            default: return null;
        }
    }
    
    saveAnswers(){
        let answerInputs = Array.from(document.getElementsByTagName("INPUT"));
        answerInputs.forEach(answerInput => {
            if(answerInput.type === "text"){
                let key = answerInput.name.split("_")[1];
                if(answerInput.value === ""){
                    this.personalData[key] = null;
                }
                else if(key === "age"){
                    let age = parseInt(answerInput.value);
                    if(age) this.personalData[key] = "" + age;
                }
                else{
                    this.personalData[key] = answerInput.value;
                }
            }
            else{
                let key = answerInput.name.split("_")[1];
                if(answerInput.checked){
                    this.personalData[key] = answerInput.value;
                }
            }
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
                <p>Loading...</p>
            );
        }
        else{
            return (
                <div id="survey_page">
                    <h2 id="survey_title">{this.descriptions.title}</h2>
                    <p className="description"><b>What will happen with your data: </b>{this.descriptions.description}</p>
                    {this.generateQuestions()}
                    <p className="description"><b>{this.descriptions.footer_description}</b></p>
                    <button className="survey-button" onClick={this.submitData}>Begin the questions</button>
                </div>
            );
        }
    }

    async submitPersonalData(){
        const response = await fetch('https://localhost:44309/Answer/sendPersonalData/' + this.survey.surveyId, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.personalData)
        });
        console.log(response);
        if(response.ok){
            window.location.href = window.location.href.replace("personal", "survey") + "?name=" + this.personalData.name + "&age=" + this.personalData.age + "&email=" + this.personalData.email + "&gender=" + this.personalData.gender;
        } 
    }

}