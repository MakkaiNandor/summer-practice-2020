import React, { Component } from 'react';
import './Login.css';
import './Home.css';

export class Login extends Component {

  render() {
    return (
      <div>
        <h1 className="boxed" id="title">Login</h1>


        <form className="boxed" id="loginform">
            <label><b>Username</b></label><br></br>
            <input type="text" placeholder="Enter Username" required></input><br></br>

            <label><b>Password</b></label><br></br>
            <input type = "password" placeholder="Enter Password" required></input><br></br>

            <button type="submit">Login</button><br></br>
        </form>

      </div>
      
    );
  }
}
