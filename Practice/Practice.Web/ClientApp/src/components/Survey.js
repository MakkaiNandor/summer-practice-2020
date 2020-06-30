import React, { Component } from 'react';
import './Survey.css';

export class Survey extends Component {
  static displayName = Survey.name;

  constructor(props) {
    super(props);
    this.state = {curr_page: 0, questions: null, first_page: true, last_page: false, submit: false};
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.generateQuestions = this.generateQuestions.bind(this);
    this.saveAnswers = this.saveAnswers.bind(this);
    this.submitSurvey = this.submitSurvey.bind(this);
    this.user_answers = [];
    this.survey = await this.getSurvey();
    /*{title: "Survey 1", description: "This is a survey!", footer_description: "This is the end of survey, thank you!", 
                    pages: [{
                        pageNumber: 1,
                        questions: [{
                            questionId: 1,
                            label: "What's your name?",
                            type: "input",
                            answers: []
                        },{
                            questionId: 2,
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
                        }]
                    },{
                        pageNumber: 2,
                        questions: [{
                            questionId: 3,
                            label: "Foods:",
                            type: "checkbox",
                            answers: [{
                                    answerId: 1,
                                    value: "pizza",
                                    selected: false
                                },{
                                    answerId: 2,
                                    value: "spagetti",
                                    selected: false
                                },{
                                    answerId: 3,
                                    value: "hamburger",
                                    selected: false
                                },{
                                    answerId: 4,
                                    value: "hot-dog",
                                    selected: false
                                }]
                        },{
                            questionId: 4,
                            label: "What's your hobby?",
                            type: "input",
                            answers: []
                        },{
                            questionId: 5,
                            label: "Did you like this survey?",
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
                    }]};*/
    }

    async getSurvey(){
        const response = await fetch('https://localhost:44309/getSurvey/' + this.props.match.params.id);
        const data = await response.json();
        return data;
    }

    componentDidMount(){
        console.log(this.props.match.params.id);
        if(this.survey.pages.length === 1) this.setState({last_page: true});
        this.setState({questions: this.survey.pages[0].questions});
    }

    nextPage(){
        this.saveAnswers();
        if(this.state.first_page) this.setState({first_page: false});
        if(this.state.curr_page === this.survey.pages.length - 2) this.setState({last_page: true});
        this.setState({curr_page: this.state.curr_page + 1, questions: this.survey.pages[this.state.curr_page+1].questions});
    }

    prevPage(){
        this.saveAnswers();
        if(this.state.last_page) this.setState({last_page: false});
        if(this.state.curr_page === 1) this.setState({first_page: true});
        this.setState({curr_page: this.state.curr_page - 1, questions: this.survey.pages[this.state.curr_page-1].questions});
    }

    generateAnswers(question){
        switch(question.type){
            case "input":
                return (
                    <div className="answer">
                        <input type="text" id={"question_" + question.questionId + "_answer"} name={"question_" + question.questionId} defaultValue={this.user_answers[question.questionId] ? this.user_answers[question.questionId][0] : ""}/>
                    </div>
                );
            case "radio":
                return (
                    question.answers.filter(answer => !answer.selected).map(answer =>
                        <div className="answer" key={answer.answerId}>
                            <input type="radio" id={"question_" + question.questionId + "_answer_" + answer.answerId} name={"question_" + question.questionId} value={answer.value} defaultChecked={this.user_answers[question.questionId] ? !!this.user_answers[question.questionId][answer.answerId] : false}/>
                            <label htmlFor={"question_" + question.questionId + "_answer_" + answer.answerId}>{answer.value}</label>
                        </div>
                    )
                );
            case "checkbox":
                return (
                    question.answers.filter(answer => !answer.selected).map(answer => 
                        <div className="answer" key={answer.answerId}>
                            <input type="checkbox" id={"question_" + question.questionId + "_answer_" + answer.answerId} name={"question_" + question.questionId} value={answer.value} defaultChecked={this.user_answers[question.questionId] ? !!this.user_answers[question.questionId][answer.answerId] : false}/>
                            <label htmlFor={"question_" + question.questionId + "_answer_" + answer.answerId}>{answer.value}</label>
                        </div>
                    )
                );
            default: return null;
        }
    }

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

    saveAnswers(){
        var answers = Array.from(document.getElementsByClassName("answer"));
        answers.forEach(answer => {
            let inputElement = answer.firstElementChild;
            let tmp = inputElement.id.split("_");
            let qId = tmp[1];
            let aId = tmp.length < 4 ? 0 : tmp[3];
            if(!this.user_answers[qId]) this.user_answers[qId] = [];
            if(tmp.length < 4 || (tmp.length === 4 && inputElement.checked)){
                this.user_answers[qId][aId] = inputElement.value;
            }
            else if(tmp.length === 4 && !inputElement.checked && this.user_answers[qId][aId]){
                this.user_answers[qId].splice(aId, 1);
            }
        });
    }

    submitSurvey(){
        this.saveAnswers();
        this.setState({submit: true});
        console.log(this.user_answers);
    }

  render() {
      if(!this.state.submit){
        var desc = this.state.first_page ? this.survey.description : null;
        var footer_desc = this.state.last_page ? this.survey.footer_description : null;

        var next_button = this.state.last_page ? null : <button className="survey-button" onClick={this.nextPage}>Next page</button>;
        var prev_button = this.state.first_page ? null : <button className="survey-button" onClick={this.prevPage}>Previous page</button>;
        var submit_button = this.state.last_page ? <button type="submit" className="survey-button" onClick={this.submitSurvey}>Submit survey</button> : null;

        var questions = this.state.questions ? this.generateQuestions() : null;

        return (
        <div id="survey_page">
            <h2 id="survey_title">{this.survey.title}</h2>
            <p className="description"><b>{desc ? "Description: " : null}</b>{desc}</p>
            {questions}
            <p className="description">{footer_desc}</p>
            {prev_button}
            {next_button}
            {submit_button}
        </div>
        );
      }
      else{
          return(
              <div id="survey_page">
                  <h2>{this.survey.title}</h2>
                  <p>Submitted data</p>
                  {this.user_answers.map(question =>
                    <div className="question">
                        {question.map(answer =>
                          <p>{answer}</p>  
                        )}
                    </div>
                  )}
              </div>
          );
      }
  }
}