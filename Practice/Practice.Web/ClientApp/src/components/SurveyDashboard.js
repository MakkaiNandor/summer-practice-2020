import React, { Component } from 'react';
import './SurveyDashboard.css';

export class SurveyDashboard extends Component {
    static displayName = SurveyDashboard.name;

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            error: null
        };
        this.surveys = null;
    }

    async getAllSurvey(){
        const response = await fetch('https://localhost:44309/Survey/getAllSurvey');
        if(!response.ok) this.setState({ error: "Surveys not found!" });
        else{
            this.surveys = await response.json();
            this.setState({ loading: false });
        }
    }

    componentDidMount(){
        this.getAllSurvey();
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
                <div id="dashboard-page">
                    <h2 id="title">Survey Dashboard</h2>
                    <div id="survey-table-holder">
                        <table id="survey-table">
                            <thead>
                                <tr>
                                    <th>Survey title</th>
                                    <th>Status</th>
                                    <th>Respondents</th>
                                    <th>Created date</th>
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
                                    <td>0</td>
                                    <td>{/*survey.createDate*/}</td>
                                    <td>{survey.expirationDate}</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }
    }
}