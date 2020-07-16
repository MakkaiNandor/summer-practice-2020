import React, { Component } from 'react';
//import './Home.css';
import home from './Home.module.css';
import { Link } from 'react-router-dom';

export class Home extends Component {
  static displayName = Home.name;
  
  render () {
    return (
      <div style={{backgroundColor: 'none'}}>
        <h1 id="title">Survey creator</h1>

        {
        //<h3 href="" class="boxed_medium" id="login_button"><a href="https://localhost:44349/login">Login</a></h3>
        }

        <div className={home.login_button_holder} ><Link to="/login"><button className={home.login_button}>Login</button></Link></div>

        

      </div>
    );
    /*return (
      <div>Hello</div>
    );*/
  }

}
