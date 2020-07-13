import React, { Component } from 'react';

export class BarChart extends Component {
    static displayName = BarChart.name;

    constructor(props){
        super(props);
        this.state= {
            error: null,
            loading: true,
            survey: null,
            answers: null,
            selectedPageNumber: 1,
            selectedQuestionId: 1
        };
    }

    componentDidMount(){
        this.getData();
    }

    async getData(){
        const response_1 = await fetch('https://localhost:44309/Survey/getSurvey/' + this.props.match.params.id);
        const response_2 = await fetch('https://localhost:44309/Answer/getAnswers/' + this.props.match.params.id);
        console.log(response_1, response_2);
        if(response_1.ok && response_2.ok){
            let survey = await response_1.json();
            let answers = await response_2.json();
            console.log(survey, answers);
            this.setState({ loading: false, survey: survey, answers: answers });
        }
        else if(!response_1.ok){
            this.setState({ error: "Survey not found!" });
        }
        else{
            this.setState({ error: "Answers not found!" });
        }
    }

    getFirstQuestion(pageNumber){
        return this.state.survey.pages.filter(page => {return page.pageNumber === pageNumber})[0].questions[0].questionId;
    }

    generatePageSelect(){
        //console.log(this.state);
        return (
            <select id="select_page" defaultValue={this.state.selectedPageNumber} onChange={event => this.setState({ selectedPageNumber: parseInt(event.target.value), selectedQuestionId: this.getFirstQuestion(parseInt(event.target.value)) })}>
                {this.state.survey.pages.map(page => 
                    <option key={page.pageNumber} value={page.pageNumber}>{"Page " + page.pageNumber}</option>
                )}
            </select>
        );
    }

    generateQuestionSelect(){
        let questions = this.state.survey.pages.filter(page => {return page.pageNumber === this.state.selectedPageNumber})[0].questions;
        //console.log(this.state);
        return (
            <select id="select_question" onChange={event => this.setState({ selectedQuestionId: parseInt(event.target.value) })}>
                {questions.map(question =>
                    <option key={question.questionId} value={question.questionId}>{question.label}</option>
                )}
            </select>
        );
    }

    render(){
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
                <div>
                    <h2 id="title">Bar Chart Reporting</h2>
                    <label>Select page:</label>
                    {this.generatePageSelect()}
                    <br />
                    <label>Select question:</label>
                    {this.generateQuestionSelect()}
                    <p>{"Page number = " + this.state.selectedPageNumber}</p>
                    <p>{"Question id = " + this.state.selectedQuestionId}</p>
                </div>
            );
        }
    }
}