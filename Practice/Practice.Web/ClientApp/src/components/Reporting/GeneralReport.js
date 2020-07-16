import React, {Component} from 'react';
import './GeneralReport.css';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';

export class GeneralReport extends Component {
    static displayName = GeneralReport.name;

    constructor(props){
        super(props);
        this.state={
            loading:true,
            error:null,
            maleShow :[], 
            femaleShow:[]
        };

        this.personalData = [];
        this.survey=[];
        this.gender = [0,0];
        this.male_age = [0,0,0,0,0,0,0,0,0,0,0];
        this.female_age = [0,0,0,0,0,0,0,0,0,0,0];
        this.showGroups =[];

        this.title = "General personal data report";

        this.showReport=this.showReport.bind(this);
        this.selectAll=this.selectAll.bind(this);
        this.deleteAll=this.deleteAll.bind(this);
    }

    async getAnswers(){
        const cookies = new Cookies();
        var token = cookies.get('token');
        const response = await fetch('https://localhost:44309/Answer/getAllAnswers',{
            headers: {
                'Authorization': `Bearer ${token}`
                
            }
        });
        if(!response.ok || response.status !== 200) this.setState({ error: "Cannot reach the answers" });
        else{
            this.survey = await response.json();
            this.setState({loading: false});
        }
    }

    componentDidMount(){
        this.getAnswers();
    }

    getPersonalData(){
        let i=0;
        for(let x=0;x<this.survey.length;++x){
            this.survey[x].answers.map(answer =>
                {
                this.personalData[i]=answer.personalData;
                ++i;}
            )
        }
        this.getGenderInformation();
        this.getAges();
    }

    getGenderInformation(){
        this.gender = [0,0];
        this.personalData.map(gender_data =>
            {
                if(gender_data.gender.toLowerCase() === "male"){
                    this.gender[0]++;
                }
                else if(gender_data.gender.toLowerCase() === "female"){
                    this.gender[1]++;
                }
            }
        )
    }

    getAges(){
        this.male_age = [0,0,0,0,0,0,0,0,0,0,0];
        this.female_age = [0,0,0,0,0,0,0,0,0,0,0];
        this.personalData.map(pdata =>
            {
                if(!isNaN(pdata.age) && pdata.gender.toLowerCase() === "male"){
                       if(parseInt(pdata.age) >=0 && parseInt(pdata.age) <=10 ){ this.male_age[0]++;}
                       else if(parseInt(pdata.age) >=11 && parseInt(pdata.age) <=20 ){ this.male_age[1]++;}
                       else if(parseInt(pdata.age) >=21 && parseInt(pdata.age) <=30 ) { this.male_age[2]++; }
                       else if(parseInt(pdata.age) >=31 && parseInt(pdata.age) <=40 ) { this.male_age[3]++; }
                       else if(parseInt(pdata.age) >=41 && parseInt(pdata.age) <=50 ) { this.male_age[4]++; }
                       else if(parseInt(pdata.age) >=51 && parseInt(pdata.age) <=60 ) { this.male_age[5]++; }
                       else if(parseInt(pdata.age) >=61 && parseInt(pdata.age) <=70 ) { this.male_age[6]++; }
                       else if(parseInt(pdata.age) >=71 && parseInt(pdata.age) <=80 ) { this.male_age[7]++; }
                       else if(parseInt(pdata.age) >=81 && parseInt(pdata.age) <=90 ) { this.male_age[8]++; }
                       else if(parseInt(pdata.age) >=91 && parseInt(pdata.age) <=100 ) { this.male_age[9]++; }
                       else{ this.male_age[10]++; }
                
                }
                else if(!isNaN(pdata.age) && pdata.gender.toLowerCase() === "female"){
                    if(parseInt(pdata.age) >=0 && parseInt(pdata.age) <=10 ){ this.female_age[0]++;}
                    else if(parseInt(pdata.age) >=11 && parseInt(pdata.age) <=20 ){ this.female_age[1]++;}
                    else if(parseInt(pdata.age) >=21 && parseInt(pdata.age) <=30 ) { this.female_age[2]++; }
                    else if(parseInt(pdata.age) >=31 && parseInt(pdata.age) <=40 ) { this.female_age[3]++; }
                    else if(parseInt(pdata.age) >=41 && parseInt(pdata.age) <=50 ) { this.female_age[4]++; }
                    else if(parseInt(pdata.age) >=51 && parseInt(pdata.age) <=60 ) { this.female_age[5]++; }
                    else if(parseInt(pdata.age) >=61 && parseInt(pdata.age) <=70 ) { this.female_age[6]++; }
                    else if(parseInt(pdata.age) >=71 && parseInt(pdata.age) <=80 ) { this.female_age[7]++; }
                    else if(parseInt(pdata.age) >=81 && parseInt(pdata.age) <=90 ) { this.female_age[8]++; }
                    else if(parseInt(pdata.age) >=91 && parseInt(pdata.age) <=100 ) { this.female_age[9]++; }
                    else{ this.female_age[10]++; }
                }
            }
        )
    }

    makeBarChart(){
        const BarOptions = {
            chart:{
                type: "column",
                backgroundColor: 'transparent'
            },
            title: {
                text: 'Number of fillings, distributed to age intervals by gender',
                style: {
                    color: "white"
                }
            },
            xAxis: {
                categories: ['0-10','11-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','91-100','100+'],
                labels: {
                    style: {
                        color: "white"
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'Number of surveys',
                    style: {
                        color: "white"
                    }
                },
                labels: {
                    style: {
                        color: "white"
                    }
                }
            },
            series: [{
                name: 'Male',
                data: this.state.maleShow
            },{
                name: 'Female',
                data: this.state.femaleShow
            }]
        }

        return(
            <div>
                <HighchartsReact highcharts={Highcharts} options={BarOptions}/>
            </div>
        );
    }

    makePieChart(){
        const pieOptions={
        chart:{
            type:"pie",
            backgroundColor: 'transparent'
        },
        title:{
            text:"Gender distribution",
            style: {
                color: "white"
            }
        },
        tooltip: {
            pointFormat: '<b>{series.name} </b> : <b>{point.percentage:.2f}%</b><br>Number of fillings by {point.name} gender: {point.x}</br>' 
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.percentage:.2f} %',
                    style: {
                        color: "white"
                    }
                }
            }
        },
        series:[
            {
                name: 'Gender',
                data:[
                    {
                        name:"Male",
                        y: (100*this.gender[0])/(this.gender[0]+this.gender[1]),
                        x: this.gender[0]
                    },
                    {
                        name:"Female",
                        y: (100*this.gender[1])/(this.gender[0]+this.gender[1]),
                        x: this.gender[1]
                    }
                ]
            }
        ]
        }   
    return(
        <div>
            <HighchartsReact highcharts={Highcharts} options={pieOptions}/>
        </div>
        );
    }

    UpdateBarChart(){
        var temp1 = this.state.maleShow;
        var temp2 = this.state.femaleShow;
        for(let x=0;x<this.male_age.length;++x){
            //console.log(this.showGroups[x]+"*");
            if(String(this.showGroups[x]) === "true"){
                temp1[x]=this.male_age[x];
            }
            else{
                temp1[x] = 0;
            }
        }
        //console.log(temp1);
        for(let x=0;x<this.female_age.length;++x){
            if(String(this.showGroups[x]) === "true"){
                temp2[x] = this.female_age[x];
            }
            else{
                temp2[x] = 0;
            }
        }
        //console.log(temp2);
        this.setState({maleShow:temp1,femaleShow:temp2});
    }

    showReport(event){
        let checkBox = document.getElementById(event.target.parentElement.htmlFor);
        checkBox.checked = !checkBox.checked;
        if(checkBox.checked){
            event.target.style.backgroundColor = "#0ec900";
            event.target.style.color = "white";
        }
        else{
            event.target.style.backgroundColor = "lightgrey";
            event.target.style.color = "black";
        }
        for(let x=0;x<11;++x){
            let group = "agegroup"+x;
            this.showGroups[x] = document.getElementById(group).checked;
        }
        this.UpdateBarChart();
    }

    selectAll(){
        let buttons = Array.from(document.getElementsByClassName("select_age_group_button"));
        buttons.forEach(button => {
            button.style.backgroundColor = "#0ec900";
            button.style.color = "white";
        });
        for(let x=0;x<11;++x){
            let group = "agegroup"+x;
            this.showGroups[x] = "true";
            document.getElementById(group).checked = true;
        }
        //console.log(this.showGroups);
        this.UpdateBarChart();
    }

    deleteAll(){
        let buttons = Array.from(document.getElementsByClassName("select_age_group_button"));
        buttons.forEach(button => {
            button.style.backgroundColor = "lightgrey";
            button.style.color = "black";
        });
        for(let x=0;x<11;++x){
            let group = "agegroup"+x;
            this.showGroups[x] = "false";
            document.getElementById(group).checked = false;
        }
        //console.log(this.showGroups);
        this.UpdateBarChart();
    }

    render(){
        if(this.state.error){
            return (
                <div id="GeneralPieErrorContainer">
                    <h3 id="GeneralPieError">{this.state.error}</h3>
                </div>
            );
        }
        else if(this.state.loading){
            return (
                <div id="GeneralPieErrorContainer">
                    <h3 id="GeneralPieError">Loading...</h3>
                </div>
            );
        }        
        else{
            return (
                <div id="survey_page">
                    <div id="homepage_button_holder">
                        <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                    </div>
                    <h2 id="title">{this.title}</h2>
                    {this.getPersonalData()}
                    {this.makePieChart()}
                    <p style={{color: 'white'}}>Total number of fillings: {(this.gender[0]+this.gender[1])}</p>
                    <div id="barchart">
                        {this.makeBarChart()}
                    </div>
                    <div id="filter_ages">
                        <div id="agegroup_div">
                            <button id="select_all" onClick={this.selectAll}>Select all</button>
                            <button id="delete_all" onClick={this.deleteAll}>Delete all</button>
                            <input style={{display: "none"}} type="checkbox" id="agegroup0" className="agegroup0" value="0-10"/>
                            <label htmlFor="agegroup0"><button className="select_age_group_button" onClick={this.showReport}>0-10</button></label>
                            <input style={{display: "none"}} type="checkbox" id="agegroup1" className="agegroup1" value="11-20"/>
                            <label htmlFor="agegroup1"><button className="select_age_group_button" onClick={this.showReport}>11-20</button> </label>
                            <input style={{display: "none"}} type="checkbox" id="agegroup2" className="agegroup2" value="21-30"/>
                            <label htmlFor="agegroup2"> <button className="select_age_group_button" onClick={this.showReport}>21-30</button> </label>
                            <input style={{display: "none"}} type="checkbox" id="agegroup3" className="agegroup3" value="31-40"/>
                            <label htmlFor="agegroup3"> <button className="select_age_group_button" onClick={this.showReport}>31-40</button> </label>
                            <input style={{display: "none"}} type="checkbox" id="agegroup4" className="agegroup4" value="41-50"/>
                            <label htmlFor="agegroup4"> <button className="select_age_group_button" onClick={this.showReport}>41-50</button> </label>
                            <input style={{display: "none"}} type="checkbox" id="agegroup5" className="agegroup5" value="51-60" />
                            <label htmlFor="agegroup5"> <button className="select_age_group_button" onClick={this.showReport}>51-60</button> </label>
                            <input style={{display: "none"}} type="checkbox" id="agegroup6" className="agegroup6" value="61-70"/>
                            <label htmlFor="agegroup6"> <button className="select_age_group_button" onClick={this.showReport}>61-70</button> </label>
                            <input style={{display: "none"}} type="checkbox" id="agegroup7" className="agegroup7" value="71-80"/>
                            <label htmlFor="agegroup7"> <button className="select_age_group_button" onClick={this.showReport}>71-80</button> </label>
                            <input style={{display: "none"}} type="checkbox" id="agegroup8" className="agegroup8" value="81-90" />
                            <label htmlFor="agegroup8"> <button className="select_age_group_button" onClick={this.showReport}>81-90</button> </label>
                            <input style={{display: "none"}} type="checkbox" id="agegroup9" className="agegroup9" value="91-100"/>
                            <label htmlFor="agegroup9"> <button className="select_age_group_button" onClick={this.showReport}>91-100</button> </label>
                            <input style={{display: "none"}} type="checkbox" id="agegroup10" className="agegroup10" value="100+"/>
                            <label htmlFor="agegroup10"> <button className="select_age_group_button" onClick={this.showReport}>100+</button> </label>
                        </div>
                    </div>
                </div>
            );
        }
    }
}