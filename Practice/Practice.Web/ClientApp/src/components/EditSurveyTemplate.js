import React, {Component} from 'react';
import './EditSurveyTemplate.css';
import { Link } from 'react-router-dom';

export class EditSurveyTemplate extends Component{
    static displayName=EditSurveyTemplate.name;

    constructor(props)
    {
        super(props);

        this.state={
            loading:true,
            error:null,
            template:null,
            SelectedPage:0,
            page:null,
            currentPage:0,
            templateId:1
        };
        
        this.templateId=1;
        this.title="Edit Template";
        this.GeneratePage0=this.GeneratePage0.bind(this);
        this.GeneratePage=this.GeneratePage.bind(this);
        this.changeValue=this.changeValue.bind(this);
        this.GenerateButtons=this.GenerateButtons.bind(this);
        this.SwitchPage=this.SwitchPage.bind(this);
        this.GetTemplate=this.GetTemplate.bind(this);
        this.componentDidMount=this.componentDidMount.bind(this);
    }


    componentDidMount()
    {
        this.GetTemplate();
    }

    //getTemplate
    async GetTemplate()
    {
        const response = await fetch ('https://localhost:44309/SurveyTemplate/getSurveyTemplateById/'+this.templateId);
        if (!response.ok) this.setState({error:"Request failed!"});
        else
        {
            let temp= await response.json();
            this.setState({loading:false,template:temp});
        }  
    }

    async SaveTemplate()
    {
        const response = await fetch ('https://localhost:44309/SurveyTemplate/editSurveyTemplateId/'+this.templateId,
        {
            method:"PATCH",
            body: JSON.stringify(this.state.template)
        });
        if (!response.ok) this.setState({error:"Saving failed!"});
    }

    //Generate Page 0 
    GeneratePage0()
    {
        return(
            <div className="page">
                    <div id="inputs">
                    <br></br>
                        <p className="inputLabel">Title:</p>
                        <input type="text" id="title" className="inputType" onChange={this.changeValue} defaultValue={this.state.template.title}></input> 
                        <br></br> 
                        <p className="inputLabel">Name:</p>    
                        <input type="title" id="name" className="inputType" onChange={this.changeValue} defaultValue={this.state.template.name}></input>
                        <br></br>
                        <p className="inputLabel">Description:</p>
                        <textarea id="description"  className="inputType" onChange={this.changeValue} defaultValue={this.state.template.description}></textarea>
                        <br></br>
                        <p className="inputLabel">Ending:</p>
                        <textarea id="ending"  className="inputType" onChange={this.changeValue} defaultValue={this.state.template.ending}></textarea>
                        <br></br>
                        <br></br>
                    </div>  
            </div>
        )
    }

    //switch page number
    SwitchPage(event)
    {
        this.setState({currentPage:event.target.id});
        //console.log(event.target.id);
    }

    //Generate other pages
    GeneratePage()
    {
        return null;
    }


    //Page0 ChangeValue
    changeValue(event)
    {
        
        let temp=this.state.template;
        temp[event.target.id]=event.target.value;
        this.setState({template:temp});
    }

    //Generate page buttons
    GenerateButtons()
    {
        let pages=this.state.template.pages;
        return(
            pages.map(page=> 
                <button className="buttons" id={page.pageNumber} onClick={this.SwitchPage}>Page {page.pageNumber}</button>
                )
        );
    }

    render()
    {
        


        if (this.state.error)
        {
            return (
                <div>
                    <div id="homepage_button_holder">
                        <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                    </div>
                    <p>{this.state.error}</p>
                </div>
            );
        }
        else if (this.state.loading)
        {
            return (
                <div>
                    <div id="homepage_button_holder">
                        <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                    </div>
                    <p>Loading ...</p>
                </div>
            );
        }
        else
        {
            let Generatedpage=null;
            if (this.state.currentPage===0) Generatedpage=this.GeneratePage0();
            else Generatedpage=this.GeneratePage();

            return(
                <div>
                    <div>
                        <div id="homepage_button_holder">
                            <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                        </div>
                        <h2 id="page_title">{this.title}</h2>
                    </div>
                    <div id="container">
                        <div id="pageButtons">
                            <button className="buttons" id="0" onClick={this.SwitchPage}>Page 0</button>
                            {this.GenerateButtons()}
                        </div>
                        <div id="Question_container" >
                            {Generatedpage}
                            <button id="saveButton" >Save Template</button>
                            <br></br>
                        </div>
                    </div>
                    
                    
                </div>
                

            );
        }
    }
}