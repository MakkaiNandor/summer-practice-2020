import React, { Component } from 'react';

export class TemplateDashboard extends Component {
    static displayName = TemplateDashboard.name;

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            error: null,
        };

        this.templates = null;
    }
        

    componentDidMount() {
        this.getSurveyTemplates();
    }

    //Get Templates
    async getSurveyTemplates() {
        const response = await fetch('https://localhost:44309/SurveyTemplate/getAllSurveyTemplates');
        if (!response.ok) this.setState({ error: "There are no templates!" });
        else {
            this.templates = await response.json();
            
        }
        this.setState({ loading: false });
    }


    //Generate Table
    renderTable(templates) {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Template Name</th> <th>Create Date</th> <th></th> <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        templates.map(template=>
                            <tr key={template.name}> 
                                <td>{template.name}</td>
                                <td>NotImplemented</td>
                                <td><button>Edit</button></td>
                                <td><button>Delete</button></td>
                            </tr>
                            )
                    }
                </tbody>
            </table>
            )
    }

        render(){
            if (this.state.error) {
                return (
                    <p> {this.state.error} </p>
                );
            }
            else if (this.state.loading) {
                return (
                    <p> Loading ... </p>
                );
            }
            else {
                let table=this.renderTable(this.templates);
                return (
                    <div>
                        <p> Hello </p>
                        {table}
                    </div>
                    
                    );
            }
        }
    
}