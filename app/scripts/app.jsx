import React from 'react'
import ReactDOM from 'react-dom'
import {CardDeck, Card, CardImg, CardText, CardBlock, CardTitle, CardSubtitle, Button, ButtonGroup} from 'reactstrap'

const scoreValues = {
  easy: 1,
  medium: 3,
  hard: 8
}; //plus 33% bonus on the set if you get all three (basically a bonus fourth score)

//start/stop clock functionality

//instead of textbox, use a selection segmented button

//use IDs: separate page to edit ID=>name associations (up to 50 teams)

//auth is definitely necessary

class RadioBtnGroup extends React.Component {
  constructor(props) {
    super(props);
    
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
  }
  onRadioBtnClick(selected) {
    this.setState({ selected: selected });
    this.props.scoreHandler(selected);
  }
  render() {
    return (
      <div>
        <ButtonGroup>
          <Button onClick={() => this.onRadioBtnClick(0)} active={this.props.selected === 0}>0</Button>
          <Button onClick={() => this.onRadioBtnClick(1)} active={this.props.selected === 1}>1</Button>
          <Button onClick={() => this.onRadioBtnClick(2)} active={this.props.selected === 2}>2</Button>
          <Button onClick={() => this.onRadioBtnClick(3)} active={this.props.selected === 3}>3</Button>
        </ButtonGroup>
      </div>
    )
  }
}

class DifficultySection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuestion: 0,
      scores: [0, 0, 0]
    };
  }
  scoreHandler(selected){
    var newScores = this.state.scores;
    newScores[this.state.currentQuestion] = selected;
    this.setState({scores: newScores});
  }
  back(){
    this.setState({currentQuestion: this.state.currentQuestion - 1});
  }
  next(){
    this.setState({currentQuestion: this.state.currentQuestion + 1});
  }
  render() {
    //fb.child(this.state.id + '/' + this.props.difficulty);
    const dClass = ["easy", "medium", "hard"];
    const dTitle = ["Easy", "Med", "Hard"];
    const numQuestions = [3, 3, 3]; //if currentQuestion hits this then display end screen
    
    var buttons = [];
    if(this.state.currentQuestion > 0)
      buttons.push();
    if(this.state.currentQuestion < 2)
      buttons.push();
    
    return (
      <span className={"difficulty "+dClass[this.props.difficulty]}>
        <Button className="back" onClick={this.back.bind(this)} disabled={this.state.currentQuestion <= 0}>&lt;</Button>
        <Button className="next" onClick={this.next.bind(this)} disabled={this.state.currentQuestion >= 2}>&gt;</Button>
        <h3>{dTitle[this.props.difficulty]} {this.state.currentQuestion+1}</h3>
        <RadioBtnGroup selected={this.state.scores[this.state.currentQuestion]} scoreHandler={this.scoreHandler.bind(this)} />
      </span>
    );
  }
}

class TeamCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamName: "Unknown Team", // id doesn't matter
      color: 'hsl(' + Math.floor(Math.random()*360) + ', 100%, 35%)'
    };
  }
  render() {
    return (
      <div>
        <Card inverse style={{ backgroundColor: this.state.color, borderColor: this.state.color }}>
          <CardBlock>
            <CardTitle>{this.state.teamName}</CardTitle>
            <CardSubtitle>ID: <input type="text" placeholder="12345"/></CardSubtitle>
            <DifficultySection difficulty="0"/>
            <DifficultySection difficulty="1"/>
            <DifficultySection difficulty="2"/>
          </CardBlock>
        </Card>
      </div>
    );
  }
}

class TeamCardSet extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log('hi');
    var cards = [<TeamCard />, <TeamCard />,<TeamCard />, <TeamCard />,<TeamCard />, <TeamCard />];
    return (
      <CardDeck>{cards}</CardDeck>
    );
  }
}

ReactDOM.render(
  <TeamCardSet />,
  document.getElementById('app')
);
