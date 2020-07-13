import React, {Component} from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import "./GeneralPieChart.css"
import {Link} from 'react-router-dom'

export class GeneralPie extends Component
{
    constructor(props)
    {
        super(props);
        this.state={
            loading:true,
            error:null,
            SurveyId:this.props.match.params.id,
            answers:null,
            SurveyTitle:null,
            CurrentQuestion:null,
            QuestionList:null,
            data:null
        };

        this.title="GeneralPie"

        this.GetAnswer=this.GetAnswer.bind(this);
        this.GenerateQuestions=this.GenerateQuestions.bind(this);
        this.GenerateOptions=this.GenerateOptions.bind(this);
        this.DisplayQuestions=this.DisplayQuestions.bind(this);
        this.ChangeCurrentQuestion=this.ChangeCurrentQuestion.bind(this);
    }

    componentDidMount()
    {
        this.GetAnswer();
    }

    //Get Answers
    async GetAnswer()
    {
        const response = await fetch ('https://localhost:44309/Answer/getAnswerById/'+this.state.SurveyId);
        const response2= await fetch ('https://localhost:44309/Survey/getSurvey/'+this.state.SurveyId);
        if (!response.ok || !response2.ok) this.setState({error:"Request failed!"});
        else
        {
            let temp= await response.json();
            var survey = await response2.json();

            var List=this.GenerateQuestions(temp);
            this.setState({loading:false,answers:temp,SurveyTitle:survey.title,QuestionList:List,CurrentQuestion:List[0]});
        } 
       
    }

    //Generate Questions
    GenerateQuestions(temp)
    {
        var pages=temp.answers[0].pages;
        var QList=[];

        for (var i=0;i<pages.length;i++)
        {
            for (var j=0; j<pages[i].questions.length; j++)
            {
                QList.push(pages[i].questions[j].label)
            }
        }
        return QList;
    }


    //Render questions
    DisplayQuestions()
    {
        return(
            this.state.QuestionList.map(question =>
            <button className="PieQuestionLabel" onClick={this.ChangeCurrentQuestion} name={question}>{question}<hr></hr></button>
                )
        );
    }

    //Change Current Question
    ChangeCurrentQuestion(event)
    {
        var List=[];
        for (var i =0; i<this.state.answers.answers.length; i++)
        {
            for (var j=0; j<this.state.answers.answers[i].pages.length;j++)
            {
                for (var k=0; k<this.state.answers.answers[i].pages[j].questions.length;k++)
                {

                }
            }
        }
        this.setState({CurrentQuestion:event.target.name});


    }

    //Generate options
    GenerateOptions()
    {
        return {
            chart:{
                type:"pie"
            },
            title:{
                text:"Results of:<br></br><b><p> "+this.state.CurrentQuestion+" </p></b>"
            },
            series:[
                {
                    data:[
                        {
                            name:'Chrome',
                            y:61.41,
                        },
                        {
                            name:"Explorer",
                            y:11.84
                        },
                        {
                            name:"Other",
                            y:30
                        }
                    ]
                }
            ]
        };
    }

    render()
    {
        const options = this.GenerateOptions();        
        if (this.state.error)
        {
            return(
                <p>{this.state.error}</p>
            );
        }
        else 
        {
            if (this.state.loading)
            {
                return (
                    <p>Loading ...</p>
                );
            }
            else
            {
                var questions=this.DisplayQuestions();
                return (
                    <div>
                        <div id="homepage_button_holder">
                            <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                        </div>
                        <h2 id="PageTitlePie">{this.state.SurveyTitle}</h2>
                        <br></br>
                        <br></br>
                        <HighchartsReact id="GeneralPieChart" highcharts={Highcharts} options={options} />
                        <div id="PieQuestionContainer">
                            {questions}
                        </div>
                    </div>
                );
            }
            
        }
        

    }

    
}