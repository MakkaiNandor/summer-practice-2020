import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Survey } from './components/Public/Survey';
import { Login } from './components/Login';
import { Personal } from './components/Public/Personal';
import { EditForm } from './components/Editing/EditFormPage';
import { EditFormQuestion } from './components/Editing/EditFormQuestion';
import { TemplateDashboard } from './components/Templates/TemplateDashboard';
import { MainMenu } from './components/MainMenu';
import { EditQuestionTemplate } from './components/Templates/EditQuestionTemplate';
import { SurveyDashboard } from './components/Surveys/SurveyDashboard';
import { CreateSurvey } from './components/Surveys/CreateSurvey';
import { Reporting } from './components/Reporting/Reporting';
import { GeneralReport } from './components/Reporting/GeneralReport';

import './custom.css'


export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
        <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/survey/:id' component={Survey} />
        <Route path='/login' component={Login} />
        <Route path='/personal/:id' component={Personal} />
        <Route path='/TemplateDashboard' component={TemplateDashboard} />
        <Route path='/MainMenu' component={MainMenu} />
        <Route path='/EditQuestionTemplate/:id' component={EditQuestionTemplate}/>
        <Route path='/SurveyDashboard' component={SurveyDashboard} />
        <Route path='/CreateSurvey' component={CreateSurvey} />
        <Route path='/EditTemplate/:id' component={CreateSurvey} />
        <Route path='/editform/:id' component={EditForm} />
        <Route path='/editformquestion/:id' component={EditFormQuestion} />
        <Route path='/Reporting/:id' component={Reporting} />
        <Route path='/GeneralReporting' component={GeneralReport} />
      </Layout>
    );
  }
}
