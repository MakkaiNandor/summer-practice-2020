import React, { Component } from 'react';
import "./Template.css"

export class TemplateDashboard extends Component {
    static displayName = TemplateDashboard.name;

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            error: null,
            TemplateType: 1,
            templates : null,
        };

        
        this.title = "Template Dashboard";
        
        
        this.ChangeToQuestionTemplate=this.ChangeToQuestionTemplate.bind(this);
        this.ChangeToSurveyTemplate=this.ChangeToSurveyTemplate.bind(this);
        this.renderQuestionTemplateTable=this.renderQuestionTemplateTable.bind(this);
        this.renderSurveyTemplateTable=this.renderSurveyTemplateTable.bind(this);
        this.DeleteSurveyTemplate=this.DeleteSurveyTemplate.bind(this);
        this.DeleteQuestionTemplate=this.DeleteQuestionTemplate.bind(this);
        this.ToggleOverlay=this.ToggleOverlay.bind(this);
    }
        

    componentDidMount() {
        this.getSurveyTemplates();
    }

    //Get SurveyTemplates
    async getSurveyTemplates() {
        const response = await fetch('https://localhost:44309/SurveyTemplate/getAllSurveyTemplates');
        if (!response.ok) this.setState({ error: "There are no templates!" });
        else {
            let temp = await response.json();

            let keys = Object.keys(temp);
            for (let key in keys)
            {
                temp[key].surveyTemplateId=temp[key].surveyTemplateId+"s";
            }
            this.setState({ loading: false, templates: temp});
            
        }
        
    }
    //Get QuestionTemplates
    async getQuestionTemplates() {
        const response = await fetch('https://localhost:44309/QuestionTemplate/getAllQuestionTemplates');
        if (!response.ok) this.setState({ error: "There are no templates!" });
        else {
            let temp = await response.json();
            let keys = Object.keys(temp);
            for (let key in keys)
            {
                temp[key].questionTemplateId=temp[key].questionTemplateId+"q";
            }
            this.setState({ loading: false, templates: temp});
        }
    }

    //Get Survey by id
    async getSurveyById(id)
    {
        const response= await fetch('https://localhost:44309/Survey/getSurvey/'+this.surveyId);
        if (!response.ok) this.setState({error:"Cant get a survey by id!"});
        else
        {
            this.surveyNames.push((await response.json()).title);
        }
    }
    
    

    //Generate Table
    renderSurveyTemplateTable(templates) {
        return (
            <table className="TemplateTable" key={1}>
                <thead>
                    <tr key="SurveyHead">
                        <th>Template Name</th><th>Create Date</th><th>Used</th><th></th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        templates.map(template=>
                            <tr key={template.surveyTemplateId}> 
                                <td>{template.name}</td>
                                <td>{template.createDate}</td>
                                <td>{template.used}</td>
                                <td><button>Edit</button></td>
                                <td><button id ={template.surveyTemplateId} onClick={this.ToggleOverlay}>Delete</button></td>
                            </tr>
                            )
                    }
                </tbody>
            </table>
            )
    }
    renderQuestionTemplateTable(templates) {
        return (
            <table className="TemplateTable" key={2}>
                <thead>
                    <tr key="QuestionHead">
                        <th>Template Name</th><th>Create Date</th><th>Used</th><th></th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        templates.map(template=>
                            <tr key={template.questionTemplateId}> 
                                <td>{template.label}</td>
                                <td>{template.createDate}</td>
                                <td>{template.used}</td>
                                <td><button>Edit</button></td>
                                <td><button id={template.questionTemplateId}onClick={this.DeleteQuestionTemplate}>Delete</button></td>
                            </tr>
                            )
                    }
                </tbody>
            </table>
            )
    }

    //Delete Template
    async DeleteSurveyTemplate(event)
    {
        
        await fetch('https://localhost:44309/SurveyTemplate/deleteSurveyTemplate/'+event.target.id[0],{
        method: "DELETE"
       });
        this.getSurveyTemplates();
        
    }
    async DeleteQuestionTemplate(event)
    {
        await fetch('https://localhost:44309/QuestionTemplate/deleteQuestionTemplate/'+event.target.id[0],{
        method: "DELETE"
        });
        this.getQuestionTemplates();
    }

    //Overlay
    ToggleOverlay()
    {
        let overlay=document.getElementById("overlay");
        if (overlay.style.display=="none") overlay.style.display="block";
    }

    //Change Template Type
    async ChangeToSurveyTemplate(event)
    {

        await this.getSurveyTemplates();
        if (this.state.TemplateType!==1) 
            this.setState({TemplateType:1});
    }
    async ChangeToQuestionTemplate(event)
    {
        await this.getQuestionTemplates();
        if (this.state.TemplateType!==2) 
            this.setState({TemplateType:2});
    }

    //Render
        render(){
            if (this.state.error) {
                return (
                    <p> {this.state.error} </p>
                );
            }
            else if (this.state.loading) {
                return (
                    <p> Loading ... </p>
                );
            }
            else {
                
                let table=null;
                if (this.state.TemplateType===1) table = this.renderSurveyTemplateTable(this.state.templates);
                else table=this.renderQuestionTemplateTable(this.state.templates);

                
                return (
                    <div>
                        <h2 id="survey-title">{this.title}</h2>
                        <div>
                            <button id="left_button" onClick={this.ChangeToSurveyTemplate}>Surveys</button>
                            <button id="right_button" onClick={this.ChangeToQuestionTemplate}>Questions</button>
                        </div>
                        <br></br>
                        {table}
                        <div id ="overlay"></div>
                        <div id="container">
                            <div id="warning">
                                <p id="warning_message"> Delete template? </p>
                                <button id="yes">Yes</button><button id="no">No</button>
                                <br></br>
                                <br></br>
                            </div>
                        </div>
                    </div>
                    
                    );
            }
        }
    
}