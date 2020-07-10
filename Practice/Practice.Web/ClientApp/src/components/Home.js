import React, { Component } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

export class Home extends Component {
  static displayName = Home.name;

  render () {
    return (
      <div >
        <h1 className="boxed" id="title">Survey creator</h1>

        {
        //<h3 href="" class="boxed_medium" id="login_button"><a href="https://localhost:44349/login">Login</a></h3>
        }

        <h3 href="" className="boxed_medium" id="login_button"><Link to="/login">Login</Link></h3>

       

      </div>
    );
  }
  
}
