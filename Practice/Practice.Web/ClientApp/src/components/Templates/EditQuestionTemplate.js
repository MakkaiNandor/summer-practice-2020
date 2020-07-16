import React, {Component} from 'react';
import './EditQuestionTemplate.css';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';

export class EditQuestionTemplate extends Component{
    static displayName=EditQuestionTemplate.name;

    constructor(props)
    {
        super(props);

        this.state={
            loading:true,
            error:null,
            template:null,
            page:null,
            templateId:this.props.match.params.id,
            overlay:0
        };
        
        this.title="Edit Template";
        this.GeneratePage=this.GeneratePage.bind(this);
        this.changeValueLabel=this.changeValueLabel.bind(this);
        this.changeValueAnswer=this.changeValueAnswer.bind(this);
        this.GetTemplate=this.GetTemplate.bind(this);
        this.componentDidMount=this.componentDidMount.bind(this);
        this.SaveTemplate=this.SaveTemplate.bind(this);
        this.renderOverlay=this.renderOverlay.bind(this);
        this.GenerateQuestion=this.GenerateQuestion.bind(this);
        this.ChangeType=this.ChangeType.bind(this);
        this.AddAnswer=this.AddAnswer.bind(this);
        this.DeleteAnswer=this.DeleteAnswer.bind(this);
    }


    componentDidMount()
    {
        this.GetTemplate();
    }

    //getTemplate
    async GetTemplate()
    {
        const cookies = new Cookies();
        var token = cookies.get('token');
        const response = await fetch ('https://localhost:44309/QuestionTemplate/getQuestionTemplateById/'+this.state.templateId,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) this.setState({error:"Request failed!"});
        else
        {
            let temp= await response.json();
            this.setState({loading:false,template:temp});
        } 
       
    }

    async SaveTemplate()
    {
        const cookies = new Cookies();
        var token = cookies.get('token');
        const response = await fetch ('https://localhost:44309/QuestionTemplate/editQuestionTemplate/'+this.state.templateId,
        {
            method:"PATCH",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`

            },
            body: JSON.stringify(this.state.template)
        });
        if (!response.ok) this.setState({error:"Saving failed!"});
        this.setState({overlay:1});
    }

    //Change values
    changeValueLabel(event)
    {
        var temp=this.state.template;
        temp.label=event.target.value;
        this.setState({template:temp});
    }

    changeValueAnswer(event)
    {
        var temp=this.state.template;
        var keys=Object.keys(this.state.template.answers);
        for (var i=0; i<keys.length; i++)
        {
            if (temp.answers[keys[i]].answerId===event.target.name)
            {
                temp.answers[keys[i]].value=event.target.value;
            }
        }
        this.setState({tempalte:temp});
    }

    //Overlay
    renderOverlay()
    {
        return(
                <div id ="EditQuestionOverlay">
                    <div id="WarningContainer">
                        <div id="warning">
                            <p id="EditQuestionTemplateWarningMessage"> Template Saved </p>
                            <Link to='../TemplateDashboard'><button className="nav_button">Back to the Dashboard</button></Link>
                            <br></br>
                            <br></br>
                        </div>
                    </div>
                </div>
        );
    }

    ChangeType(event)
    {
        var temp=this.state.template;
        temp.type=event.target.value;
        this.setState({ template : temp});
    }

    //Generate page
    GeneratePage()
    {
        var templateType;
        if (this.state.template.type==="rating") templateType="radio";
        else templateType=this.state.template.type;

        return(
            <div id="QuestionLabelDiv">
                <input onChange={this.changeValueLabel} type="text" id="QuestionLabelText" defaultValue={this.state.template.label}></input>
                <div id="AnswerContainerEdit">
                {this.state.template.answers.map(answer=>
                    <div>
                        <input type={templateType} disabled></input>
                        <input name={answer.answerId} onChange={this.changeValueAnswer} type="text" className="QuestionValueText" defaultValue={answer.value}></input>
                        <button id="EditDeleteButton" onClick={this.DeleteAnswer} name={answer.answerId}>x</button>
                    </div>
                )}
                </div>
            </div>
        );
    }

    GenerateQuestion()
    {
        return(
            <div id="QuestionLabelDiv">
                <input type="text" id="QuestionLabelText" defaultValue={this.state.template.label}></input>
            </div>
        );
    }

    

    //Delete Answer
    DeleteAnswer(event)
    {
        var temp=this.state.template;
        temp.answers.splice(event.target.name-1,1);
        this.setState({template:temp});
    }

    //Add new answer option
    AddAnswer()
    {
        var temp=this.state.template;
        temp.answers[Object.keys(temp.answers).length.toString()]={
            answerId:Object.keys(temp.answers).length+1,
            value:""
        }
        this.setState({template:temp});
    }


    render()
    {
        if (this.state.error)
        {
            return (
                <div id="GeneralPieErrorContainer">
                    <div id="homepage_button_holder">
                        <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                    </div>
                    <h3 id="GeneralPieError">{this.state.error}</h3>
                </div>
            );
        }
        else if (this.state.loading)
        {
            return (
                <div id="GeneralPieErrorContainer">
                    <div id="homepage_button_holder">
                        <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                    </div>
                    <h3 id="GeneralPieError">Loading...</h3>
                </div>
            );
        }
        else
        {
            let overlay=null;
            let Generatedpage=null;
            if (this.state.overlay===1) overlay=this.renderOverlay();
            if (this.state.template.type==="input") Generatedpage=this.GenerateQuestion();
            else Generatedpage=this.GeneratePage();

            return(
                <div>
                    <div>
                        <div id="homepage_button_holder">
                            <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                        </div>
                        <h2 id="title">{this.title}</h2>
                    </div>
                    <div id="edit_question_container">
                        <div id="Question_container" >
                        <select id="EditSelect" onChange={this.ChangeType} defaultValue={this.state.template.type}>
                            <option>radio</option>
                            <option>input</option>
                            <option>checkbox</option>
                            <option>rating</option>
                        </select>
                            {Generatedpage}
                            <br></br>
                            <button className="nav_button" onClick={this.AddAnswer}> Add </button>
                            <br></br>
                            <br></br>
                            <button className="nav_button" onClick={this.SaveTemplate}>Save Template</button>
                            <br></br>
                            <br></br>
                        </div>
                    </div>
                    {overlay}
                    
                </div>
                

            );
        }
    }
}