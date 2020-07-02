import React, { Component } from 'react';
import './Survey.css';

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

        this.survey = {
            surveyId: 1,
            status: "active",
            personalData: {
                name: {
                    label: "What's your name?",
                    type: "input",
                    answers: []
                },
                age: {
                    label: "How old are you?",
                    type: "input",
                    answers: []
                },
                email: {
                    label: "What's your email?",
                    type: "input",
                    answers: []
                },
                gender: {
                    label: "Select your gender:",
                    type: "radio",
                    answers: [{
                        value: "Male"
                    },{
                        value: "Female"
                    }]
                }
            }
        };

        this.descriptions = {
            title: "Personal data part",
            description: "asd",
            ending: "asd"
        };
    }

    // get survey by id
    /*async getSurvey(){
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
    }*/

    componentDidMount(){
        if(!this.survey){
            this.setState({ error: "Survey not found!" });
        }
        else if(this.survey.status !== "active"){
            this.setState({ error: "Survey is not active!" });
        }
        this.setState({ loading: false });
    }

    submitData(){
        this.saveAnswers();
        if(!this.personalData.name || !this.personalData.age || !this.personalData.email || !this.personalData.gender){
            alert("Not completed!");
            return;
        }
        console.log(this.personalData);
        // adatok bekuldese
        // window.location.href = window.location.href.replace("personal", "survey") + "?name=" + this.personalData.name + "&age=" + this.personalData.age + "&email=" + this.personalData.email + "&gender=" + this.personalData.gender;
    }

    // generate questions of page
    generateQuestions(){
        return (
            <div className="question-holder">
                <div className="question" id="question_name">
                    <p className="question-label"><b>1.</b>{this.survey.personalData.name.label}</p>
                    <div className="answer-holder">
                        {this.generateAnswers(this.survey.personalData.name, "name")}
                    </div>
                </div>
                <div className="question" id="question_age">
                    <p className="question-label"><b>2.</b>{this.survey.personalData.age.label}</p>
                    <div className="answer-holder">
                        {this.generateAnswers(this.survey.personalData.age, "age")}
                    </div>
                </div>
                <div className="question" id="question_email">
                    <p className="question-label"><b>3.</b>{this.survey.personalData.email.label}</p>
                    <div className="answer-holder">
                        {this.generateAnswers(this.survey.personalData.email, "email")}
                    </div>
                </div>
                <div className="question" id="question_gender">
                    <p className="question-label"><b>4.</b>{this.survey.personalData.gender.label}</p>
                    <div className="answer-holder">
                        {this.generateAnswers(this.survey.personalData.gender, "gender")}
                    </div>
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
                    question.answers.map(answer =>
                        <div className="answer" key={answer.value}>
                            <input type="radio" id={"question_" + key + "_answer_" + answer.value} name={"question_" + key} value={answer.value}/>
                            <label htmlFor={"question_" + key + "_answer_" + answer.value}>{answer.value}</label>
                        </div>
                    )
                );
            case "checkbox":
                return (
                    question.answers.map(answer => 
                        <div className="answer" key={answer.value}>
                            <input type="checkbox" id={"question_" + key + "_answer_" + answer.value} name={"question_" + key} value={answer.value}/>
                            <label htmlFor={"question_" + key + "_answer_" + answer.value}>{answer.value}</label>
                        </div>
                    )
                );
            default: return null;
        }
    }
    
    // save answers of one page
    saveAnswers(){
        let answerInputs = Array.from(document.getElementsByTagName("INPUT"));
        answerInputs.forEach(answerInput => {
            if(answerInput.type === "text"){
                let key = answerInput.name.split("_")[1];
                if(answerInput.value === ""){
                    this.personalData[key] = null;
                }
                else if(key === "age"){
                    this.personalData[key] = parseInt(answerInput.value);
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
                <div id="survey-page">
                    <h2 id="survey-title">{this.descriptions.title}</h2>
                    <p className="description"><b>Description: </b>{this.descriptions.description}</p>
                    {this.generateQuestions()}
                    <p className="description">{this.descriptions.ending}</p>
                    <button className="survey-button" onClick={this.submitData}>Submit personal data</button>
                </div>
            );
        }
    }
}