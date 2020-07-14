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
        };

        this.title="GeneralPie"

        this.GetAnswer=this.GetAnswer.bind(this);
        this.GenerateQuestions=this.GenerateQuestions.bind(this);
        this.GenerateOptions=this.GenerateOptions.bind(this);
        this.DisplayQuestions=this.DisplayQuestions.bind(this);
        this.ChangeCurrentQuestion=this.ChangeCurrentQuestion.bind(this);
        this.GenerateData=this.GenerateData.bind(this);
        this.ModifyList=this.ModifyList.bind(this);
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
            if (List.length===0) this.setState({loading:false,error:"There is no question with type of 'Rating' in this survey"});
            else
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
                if (pages[i].questions[j].type==="rating") QList.push(pages[i].questions[j].label)
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
        if (event.target.name===undefined || this.state.CurrentQuestion===event.target.name) return;
        this.setState({CurrentQuestion:event.target.name});
    }

    //Generate Data
    GenerateData()
    {
        var data=[];

        for (var i =0; i<this.state.answers.answers.length; i++)
        {
            for (var j=0; j<this.state.answers.answers[i].pages.length;j++)
            {
                for (var k=0; k<this.state.answers.answers[i].pages[j].questions.length;k++)
                {
                    if (this.state.answers.answers[i].pages[j].questions[k].label===this.state.CurrentQuestion)
                    {
                        for (var l=0;l<this.state.answers.answers[i].pages[j].questions[k].answers.length;l++)
                        {
                            data=this.ModifyList(this.state.answers.answers[i].pages[j].questions[k].answers[l].value,data);
                        }
                    }
                }
            }
        }
        
        return data;
    }

    ModifyList(answer,list)
    {
        var logical=false;
        for (var i=0;i<list.length;i++)
        {
            if(list[i].name===answer)
            {
                logical=true;
                list[i].y=list[i].y+1;
            }
        }
        if (logical===false)
        {
            list.push({name:answer,y:1});
        }
        return list;
    }


    //Generate options
    GenerateOptions(data)
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
                   data:data
                }
            ]
        };
    }

    render()
    {      
        if (this.state.error)
        {
            return(
                <div id="GeneralPieErrorContainer">
                    <h3 id="GeneralPieError">{this.state.error}</h3>
                </div>
                
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
                console.log(this.state.CurrentQuestion);
                const options = this.GenerateOptions(this.GenerateData());  
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