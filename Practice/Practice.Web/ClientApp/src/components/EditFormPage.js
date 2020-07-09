import React, { Component } from 'react';
import './EditFormPage.css';

export class EditForm extends Component {
    static displayName = EditForm.name;

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            error: null
        };
        this.survey=null;
        this.submitMain = this.submitMain.bind(this);
        this.saveModified = this.saveModified.bind(this);
        //this.modified = {title:null, expirationDate:null, description:null, ending:null};
        this.descriptions={page_title:"Edit Form", active: "This survey is active, in this case you can modify only this parts", created: "This survey is not finished, you can modify this page, and the questions"};
    }

    async getSurvey(){
        const response = await fetch('https://localhost:44309/Survey/getSurvey/' + this.props.match.params.id);
        if(!response.ok) this.setState({ error: "Survey not found!" });
        else{
            this.survey = await response.json();
            if(this.survey.status !== "active" && this.survey.status !== "created"){
                this.setState({ error: "Survey is not active, and cannot be edited!" });
            }
            else{
                this.setState({loading: false});
            }
        }
    }

    componentDidMount(){
        this.getSurvey();
    }

    generateMain(){
        return (
            <form id="edit_part_form">
                <div>
                    <div className="label-holder holder"><label htmlFor="question_title"><b>Title: </b></label></div>
                    <div className="answer-holder holder"><input className="answer" type="text" name="question_title" defaultValue={this.survey.title} /></div>
                </div>

                <div>
                    <div className="label-holder holder"><label htmlFor="question_date"><b>Expiration date: </b></label></div>
                    <div className="answer-holder holder"><input className="answer" type="datetime-local" name="question_expirationDate" /> </div>
                </div>
            
                <div>
                    <div className="label-holder holder"><label htmlFor="question_description"><b>Description: </b></label></div>
                    <div className="answer-holder holder"><textarea className="answer" name="question_description" defaultValue={this.survey.description} maxLength="32000" /></div>
                </div>

                <div>
                    <div className="label-holder holder"><label htmlFor="question_ending"><b>Footer description:</b> </label></div>
                    <div className="answer-holder holder"><textarea className="answer" name="question_ending" defaultValue={this.survey.ending} /></div>
                </div>
            </form>
        );
    }



    submitMain(){
        if(this.saveModified()){
            this.submitTheMain();
        }
        else{
            alert("Some of the fields are not completed");
        }
    }

    saveModified(){
        let correct = true;
        let answerInputs1 = Array.from(document.getElementsByClassName("answer"));
        answerInputs1.forEach(answerInput => {
                //console.log(answerInput.id);
                let key = answerInput.name.split("_")[1];
                if(answerInput.value === ""){
                    correct = false;
                }
                else{
                    this.survey[key] = answerInput.value;
                }
        });
        return correct;
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
            if(this.survey.status === "active"){
                return (
                    <div id="edit_survey_page">
                        {/*<a href="#" className="previous round">&#8249;</a> */}
                        {/*<input type="button" value="Go back!" onclick="history.back()"></input> */}
                        <h2 id="edit_survey_title">{this.descriptions.page_title}</h2>
                        <p className="description"><b>{this.descriptions.active}</b></p>
                        {this.generateMain()}
                        <button className="edit_survey-button" onClick={this.submitMain}>Save</button>
                    </div> 
                );
            }
            else if(this.survey.status === "created"){
                return (
                    <div id="edit_survey_page">
                        <h2 id="edit_survey_title">{this.descriptions.page_title}</h2>
                        <p className="description"><b>{this.descriptions.created}</b></p>
                        {this.generateMain()}
                        <button className="edit_survey-button" onClick={this.submitMain}>Edit the questions</button>

                    </div>
                );
            }
        }
    }

    async submitTheMain(){
        if(this.survey.status === "active"){
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
        else{
            const response = await fetch('https://localhost:44309/Survey/editSurvey/' + this.survey.surveyId, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.survey)
            });
            console.log(response);
            if(response.ok){
                window.location.href = window.location.href.replace("editform","editformquestion");
            }
        }
    }
    
}