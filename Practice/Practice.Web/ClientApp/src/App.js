import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Survey } from './components/Survey';
import { Login } from './components/Login';
import { Personal } from './components/Personal';
import { TemplateDashboard } from './components/TemplateDashboard';
import { SurveyDashboard } from './components/SurveyDashboard';
import { CreateSurvey } from './components/CreateSurvey';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/survey/:id' component={Survey} />
        <Route path='/login' component={Login} />
        <Route path='/TemplateDashboard' component={TemplateDashboard}/>
        <Route path='/personal/:id' component={Personal} />
        <Route path='/SurveyDashboard' component={SurveyDashboard} />
        <Route path='/CreateSurvey' component={CreateSurvey} />
      </Layout>
    );
  }
}
