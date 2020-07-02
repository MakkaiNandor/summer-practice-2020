import React, { Component } from 'react';
import './Personal.css';

export class Personal extends Component {
    static displayName = Personal.name;

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            error: null
            ,questions: null
        };

        this.submitData = this.submitData.bind(this);
        this.saveAnswers = this.saveAnswers.bind(this);

        this.personalData = {name: null, age: null, email: null, gender: null};
        this.survey=null;
        /*this.survey = {
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
        };*/

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
                this.setState({loading: false, questions: this.survey.personaldata});
            }
        }
    }

    componentDidMount(){
        /*if(!this.survey){
            this.setState({ error: "Survey not found!" });
        }
        else if(this.survey.status !== "active"){
            this.setState({ error: "Survey is not active!" });
        }
        this.setState({ loading: false });*/
        this.getSurvey();
    }

    submitData(){
        this.saveAnswers();
        if(!this.personalData.name || !this.personalData.age || !this.personalData.email || !this.personalData.gender){
            alert("Personal datas are not completed correctly!");
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
                <div className="question" id={"question_" + this.state.questions.name} >
                    <p className="question_label"><b>{this.state.questions.name + ": "}</b>{this.state.questions.name.label}</p>
                    <div className="answer-holder">{this.generateAnswers(this.state.questions.name,"name")}</div>
                </div>
                {/*<div className="question" id="question_name">
                    <p className="question-label"><b>1.</b>{this.survey.personalData.name.label}</p>
                    <div className="answer-holder">
                        {this.generateAnswers(this.survey.personalData.name, "name")}
                    </div>
                </div> */}
                {/*<div className="question" id="question_age">
                    <p className="question-label"><b>2.</b>{this.survey.personalData.age.label}</p>
                    <div className="answer-holder">
                        {this.generateAnswers(this.survey.personalData.age, "age")}
                    </div>
                </div>*/}

                <div className="question" id={"question_" + this.state.questions.age} >
                        <p className="question_label"><b>{this.state.questions.age + ": "}</b>{this.state.questions.age.label}</p>
                        <div className="answer-holder">{this.generateAnswers(this.state.questions.age,"age")}</div>
                </div>
                {/*<div className="question" id="question_email">
                    <p className="question-label"><b>3.</b>{this.survey.personalData.email.label}</p>
                    <div className="answer-holder">
                        {this.generateAnswers(this.survey.personalData.email, "email")}
                    </div>
                </div> */}
                <div className="question" id={"question_" + this.state.questions.email} >
                    <p className="question_label"><b>{this.state.questions.email + ": "}</b>{this.state.questions.email.label}</p>
                    <div className="answer-holder">{this.generateAnswers(this.state.questions.email,"email")}</div>
                </div>
                {/*<div className="question" id="question_gender">
                    <p className="question-label"><b>4.</b>{this.survey.personalData.gender.label}</p>
                    <div className="answer-holder">
                        {this.generateAnswers(this.survey.personalData.gender, "gender")}
                    </div>
                </div> */}
                <div className="question" id={"question_" + this.state.questions.gender} >
                    <p className="question_label"><b>{this.state.questions.gender + ": "}</b>{this.state.questions.gender.label}</p>
                    <div className="answer-holder">{this.generateAnswers(this.state.questions.gender,"gender")}</div>
                </div>
            </div>


            //-------------
            /*<div className="question-holder">
            {this.state.questions.map(question => 
                <div className="question" id={"question_" + question.questionId} key={question.questionId}>
                    <p className="question_label"><b>{question.questionId + ": "}</b>{question.label}</p>
                    <div className="answer-holder">{this.generateAnswers(question)}</div>
                </div>
            )}
            </div>*/
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

    /*constructor(props) {
        super(props);
        //this.elseAnswers = null;
        this.state = { loading: true, not_found: false, not_active: false, submit: false, questions: null}; //variables
        this.generateQuestions = this.generateQuestions.bind(this);
        this.saveAnswers = this.saveAnswers.bind(this);
        this.getDefaultValue = this.getDefaultValue.bind(this);
        this.survey = null;
        this.submitSurvey = this.submitSurvey.bind(this);
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
            var start_survey_button = <button onClick={this.submitSurvey} className="survey-button" >Begin the questions</button>; //if we are on the last page of the personal information, this button will appear, and will redirect to the questions related to the survey's topic 
        
            var questions = this.state.questions ? this.generateQuestions() : null; //if there are questions, we generate them, other case we don't
        
            return (
            <div id="survey_page">
                <h2 id="survey_title">{this.descriptions.title}</h2> 
                <p className="description"><b>{this.descriptions.description ? "What will happen with your data: " : null}</b>{this.descriptions.description}</p>
                {questions} 
                <p className="description">{this.descriptions.footer_description}</p>
                {start_survey_button} 
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
            this.survey = await response.json();
            if(this.survey.status !== "active"){
                this.setState({not_active: true});
            }
            else{*/
                //if(this.survey.pages.length === 1) this.setState({last_page: true});
                /*this.elseAnswers = this.survey.pages[0].questions.forEach(question => {
                    question.answers.filter(answer => { return answer.selected; });
                });
                console.log(this.elseAnswers);
                this.survey.pages[0].questions.forEach(question => {
                    question.answers = question.answers.filter(answer => { return !answer.selected; });
                });
                this.setState({loading: false, questions: this.survey.personaldata});
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
        this.survey.personaldata.forEach(question => {
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

        if(this.survey.personaldata.name.type === "input"){
            let answerInput = document.getElementById("answer");
            if(answerInput.value !== ""){
                let userAnswer = {
                    value: answerInput.value
                };
            }
        }
        else{
                let answerInput = document.getElementById("answer_" + answer.value);
                if(answerInput.checked){
                    let userAnswer = {
                        value: answerInput.value,
                    };
                }
        }     
    


    submitSurvey(){
        this.saveAnswers();
        this.setState({submit: true});
    }*/

}