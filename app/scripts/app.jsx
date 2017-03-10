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
    this.ref = fb.child('scores')
      .child('team'+this.props.teamId)
      .child(["easy", "medium", "hard"][this.props.difficulty]);
    //initial value???
    this.ref.on('value', function(snapshot){
      if(!snapshot.val())
        this.ref.set(this.state.scores);
      else
        this.setState({scores: snapshot.val()});
    }.bind(this));
  }
  scoreHandler(selected){
    var newScores = this.state.scores;
    newScores[this.state.currentQuestion] = selected;
    this.setState({scores: newScores});
    this.ref.set(newScores);
  }
  back(){
    this.setState({currentQuestion: this.state.currentQuestion - 1});
  }
  next(){
    this.setState({currentQuestion: this.state.currentQuestion + 1});
  }
  render() {
    const dClass = ["easy", "medium", "hard"];
    const dTitle = ["Easy", "Med", "Hard"];
    //const numQuestions = [3, 3, 3]; //if currentQuestion hits this then display end screen
    
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
  setTeamId(event){
    if(event.target.value){
      var teamId = event.target.value;
      console.log('changing to', teamId);
      fb.child('teams').child(teamId).once('value').then(function(snapshot){
        if(snapshot.val() != null)
          this.setState({teamName: snapshot.val().name, teamId: teamId});
        else
          this.setState({teamName: "Unknown Team", teamId: undefined});
      }.bind(this));
    }
    else
      this.setState({teamName: "Unknown Team", teamId: undefined});
  }
  render() {
    var setTeamId = this.setTeamId.bind(this);
    var difficultySections;
    if(this.state.teamId != undefined)
      difficultySections = 
        <div>
          <DifficultySection difficulty="0" teamId={this.state.teamId}/>
          <DifficultySection difficulty="1" teamId={this.state.teamId}/>
          <DifficultySection difficulty="2" teamId={this.state.teamId}/>
        </div>;
    else
      difficultySections = <p>Enter a team ID first.</p>;
    return (
      <Card inverse style={{ backgroundColor: this.state.color, borderColor: this.state.color }}>
        <CardBlock>
          <CardTitle>{this.state.teamName}</CardTitle>
          <a href="#" onClick={this.props.remove}>x</a>
          <CardSubtitle>ID: <input type="text" placeholder="12345" value={this.state.teamId} onChange={setTeamId}/></CardSubtitle>
          
          {difficultySections}
        </CardBlock>
      </Card>
    );
  }
}

class TeamCardSet extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {cards: []};
  }
  addCard(){
    var index;
    do{index = 'card' + Math.floor(Math.random() * 100000000);}
    while(this.state.cards[index] !== undefined);
    
    this.state.cards[index] = <TeamCard token={window.token} remove={this.removeCard.bind(this, index)} />;
    this.setState({cards: this.state.cards});
  }
  removeCard(i){
    this.state.cards[i] = undefined;
    this.setState({cards: this.state.cards});
  }
  render() {
    console.log('hi');
    if(true||window.token){
      var cards = [];
      for(var prop in this.state.cards){
        if(this.state.cards.hasOwnProperty(prop))
          cards.push(this.state.cards[prop]);
      }
      return (
        <div>
          <div>{cards}</div>
          <Button onClick={this.addCard.bind(this)}>Add Team</Button>
          <Button onClick={function(){firebase.auth().signOut();window.location.reload();}}>Sign Out</Button>
        </div>
      );
    }else{
      return <p>Not authenticated</p>;
    }
  }
}

window.render = function(){
  ReactDOM.render(
    <TeamCardSet />,
    document.getElementById('app')
  );
};