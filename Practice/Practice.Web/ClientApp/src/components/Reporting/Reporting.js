import React, { Component } from 'react';
import { SurveyReport } from './SurveyReport';
import { GeneralPie } from './GeneralPieChart';
import { BarChart } from './BarChart';
import { Link } from 'react-router-dom';

export class Reporting extends Component {
    static displayName = Reporting.name;

    constructor(props){
        super(props);
        this.state = {
            option: 0
        };
        this.buttonClicked = this.buttonClicked.bind(this);
    }

    buttonClicked(event){
        this.setState({ option: parseInt(event.target.value) })
    }

    render(){
        let content = this.state.option === 0 ? <SurveyReport surveyId={this.props.match.params.id} /> : this.state.option === 1 ? <GeneralPie surveyId={this.props.match.params.id} /> : <BarChart surveyId={this.props.match.params.id} />;
        return (
            <div id="reporting_page">
                <div id="homepage_button_holder">
                    <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                </div>
                <div id="buttons">
                    <button onClick={this.buttonClicked} value="0">Personal</button>
                    <button onClick={this.buttonClicked} value="1">Pie Chart</button>
                    <button onClick={this.buttonClicked} value="2">Bar Chart</button>
                </div>
                <div id="content">
                    {content}
                </div>
            </div>
        );
    }
}