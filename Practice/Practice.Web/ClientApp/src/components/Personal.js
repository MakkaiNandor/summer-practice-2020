import React, { Component } from 'react';
import './Personal.css';

export class Personal extends Component {
    static displayName = Personal.name;

    constructor(props) {
        super(props);
        this.state = { questions: null}; //variables
        this.generateQuestions = this.generateQuestions.bind(this);
        this.survey = {title: "Personal information part", description: "We appreciate the time spent on us, we promise your personal datas will not be publicated!", footer_description: "This is the end of the personal information part, questions related to the topic will appear on the next pages!", 
                        questions_part: [{
                            questions: [{
                                questionId: 1,
                                label: "What's your name?",
                                type: "input",
                                answers: []
                            },{
                                questionId: 2,
                                label: "Your age:",
                                type: "input",
                                answers: []
                            },{
                                questionId: 3,
                                label: "Your gender:",
                                type: "radio",
                                answers: [{
                                    answerId: 1,
                                    value: "male",
                                    selected: false
                                },{
                                    answerId: 2,
                                    value: "female",
                                    selected: false
                                }]
                            },{
                                questionId: 4,
                                label: "What's your nationality?",
                                type: "input",
                                answers: []
                            },{
                                questionId: 5,
                                label: "Do you trust us?",
                                type: "radio",
                                answers: [{
                                    answerId: 1,
                                    value: "Yes",
                                    selected: false
                                },{
                                    answerId: 2,
                                    value: "No",
                                    selected: false
                                }]
                            }]
                        }]
                    };
        } //elements of a survey: title, description, footer, questions, answers
        
        componentDidMount(){
            this.setState({questions: this.survey.questions_part[0].questions}); //show questions from the respective page
        }
    
        //this function helps us to show the proper form of the questions(input text, checkbox, radio button)
        generateAnswers(question){
            switch(question.type){
                case "input":
                    return (
                        <div className="answer">
                            <input type="text" name={"question_" + question.questionId + "_answer"} defaultValue=""/>
                        </div>
                    );
                case "radio":
                    return (
                        question.answers.map(answer => //we could have more answers, that is why we use more answer ids
                            <div className="answer" key={answer.answerId}>
                                <input type="radio" id={"question_" + question.questionId + "_answer_" + answer.answerId} name={"question_" + question.questionId} value={answer.value}/>
                                <label htmlFor={"question_" + question.questionId + "_answer_" + answer.answerId}>{answer.value}</label>
                            </div>
                        )
                    );
                case "checkbox":
                    return (
                        question.answers.map(answer => //we could have more answers, that is why we use more answer ids
                            <div className="answer">
                                <input type="checkbox" id={"question_" + question.questionId + "_answer_" + answer.answerId} name={"question_" + question.questionId} value={answer.value}/>
                                <label htmlFor={"question_" + question.questionId + "_answer_" + answer.answerId}>{answer.value}</label>
                            </div>
                        )
                    );
                default: return null; //in every other case we return null
            }
        }
    
        //with this function we generate the questions, and in some cases(if we use radio button or checkbox), we have options to choose our answer
        generateQuestions(){
            return (
                <div className="question-holder">
                    {this.state.questions.map(question => 
                        <div className="question" id={"question_" + question.questionId} key={question.questionId}>
                            <p className="question_label"><b>{question.questionId + ": "}</b>{question.label}</p>
                            <div className="answer-holder">{this.generateAnswers(question)}</div>
                        </div>
                    )}
                </div>
            );
        }
    
      render() {
        var start_survey_button = <button className="survey-button">Begin the questions</button>; //if we are on the last page of the personal information, this button will appear, and will redirect to the questions related to the survey's topic 
    
        var questions = this.state.questions ? this.generateQuestions() : null; //if there are questions, we generate them, other case we don't
    
        return (
          <div id="survey_page">
            <h2 id="survey_title">{this.survey.title}</h2> {/*the survey's title */}
            <p className="description"><b>{this.survey.description ? "What will happen with your data: " : null}</b>{this.survey.description}</p> {/*description */}
            {questions} {/*the questions */}
            <p className="description">{this.survey.footer_description}</p> {/*the survey's footer */}
            {start_survey_button} {/*Begin the questions button */}
          </div>
        );
    }


}