import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './EditFormPage.css';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';


export class EditForm extends Component {
    static displayName = EditForm.name;

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            error: null,
            redirect: false,
            target: ""
        };
        this.survey=null;
        this.submitMain = this.submitMain.bind(this);
        this.saveModified = this.saveModified.bind(this);
        //this.modified = {title:null, expirationDate:null, description:null, ending:null};
        this.descriptions={page_title:"Edit Survey", active: "This survey is active, in this case you can modify only this parts", created: "This survey is not finished, you can modify this page, and the questions"};
    }

    async getSurvey(){
        const cookies = new Cookies();
        var token = cookies.get('token');
        const response = await fetch('https://localhost:44309/Survey/getSurvey/' + this.props.match.params.id,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
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
        let expirationDate = this.survey.expirationDate.slice(0, 16).split("T");
        let date = expirationDate[0];
        let time = expirationDate[1];
        return (
            <form id="edit_part_form">
                <div>
                    <div className="edit-label-holder holder"><label htmlFor="question_title"><b>Title: </b></label></div>
                    <div className="edit-answer-holder holder"><input className="answer" type="text" name="question_title" defaultValue={this.survey.title} /></div>
                </div>

                <div>
                    <div className="edit-label-holder holder"><label htmlFor="question_expirationDate"><b>Expiration date: </b></label></div>
                    <div className="edit-answer-holder holder">
                        <input className="answer" type="date" name="question_expirationDate" defaultValue={date}/>
                        <br/><br/>
                        <input className="answer" type="time" name="question_expirationDate" defaultValue={time}/>
                    </div>
                </div>
            
                <div>
                    <div className="edit-label-holder holder"><label htmlFor="question_description"><b>Description: </b></label></div>
                    <div className="edit-answer-holder holder"><textarea className="answer" name="question_description" defaultValue={this.survey.description} maxLength="32000" /></div>
                </div>

                <div>
                    <div className="edit-label-holder holder"><label htmlFor="question_ending"><b>Footer description:</b> </label></div>
                    <div className="edit-answer-holder holder"><textarea className="answer" name="question_ending" defaultValue={this.survey.ending} /></div>
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
        let answerHolders = Array.from(document.getElementsByClassName("edit-answer-holder"));
        answerHolders.forEach(answerHolder => {
            //console.log(answerInput.id);
            let answerInputs = answerHolder.children;
            let key = answerInputs[0].name.split("_")[1];
            if(answerInputs.length === 4){
                if(answerInputs[0].value === "" || answerInputs[3].value === "") correct = false;
                else this.survey[key] = answerInputs[0].value + "T" + answerInputs[3].value + ":00.000+00:00";
            }
            else{
                if(answerInputs[0].value === "") correct = false;
                else this.survey[key] = answerInputs[0].value;
            }
        });
        return correct;
    }

    render() {
        if(this.state.error){
            return (
                <div id="GeneralPieErrorContainer">
                    <div id="homepage_button_holder">
                        <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                    </div>
                    <h3 id="GeneralPieError">{this.state.error}</h3>
                </div>
            );
        }
        else if(this.state.loading){
            return (
                <div id="GeneralPieErrorContainer">
                    <div id="homepage_button_holder">
                        <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                    </div>
                    <h3 id="GeneralPieError">Loading...</h3>
                </div>
            );
        }
        else if(this.state.redirect){
            return (
                <Redirect to={this.state.target}/>
            );
        }
        else{
            if(this.survey.status === "active"){
                return (
                    <div id="edit_survey_page">
                        <div id="homepage_button_holder">
                            <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                        </div>
                        <h2 id="title">{this.descriptions.page_title}</h2>
                        <p className="description"><b>{this.descriptions.active}</b></p>
                        {this.generateMain()}
                        <button className="nav_button" onClick={this.submitMain}>Save</button>
                    </div> 
                );
            }
            else if(this.survey.status === "created"){
                return (
                    <div id="edit_survey_page">
                        <div id="homepage_button_holder">
                            <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                        </div>
                        <h2 id="title">{this.descriptions.page_title}</h2>
                        <p className="description"><b>{this.descriptions.created}</b></p>
                        {this.generateMain()}
                        <button className="nav_button" onClick={this.submitMain}>Edit the questions</button>
                    </div>
                );
            }
        }
    }

    async submitTheMain(){
        const cookies = new Cookies();
        var token = cookies.get('token');
        if(this.survey.status === "active"){
            const response = await fetch('https://localhost:44309/Survey/editSurvey/' + this.survey.surveyId, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                },
                body: JSON.stringify(this.survey)
            });
            //console.log(response);
            if(response.ok){
                this.setState({ redirect: true, target: "/SurveyDashboard" });
            }
        }
        else{
            const response = await fetch('https://localhost:44309/Survey/editSurvey/' + this.survey.surveyId, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(this.survey)
            });
            //console.log(response);
            if(response.ok){
                this.setState({ redirect: true, target: "/editformquestion/" + this.survey.surveyId });
            }
        }
    }
    
}