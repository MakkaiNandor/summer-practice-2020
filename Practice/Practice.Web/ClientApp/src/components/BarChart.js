import React, { Component } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock'
import './BarChart.css';

export class BarChart extends Component {
    static displayName = BarChart.name;

    constructor(props){
        super(props);
        this.state = {
            error: null,
            loading: true,
            survey: null,
            answers: null,
            selectedPage: null,
            selectedQuestion: null
        };

        this.onSelectChanged = this.onSelectChanged.bind(this);
    }

    componentDidMount(){
        this.getData();
    }

    async getData(){
        const response_1 = await fetch('https://localhost:44309/Survey/getSurvey/' + this.props.match.params.id);
        const response_2 = await fetch('https://localhost:44309/Answer/getAnswerById/' + this.props.match.params.id);
        if(response_1.ok && response_1.status === 200 && response_2.ok && response_2.status === 200){
            let survey = await response_1.json();
            let answers = await response_2.json();
            let pages = survey.pages.filter(page => {return page.questions.filter(question => {return question.type !== "input"}).length !== 0});
            let firstPage = pages.length === 0 ? null : pages[0];
            let questionsOfPage = firstPage ? firstPage.questions.filter(question => {return question.type !== "input"}) : [];
            let firstQuestion = questionsOfPage.length === 0 ? null : questionsOfPage[0];
            if(!firstPage || !firstQuestion) this.setState({ error: "Something went wrong!" });
            else this.setState({ loading: false, survey: survey, answers: answers, selectedPage: firstPage, selectedQuestion: firstQuestion });
        }
        else if(!response_1.ok){
            this.setState({ error: "Survey not found!" });
        }
        else{
            this.setState({ error: "Answers not found!" });
        }
    }

    onSelectChanged(event){
        if(event.target.id === "select_page"){
            let page = this.state.survey.pages.filter(page => {return page.pageNumber === parseInt(event.target.value)})[0];
            let question = page.questions.filter(question => {return question.type !== "input"})[0];
            this.setState({ selectedPage: page, selectedQuestion: question });
        }
        else{
            this.setState({ selectedQuestion: this.state.selectedPage.questions.filter(question => {return question.questionId === parseInt(event.target.value)})[0] });
        }
    }

    generatePageSelect(){
        let pages = this.state.survey.pages;
        return (
            <select id="select_page" defaultValue={this.state.selectedPage.pageNumber} onChange={this.onSelectChanged}>
                {pages.filter(page => {return page.questions.filter(question => {return question.type !== "input"}).length !== 0}).map(page => 
                    <option key={page.pageNumber} value={page.pageNumber}>{"Page " + page.pageNumber}</option>
                )}
            </select>
        );
    }

    generateQuestionSelect(){
        let questions = this.state.selectedPage.questions;
        return (
            <select id="select_question" defaultValue={this.state.selectedQuestion.questionId} onChange={this.onSelectChanged}>
                {questions.filter(question => {return question.type !== "input"}).map(question =>
                    <option key={question.questionId} value={question.questionId}>{question.label}</option>
                )}
            </select>
        );
    }

    generateOptions(){
        let respondentsOfAnswers = this.state.selectedQuestion.answers.map(answer => {return {...answer, count: 0}});
        /*let temp = this.state.answers.answers.map(answer => answer.personalData.gender);
        console.log(temp);*/
        for(let answer of this.state.answers.answers){
            let answersOfQuestion = answer.pages.filter(page => {return page.pageNumber === this.state.selectedPage.pageNumber})[0].questions.filter(question => {return question.questionId === this.state.selectedQuestion.questionId})[0].answers;
            answersOfQuestion.forEach(answer => {
                ++respondentsOfAnswers.filter(resp => {return resp.answerId === answer.answerId})[0].count;
            });
        }
        return {
            chart: {
                type: 'bar'
            },
            title: {
                text: this.state.selectedQuestion.label
            },
            xAxis: {
                categories: this.state.selectedQuestion.answers.map(answer => answer.value),
                title: {
                    text: 'Answer options'
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Number of respondents'
                },
                pointInterval: 10
            },
            legend: {
                reversed: false
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    borderColor: '#303030'
                }
            },
            series: [{
                name: 'All',
                data: respondentsOfAnswers.map(resp => resp.count)
            }]
        };
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
            let options = this.generateOptions();
            return (
                <div id="content_holder">
                    <h2 id="title">Bar Chart Reporting</h2>
                    <label>Select page:</label>
                    {this.generatePageSelect()}
                    <br />
                    <label>Select question:</label>
                    {this.generateQuestionSelect()}
                    <p>{"Page number = " + this.state.selectedPage.pageNumber}</p>
                    <p>{"Question id = " + this.state.selectedQuestion.questionId}</p>
                    <HighchartsReact id="barchart" highcharts={Highcharts} options={options} />
                </div>
            );
        }
    }
}