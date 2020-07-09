import React, {Component} from 'react';
import "./MainMenu.css"
import { Link } from 'react-router-dom';


export class MainMenu extends Component{

    static displayName = MainMenu.name;

    constructor(props)
    {
        super (props);
        this.state ={
            loading:true,
            error:null
        };

        this.title="Form Creator";
    }

    render()
    {
        return(
            <div>
                <h2 id="survey_title">{this.title}</h2>
                <div id="button_container">
                    <Link to="./CreateSurvey" className="Link"><button id="survey-title" className="button">Create Form</button></Link>
                    <Link to="./SurveyDashboard" className="Link"><button id="survey-title" className="button">My Forms</button></Link>
                    <Link to="./TemplateDashboard" className="Link"><button id="survey-title" className="button">Templates</button></Link>
                    <Link to="" className="Link"><button id="survey-title" className="button">Logout</button></Link>
                </div>
            </div>
        );
    }

}