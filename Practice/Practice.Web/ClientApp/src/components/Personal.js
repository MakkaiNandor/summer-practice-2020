import React, { Component } from 'react';
import './Survey.css';

export class Personal extends Component {
    static displayName = Personal.name;

    constructor(props) {
        super(props);
        this.state = {curr_page: 0, questions: null, first_page: true, last_page: false};
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.generateQuestions = this.generateQuestions.bind(this);
        this.survey = {title: "Personal information", description: "We appreciate the time spent on us, we promise your personal datas will not be publicated!", footer_description: "This is the end of the personal information part, question will appear on the next pages!", 
                        pages: [{
                            pageNumber: 1,
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
                        }]};
        }

    


}