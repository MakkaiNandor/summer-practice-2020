import React, { Component } from 'react';
import './SurveyDashboard.css';

export class SurveyDashboard extends Component {
    static displayName = SurveyDashboard.name;

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            error: null,
            survey: null,
            option: null
        };
        this.surveys = null;
        this.respondents = [];
        this.onClickHandler = this.onClickHandler.bind(this);
        this.publishSurvey = this.publishSurvey.bind(this);
    }

    async getAllSurvey(){
        const response = await fetch('https://localhost:44309/Survey/getAllSurvey');
        if(!response.ok) this.setState({ error: "Surveys not found!" });
        else{
            this.surveys = await response.json();
            await this.getRespondentsOfAllSurveys();
            this.surveys.sort((a, b) => {
                if(a.status === b.status){
                    return this.getRespondents(b.surveyId) - this.getRespondents(a.surveyId);
                }
                let statusA = a.status === "active" ? 1 : a.status === "created" ? 2 : 3;
                let statusB = b.status === "active" ? 1 : b.status === "created" ? 2 : 3;
                return statusA - statusB;
            });
            this.setState({ loading: false });
        }
    }

    async getRespondentsOfAllSurveys(){
        for(let i = 0 ; i < this.surveys.length ; ++i){
            const response = await fetch('https://localhost:44309/Answer/getReport/' + this.surveys[i].surveyId);
            if(!response.ok) this.respondents.push({
                surveyId: this.surveys[i].surveyId,
                completedCounter: 0
            });
            else{
                const counters = await response.json();
                this.respondents.push({
                    surveyId: this.surveys[i].surveyId,
                    completedCounter: counters.completedCounter
                });
            }
        }
    }

    async editSurvey(){
        const response = await fetch('https://localhost:44309/Survey/editSurvey/' + this.state.survey.surveyId, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.survey)
        });
        if(!response.ok) alert("Survey activation failed!");
        else alert("Survey is activated!");
    }

    getRespondents(surveyId){
        let respondents = 0;
        this.respondents.forEach(element => {
            if(element.surveyId === surveyId){
                respondents =  element.completedCounter;
            }
        });
        return respondents;
    }

    getSurvey(surveyId){
        for(let i = 0 ; i < this.surveys.length ; ++i){
            if(this.surveys[i].surveyId === surveyId)
                return this.surveys[i];
        }
    }

    componentDidMount(){
        this.getAllSurvey();
    }

    onClickHandler(event){
        let [option, , surveyId] = event.target.id.split("-");
        switch(option){
            case "publish":
            case "link":
                break;
            case "view":
                break;
            case "report":
                break;
            default:
        }
        this.setState({ survey: this.getSurvey(parseInt(surveyId)), option: option});
    }

    copyLink(event){
        let linkInput = document.getElementById("link");
        linkInput.disabled = false;
        linkInput.select();
        linkInput.disabled = true;
        document.execCommand("copy");
    }

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

    addNewSurvey(event){
        window.location.href = window.location.href.replace("SurveyDashboard", "CreateSurvey");
    }

    renderTable(){
        return (
            <table id="survey-table">
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
                    </tr>
                </thead>
                <tbody>
                {this.surveys.map(survey => 
                    <tr key={survey.surveyId}>
                        <td>{survey.title}</td>
                        <td>{survey.status}</td>
                        <td>{this.getRespondents(survey.surveyId)}</td>
                        <td>{survey.createDate.replace(/[TZ]/g, " ")}</td>
                        <td>{survey.expirationDate.replace(/[TZ]/g, " ")}</td>
                        <td>{survey.status === "active" ? <button id={"link-button-"+survey.surveyId} className="button" onClick={this.onClickHandler}>Get Link</button> : survey.status === "created" ? <button id={"publish-button-"+survey.surveyId} className="button" onClick={this.onClickHandler}>Publish</button> : null} </td>
                        <td>{survey.status !== "closed" ? <button id={"view-button-"+survey.surveyId} className="button" onClick={this.onClickHandler}>View</button> : null}</td>
                        <td>{survey.status !== "created" ? <button id={"report-button-"+survey.surveyId} className="button" onClick={this.onClickHandler}>Results</button> : null}</td>
                    </tr>
                )}
                </tbody>
            </table>
        );
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
        else if(this.state.option === "link" || this.state.option === "publish"){
            let publishButton = this.state.option === "publish" ? <button className="button" onClick={this.publishSurvey}>Publish</button> : null;
            let link = window.location.href.replace("SurveyDashboard", "personal/"+this.state.survey.surveyId);
            return (
                <div id="link-page">
                    <h2 id="title">Share Form</h2>
                    <div>
                        <label>Link for "{this.state.survey.title}": </label>
                        <input id="link" type="text" defaultValue={link} size={link.length} disabled></input>
                        <button className="button" onClick={this.copyLink}>Copy Link</button>
                    </div>
                    {publishButton}
                    <br/>
                    <button className="button" onClick={event => this.setState({ survey: null, option: null })}>Ok</button>
                </div>
            );
        }
        else{
            let table = this.renderTable();
            return (
                <div id="dashboard-page">
                    <h2 id="title">My Forms</h2>
                    <div id="survey-table-holder">
                        {table}
                        <button id="new-survey-button" className="button" onClick={this.addNewSurvey}>Add new form</button>
                    </div>
                </div>
            );
        }
    }
}