import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  constructor(props){
    super(props);
    this.state={datas:""};
  }
  componentDidMount(){
    this.getData();
  }
  render () {
    return (
      <div>
        <h1>{this.state.datas.message}</h1>
      </div>
    );
  }

  async getData(){
    const response= await fetch('https://localhost:44309/Survey/getMessage');
    const data=await response.json();
    console.log(data);
    this.setState({datas:data});
  }
}
