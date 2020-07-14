import React, {Component} from 'react';
import './GeneralReport.css';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Link } from 'react-router-dom';

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

        this.showAgeGroups=this.showAgeGroups.bind(this);
        this.hideAgeGroups=this.hideAgeGroups.bind(this);
        this.showReport=this.showReport.bind(this);
        this.selectAll=this.selectAll.bind(this);
        this.deleteAll=this.deleteAll.bind(this);
    }

    async getAnswers(){
        const response = await fetch('https://localhost:44309/Answer/getAllAnswers');
        if(!response.ok) this.setState({ error: "Cannot reach the answers" });
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
                type: "column"
            },
            title: {
                text: 'Number of fillings, distributed to age intervals by gender',
            },
            xAxis: {
                categories: ['0-10','11-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','91-100','100+']
            },
            yAxis: {
                title: {
                    text: 'Number of surveys'
                },
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
            type:"pie"
        },
        title:{
            text:"Gender distribution"
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
                    format: '<b>{point.name}</b>: {point.percentage:.2f} %'
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

    showAgeGroups(){
        document.getElementById("agegroup_div").style.display="block";
        document.getElementById("select_age_button").style.display="none";
        document.getElementById("hide_age_button").style.display="block";
    }

    hideAgeGroups(){
        document.getElementById("agegroup_div").style.display="none";
        document.getElementById("select_age_button").style.display="block";
        document.getElementById("hide_age_button").style.display="none";
    }

    showReport(){
        for(let x=0;x<11;++x){
            let group = "agegroup"+x;
            this.showGroups[x] = document.getElementById(group).checked;
        }
        this.UpdateBarChart();
    }

    selectAll(){
        for(let x=0;x<11;++x){
            let group = "agegroup"+x;
            this.showGroups[x] = "true";
            document.getElementById(group).checked = true;
        }
        //console.log(this.showGroups);
        this.UpdateBarChart();
    }

    deleteAll(){
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
                    <p>{this.state.error}</p>
            );
        }
        else if(this.state.loading){
            return (
                    <p>Loading...</p>
            );
        }        
        else{
            return (
                <div id="survey_page">
                    <div id="homepage_button_holder">
                        <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                    </div>
                    <h2 id="survey_title">{this.title}</h2>
                    {this.getPersonalData()}
                    {this.makePieChart()}
                    <p>Total number of fillings: {(this.gender[0]+this.gender[1])}</p>
                    <div id="barchart">
                        {this.makeBarChart()}
                    </div>
                    <div id="filter_ages">
                        <div id="age_buttons">
                            <button id="select_age_button" onClick={this.showAgeGroups}>Select groups</button>
                            <button id="hide_age_button" onClick={this.hideAgeGroups} style={{display: "none"}}>Hide groups</button>
                            <button id="select_age_button" onClick={this.showReport}>Show report</button>
                        </div>
                        <div style={{ display: "none"}} id="agegroup_div">
                            <input type="checkbox" id="agegroup0" className="agegroup0" value="0-10" />
                            <label htmlFor="agegroup0"> 0-10 </label><br/>
                            <input type="checkbox" id="agegroup1" className="agegroup1" value="11-20" />
                            <label htmlFor="agegroup1"> 11-20 </label><br/>
                            <input type="checkbox" id="agegroup2" className="agegroup2" value="21-30" />
                            <label htmlFor="agegroup2"> 21-30 </label><br/>
                            <input type="checkbox" id="agegroup3" className="agegroup3" value="31-40" />
                            <label htmlFor="agegroup3"> 31-40 </label><br/>
                            <input type="checkbox" id="agegroup4" className="agegroup4" value="41-50" />
                            <label htmlFor="agegroup4"> 41-50 </label><br/>
                            <input type="checkbox" id="agegroup5" className="agegroup5" value="51-60" />
                            <label htmlFor="agegroup5"> 51-60 </label><br/>
                            <input type="checkbox" id="agegroup6" className="agegroup6" value="61-70" />
                            <label htmlFor="agegroup6"> 61-70 </label><br/>
                            <input type="checkbox" id="agegroup7" className="agegroup7" value="71-80" />
                            <label htmlFor="agegroup7"> 71-80 </label><br/>
                            <input type="checkbox" id="agegroup8" className="agegroup8" value="81-90" />
                            <label htmlFor="agegroup8"> 81-90 </label><br/>
                            <input type="checkbox" id="agegroup9" className="agegroup9" value="91-100" />
                            <label htmlFor="agegroup9"> 91-100 </label><br/>
                            <input type="checkbox" id="agegroup10" className="agegroup10" value="100+" />
                            <label htmlFor="agegroup10"> 100+ </label><br/>
                        </div>
                        <div id="age_buttons">
                            <button id="select_all" onClick={this.selectAll}>Select all</button>
                            <button id="delect_all" onClick={this.deleteAll}>Delete all</button>
                        </div>
                    </div>
                </div>
            );
        }
    }
}