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
    console.log('asdf');
    this.state = {
      currentQuestion: 0,
      scores: [0, 0, 0]
    };
    this.ref = fb.child('scores')
      .child('team'+this.props.teamId)
      .child(["easy", "medium", "hard"][this.props.difficulty]);
    this.ref.on('value', function(snapshot){
      console.log('mooooo');
      if(!snapshot.val())
        this.ref.set(this.state.scores);
      else
        this.setState({scores: snapshot.val()});
    }.bind(this));
    console.log('x');
  }
  componentWillUnmount(){
    this.ref.off('value');
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
      teamName: null,
      teamId: "",
      color: 'grey'
    };
  }
  setTeamId(event){
    if(this.state.teamId)
      fb.child('teams').child(this.state.teamId).off('value');
    
    var teamId = event.target.value;
    this.setState({teamName: null, teamId: teamId});
    if(teamId)
      fb.child('teams').child(teamId).on('value', function(snapshot){
        if(snapshot.val())
          this.setState({teamName: snapshot.val().name});
      }.bind(this));
  }
  changeColor(event){
    this.setState({color: event.target.value});
  }
  componentWillUnmount(){
    fb.child('teams').child(teamId).off('value');
  }
  render() {
    const spectrum = {
      pink: "MediumVioletRed",
      red: "DarkRed",
      orange: "OrangeRed",
      yellow: "Goldenrod",
      green: "Green",
      blue: "DarkBlue",
      violet: "DarkViolet"
    };
    
    var difficultySections;
    if(this.state.teamName != null)
      difficultySections = 
        <div>
          <DifficultySection difficulty="0" teamId={this.state.teamId}/>
          <DifficultySection difficulty="1" teamId={this.state.teamId}/>
          <DifficultySection difficulty="2" teamId={this.state.teamId}/>
        </div>;
    else
      difficultySections = <p>Invalid team ID.</p>;
    var teamName = this.state.teamName || "Unknown Team";
    return (
      <Card inverse style={{ backgroundColor: this.state.color, borderColor: this.state.color }}>
        <CardBlock>
          <a href="#" onClick={this.props.remove} className="xBtn">&#x2715;</a>
          <select value={this.state.color} style={{color: "white", backgroundColor: this.state.color}} onChange={this.changeColor.bind(this)}>
            <option style={{backgroundColor: "grey"}}>grey</option>
            {Object.keys(spectrum).reduce(function(previous, current) {
                previous.push(<option key={spectrum[current]} value={spectrum[current]} style={{backgroundColor: spectrum[current]}}>{current}</option>);
                return previous;
            }, [])}
          </select>
          <CardTitle>{teamName}</CardTitle>
          <CardSubtitle>ID: <input type="text" placeholder="12345" value={this.state.teamId} onChange={this.setTeamId.bind(this)}/></CardSubtitle>
          
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
          <header>
            <h1><img src="http://wuct.wustl.edu/images/wuct.jpg" alt="WUCT" />Broken Bonds Round: Scoring</h1>
            <a href="#" className="add" onClick={this.addCard.bind(this)}><i className="fa fa-plus" aria-hidden="true"></i></a>
            <a href="#" className="signout" onClick={function(){window.signOut()}}><i className="fa fa-sign-out" aria-hidden="true"></i></a>
          </header>
          <div>{cards}</div>
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

window.cancelAuthStateChanged = false;
window.signOut = function(){
  window.cancelAuthStateChanged = true;
  firebase.auth().signOut();
  window.location.reload();
}
firebase.auth().onAuthStateChanged(function(user){
  if(window.cancelAuthStateChanged)
    return;
  
  console.log('attempt');
  if (user) {
    if(user.email != 'wuct@clive.io')
      window.signOut();
    else
      window.render();
  }
});
document.getElementById('password').onkeypress = function(e){
  if(e.keyCode == 13)
    document.getElementById('passsubmit').click();
}
document.getElementById('passsubmit').onclick = function(e){
  var password = document.getElementById('password').value;
  if(!password)
    document.getElementById('app').innerHTML = 'failed to sign in';
  else
    firebase.auth().signInWithEmailAndPassword('wuct@clive.io', password).then(window.render).catch(function(error){
      document.getElementById('app').innerHTML = 'failed to sign in';
    });
  e.preventDefault();
  return false;
};
