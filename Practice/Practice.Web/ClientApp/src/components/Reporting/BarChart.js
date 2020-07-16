import React, { Component } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock'
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import './BarChart.css';

export class BarChart extends Component {
    static displayName = BarChart.name;

    constructor(props){
        super(props);
        this.state = {
            error: null,
            loading: true,
            surveyTitle: null,
            answersOfSurvey: null,
            questionsOfSurvey: null,//this.getQuestions(),
            selectedQuestion: null//this.getQuestions()[0]
        };
        this.questionClicked = this.questionClicked.bind(this);
    }

    componentDidMount(){
        this.getData();
    }

    /*getQuestions(){
        let questions = this.props.survey.pages.reduce((acc, page) => {
            return acc.concat(page.questions.filter(question => question.type !== "input"));
        }, []);
        return questions;
        //this.setState({ questionsOfSurvey: questions, selectedQuestion: questions[0] });
    }*/

    async getData(){
        const cookies = new Cookies();
        var token = cookies.get('token');
        const response_survey = await fetch('https://localhost:44309/Survey/getSurvey/' + this.props.surveyId, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const response_answers = await fetch('https://localhost:44309/Answer/getAnswerById/' + this.props.surveyId, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if(!response_survey.ok || response_survey.status !== 200) this.setState({ error: "Survey not found!" });
        else if(!response_answers.ok || response_answers.status !== 200) this.setState({ error: "Answers not found!" });
        else{
            let survey = await response_survey.json();
            let answersOfSurvey = await response_answers.json();
            let questionsOfSurvey = survey.pages.reduce((acc, page) => {
                return acc.concat(page.questions.filter(question => question.type !== "input"));
            }, []);
            this.setState({ loading: false, surveyTitle: survey.title, questionsOfSurvey: questionsOfSurvey, answersOfSurvey: answersOfSurvey.answers, selectedQuestion: questionsOfSurvey[0] });
        }
    }

    questionClicked(event){
        let questionId = parseInt(event.currentTarget.id.split("_")[1]);
        this.setState({ selectedQuestion: this.state.questionsOfSurvey.filter(question => question.questionId === questionId)[0] });
    }

    generateOptions(){
        let respondentsOfAnswers = this.state.selectedQuestion.answers.map(answer => {return {...answer, male: 0, female: 0}});
        for(let answer of this.state.answersOfSurvey){
            let gender = answer.personalData.gender.toLowerCase();
            answer.pages.forEach(page => 
                {
                    let goodPage = page.questions.filter(question => question.questionId === this.state.selectedQuestion.questionId)[0];
                    if(goodPage){
                        goodPage.answers.forEach(answer => {
                            ++respondentsOfAnswers.filter(resp => resp.answerId === answer.answerId)[0][gender];
                        })
                    }
                }
            );
        }
        let isRating = this.state.selectedQuestion.type === "rating";
        let subtitle = isRating ? `From ${this.state.selectedQuestion.answers[0].value} to ${this.state.selectedQuestion.answers[4].value}`  : null;
        let categories = isRating ? ["1", "2", "3", "4", "5"] : this.state.selectedQuestion.answers.map(answer => answer.value);
        return {
            chart: {
                type: 'bar'
            },
            title: {
                text: this.state.selectedQuestion.questionId + ": " + this.state.selectedQuestion.label
            },
            subtitle: {
                text: subtitle
            },
            xAxis: {
                categories: categories,
                title: {
                    text: 'Answer options'
                }
            },
            yAxis: {
                title: {
                    text: 'Number of respondents'
                },
                allowDecimals: false
            },
            legend: {
                reversed: false
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: [{
                name: "Male",
                data: respondentsOfAnswers.map(answer => answer.male)
            },{
                name: "Female",
                data: respondentsOfAnswers.map(answer => answer.female)
            }]
        };
    }

    renderQuestions(){
        return (
            this.state.questionsOfSurvey.map(question => 
                <div key={question.questionId} id={"question_"+question.questionId} className="question" onClick={this.questionClicked} style={question.questionId === this.state.selectedQuestion.questionId ? {backgroundColor: "#0ec900", color: "white"} : null}>
                    <p className="question_label">{question.questionId}: {question.label}</p>
                    <p className="question_type">type: {question.type}</p>
                </div>
            )
        );
    }

    render(){
        if(this.state.error){
            return (
                <div>
                    <div id="homepage_button_holder">
                        <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                    </div>
                    <p>{this.state.error}</p>
                </div>
            );
        }
        else if(this.state.loading){
            return (
                <div>
                    <div id="homepage_button_holder">
                        <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                    </div>
                    <p>Loading...</p>
                </div>
            );
        }
        else{
            let options = this.generateOptions();
            return (
                <div id="content_holder">
                    {/*<div id="homepage_button_holder">
                        <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                    </div>*/}
                    <h2 id="title">{this.state.surveyTitle}</h2>
                    <div id="content">
                        <div id="question_holder">
                            {this.renderQuestions()}
                        </div>
                        <div id="chart">
                            <HighchartsReact id="barchart" highcharts={Highcharts} options={options} />
                        </div>
                    </div>
                </div>
            );
        }
    }
}