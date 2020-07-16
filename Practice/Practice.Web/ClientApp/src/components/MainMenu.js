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
                <div id="homepage_button_holder">
                        <Link to="/MainMenu" className="menu_link"><button id="homepage_button">Home page</button></Link>
                </div>
                <h2 id="survey_title">{this.title}</h2>
                <div id="button_container">
                    <Link to="/CreateSurvey" className="Link"><button id="survey-title" className="CreateSurveyButton">Create Survey</button></Link>
                    <Link to="/SurveyDashboard" className="Link"><button id="survey-title" className="MyFormsButton">My Forms</button></Link>
                    <Link to="/TemplateDashboard" className="Link"><button id="survey-title" className="TemplatesButton">Templates</button></Link>
                    <Link to="" className="Link"><button id="survey-title" className="LogoutButton">Logout</button></Link>
                </div>
            </div>
        );
    }

}