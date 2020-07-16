import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './SurveyDashboard.css';
import Cookies from 'universal-cookie';

export class SurveyDashboard extends Component {
    static displayName = SurveyDashboard.name;

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            error: null,
            survey: null,
            option: null,
            surveys: null
        };
        this.respondents = [];
        this.onClickHandler = this.onClickHandler.bind(this);
        this.publishSurvey = this.publishSurvey.bind(this);
        this.sortSurveys = this.sortSurveys.bind(this);
    }

    componentDidMount(){
        this.getAllSurvey();
    }

    /*
        -------------------------------
        Asynchronous database functions
        -------------------------------
    */
   
    // get all surveys
    async getAllSurvey(){
        const cookies = new Cookies();
        var token = cookies.get('token');

        const response = await fetch('https://localhost:44309/Survey/getAllSurvey', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
            
        });
        if(!response.ok) this.setState({ error: "Surveys not found!" });
        else{
            let data = await response.json();
            this.setState({ surveys: data });
            this.sortSurveys();
            await this.getRespondentsOfAllSurveys();
            this.setState({ loading: false });
        }
    }

    // get respondents of every surveys
    async getRespondentsOfAllSurveys(){

        const cookies = new Cookies();
        var token = cookies.get('token');

        for(let i = 0 ; i < this.state.surveys.length ; ++i){
            const response = await fetch('https://localhost:44309/Answer/getReport/' + this.state.surveys[i].surveyId, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
                
            });
            if(!response.ok) this.respondents.push({
                surveyId: this.state.surveys[i].surveyId,
                completedCounter: 0
            });
            else{
                const counters = await response.json();
                this.respondents.push({
                    surveyId: this.state.surveys[i].surveyId,
                    completedCounter: counters.completedCounter
                });
            }
        }
    }

    // update survey
    async editSurvey(){
        const cookies = new Cookies();
        var token = cookies.get('token');

        const response = await fetch('https://localhost:44309/Survey/editSurvey/' + this.state.survey.surveyId, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                
            },
            body: JSON.stringify(this.state.survey)
        });
        if(!response.ok) alert("Survey activation failed!");
        else {
            alert("Survey is activated!");
            this.sortSurveys();
        }
    }

    // delete survey
    async deleteSurvey(surveyId){
        const cookies = new Cookies();
        var token = cookies.get('token');

        const response = await fetch('https://localhost:44309/Survey/deleteSurvey/' + surveyId, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
                
            },
        });
        if(!response.ok) alert('Survey deleting failed!');
        else{
            this.setState((prevState) => ({ surveys: prevState.surveys.filter(survey => {return survey.surveyId !== surveyId}) }));
            alert('Survey is deleted!');
        }
    }

    /*
        -------------------
        Auxiliary functions
        -------------------
    */

    sortSurveys(){
        this.setState({ surveys: this.state.surveys.sort((a, b) => {
            if(a.status === b.status){
                return this.getRespondents(b.surveyId) - this.getRespondents(a.surveyId);
            }
            let statusA = a.status === "active" ? 1 : a.status === "created" ? 2 : 3;
            let statusB = b.status === "active" ? 1 : b.status === "created" ? 2 : 3;
            return statusA - statusB;
        }) });
    }

    // get respondents of one survey by id
    getRespondents(surveyId){
        
        let respondents = 0;
        this.respondents.forEach(element => {
            if(element.surveyId === surveyId){
                respondents =  element.completedCounter;
            }
        });
        return respondents;
    }

    // get survey by id
    getSurvey(surveyId){
        let result = this.state.surveys.filter(survey => {return survey.surveyId === surveyId});
        if(result.length === 1) {
            return result[0];
        }
        else return null;
    }

    /*
        -----------------------
        Event handler functions
        -----------------------
    */

    // button click event handler
    onClickHandler(event){
        let [option, , surveyId] = event.target.id.split("-");
        switch(option){
            case "publish":
            case "link":
                this.setState({ survey: this.getSurvey(parseInt(surveyId)), option: option});
                break;
            case "view":
                break;
            case "report":
                break;
            case "delete":
                if(window.confirm("Delete survey?")) this.deleteSurvey(parseInt(surveyId));
                break;
            default:
        }
    }

    // copy generated link for survey
    copyLink(event){
        let linkInput = document.getElementById("link");
        linkInput.disabled = false;
        linkInput.select();
        linkInput.disabled = true;
        document.execCommand("copy");
    }

    // event handler for publish button, publishing the survey
    publishSurvey(event){
        switch(this.state.survey.status){
            case "active":
                alert("Survey is already active!");
                break;
            case "created":
                let survey = this.state.survey;
                survey.status = "active";
                this.setState({ survey: survey });
                this.editSurvey();
                break;
            case "closed":
                alert("Survey is closed, you can't publish it!");
                break;
            default:
        }
    }

    /*
        ----------------
        Render functions
        ----------------
    */

    // generate table of surveys
    renderTable(){
        return (
            <table id="survey_dashboard_table">
                <thead>
                    <tr>
                        <th>Survey title</th>
                        <th>Status</th>
                        <th>Respondents</th>
                        <th>Creation date</th>
                        <th>Expiration date</th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {this.state.surveys.map(survey => 
                    <tr key={survey.surveyId}>
                        <td>{survey.title}</td>
                        <td>{survey.status}</td>
                        <td>{this.getRespondents(survey.surveyId)}</td>
                        <td>{survey.createDate.slice(0, 16).replace("T", " ")}</td>
                        <td>{survey.expirationDate.slice(0, 16).replace("T", " ")}</td>
                        <td>{survey.status === "active" ? <button id={"link-button-"+survey.surveyId} className="survey_dashboard_button" onClick={this.onClickHandler}>Get Link</button> : survey.status === "created" ? <button id={"publish-button-"+survey.surveyId} className="button" onClick={this.onClickHandler}>Publish</button> : null} </td>
                        <td>{survey.status !== "closed" ? <Link to={"/editform/"+survey.surveyId}><button id={"view-button-"+survey.surveyId} className="survey_dashboard_button">Edit</button></Link> : null}</td>
                        <td>{survey.status !== "created" ? <Link to={"/reporting/"+survey.surveyId}><button id={"report-button-"+survey.surveyId} className="survey_dashboard_button" onClick={this.onClickHandler}>Results</button></Link> : null}</td>
                        <td><button id={"delete-button-"+survey.surveyId} className="survey_dashboard_button" onClick={this.onClickHandler}>Delete</button></td>
                        
                    </tr>
                )}
                </tbody>
            </table>
        );
    }

    render() {
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
        else if(this.state.option === "link" || this.state.option === "publish"){
            let publishButton = this.state.option === "publish" ? <button className="survey_dashboard_button" onClick={this.publishSurvey}>Publish</button> : null;
            let link = window.location.href.replace(this.props.match.url, "/personal/" + this.state.survey.surveyId);
            return (
                <div id="link-page">
                    <h2 id="survey_dashboard_title">Share Form</h2>
                    <div>
                        <label>Link for "{this.state.survey.title}": </label>
                        <input id="link" type="text" defaultValue={link} size={link.length} disabled></input>
                        <button className="survey_dashboard_button" onClick={this.copyLink}>Copy Link</button>
                    </div>
                    {publishButton}
                    <br/>
                    <button className="survey_dashboard_button" onClick={event => this.setState({ survey: null, option: null })}>Ok</button>
                </div>
            );
        }
        else{
            let table = this.renderTable();
            return (
                <div id="dashboard-page">
                    <div id="homepage_button_holder">
                        <Link to="./MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                        <Link to="./generalReport" className="Link"><button id="personal_report_button">Personal data report</button></Link>
                    </div>
                    <h2 id="survey_dashboard_title">My Forms</h2>
                    <div id="survey_dashboard_table_holder">
                        {table}
                        <Link to="/CreateSurvey"><button id="new-survey-button" className="AddNewFormButton">Add new form</button></Link>
                    </div>
                </div>
            );
        }
    }
}