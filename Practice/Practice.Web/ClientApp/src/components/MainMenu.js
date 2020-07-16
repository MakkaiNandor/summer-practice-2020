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

        this.title="Survey Creator";
    }

    render()
    {
        return(
            <div>
                <div id="homepage_button_holder">
                        <Link to="/MainMenu" className="menu_link"><button id="homepage_button">Home page</button></Link>
                </div>
                <h2 id="title">{this.title}</h2>
                <div id="button_container">
                    <Link to="/CreateSurvey" className="Link"><button className="menu_button">Create Survey</button></Link>
                    <Link to="/SurveyDashboard" className="Link"><button className="menu_button">My Surveys</button></Link>
                    <Link to="/TemplateDashboard" className="Link"><button className="menu_button">Templates</button></Link>
                    <Link to="" className="Link"><button className="menu_button">Logout</button></Link>
                </div>
            </div>
        );
    }

}