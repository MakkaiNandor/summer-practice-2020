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
                <h2 id="menu_survey_title">{this.title}</h2>
                <div id="menu_button_container">
                    <Link to="/CreateSurvey" className="menu_link"><button className="menu_button">Create Form</button></Link>
                    <Link to="/SurveyDashboard" className="menu_link"><button className="menu_button">My Forms</button></Link>
                    <Link to="/TemplateDashboard" className="menu_link"><button className="menu_button">Templates</button></Link>
                    <Link to="" className="menu_link"><button className="menu_button">Logout</button></Link>
                </div>
            </div>
        );
    }

}