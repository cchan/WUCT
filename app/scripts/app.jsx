import React from 'react'
import ReactDOM from 'react-dom'
import {CardDeck, Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button, ButtonGroup} from 'reactstrap'
import Autocomplete from "react-autocomplete";

const dClass = window.dClass;
const dTitle = window.dTitle;
const numPackets = window.numPackets; //if currentQuestion hits this then display end screen - actually very awkward to change (firebase persistence), so don't.

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
          <Button onClick={() => this.onRadioBtnClick(-1)} active={this.props.selected === -1} disabled={this.props.xdisabled}>x</Button>
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
    
    var initialScores = [];
    for(var i = 0; i < numPackets[props.difficulty]; i++)
      initialScores.push(-1);
    this.state = {
      currentQuestion: 0,
      scores: initialScores
    };
    this.ref = fb.child('scores')
      .child('team'+this.props.teamId)
      .child(window.dClass[this.props.difficulty]);
  }
  componentDidMount(){
    this.ref.once('value', function(snapshot){
      if(!snapshot.val())
        this.ref.set(this.state.scores);
      else {
        var currentQuestion = snapshot.val().indexOf(-1);
        if(currentQuestion == -1) currentQuestion = this.state.scores.length - 1;
        this.setState({scores: snapshot.val(), currentQuestion: currentQuestion});
      }
    }.bind(this));
    this.ref.on('value', function(snapshot){
      if(!snapshot.val())
        this.ref.set(this.state.scores);
      else
        this.setState({scores: snapshot.val()});
    }.bind(this));
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
    return (
      <span className={"difficulty "+dClass[this.props.difficulty]}>
        <Button className="back" onClick={this.back.bind(this)} disabled={this.state.currentQuestion <= 0}>&lt;</Button>
        <Button className="next" onClick={this.next.bind(this)} disabled={this.state.currentQuestion >= numPackets[this.props.difficulty] - 1 || this.state.scores[this.state.currentQuestion] == -1}>&gt;</Button>
        <h3>{dTitle[this.props.difficulty]} {this.state.currentQuestion+1}</h3>
        <RadioBtnGroup selected={this.state.scores[this.state.currentQuestion]} scoreHandler={this.scoreHandler.bind(this)} xdisabled={this.state.currentQuestion < numPackets[this.props.difficulty] - 1 && this.state.scores[this.state.currentQuestion + 1] != -1} />
      </span>
    );
  }
}

class TeamCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalScore: 0,
      teamName: null,
      autocompleteTeams: []
    };
  }
  componentWillMount(){
    if(this.props.teamId)
      this.setTeamId({target:{value:this.props.teamId}});
    fb.child('teams').on('value', function(snapshot){
      if(snapshot.val())
        this.setState({'autocompleteTeams': Object.keys(snapshot.val()).map(k=>{return{id:k,name:snapshot.val()[k].name}})});
    }.bind(this));
  }
  setTeamId(event){
    if(this.props.teamId){
      fb.child('teams').child(this.props.teamId).off('value');
      fb.child('scores').child('team'+this.props.teamId).off('value');
    }
    
    var teamId;
    if(event.target) teamId = event.target.value;
    else teamId = event;
    this.setState({teamName: null});
    this.props.updateId(teamId);
    if(teamId){
      fb.child('teams').child(teamId).on('value', function(snapshot){
        if(snapshot.val())
          this.setState({teamName: snapshot.val().name});
      }.bind(this));
      fb.child('scores').child('team'+this.props.teamId).on('value', function(snapshot){
        if(snapshot.val())
          this.setState({totalScore: getScore(snapshot.val())});
      }.bind(this));
    }
  }
  componentWillUnmount(){
    if(this.props.teamId)
      fb.child('teams').child(this.props.teamId).off('value');
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
          <DifficultySection difficulty="0" teamId={this.props.teamId}/>
          <DifficultySection difficulty="1" teamId={this.props.teamId}/>
          <DifficultySection difficulty="2" teamId={this.props.teamId}/>
        </div>;
    else
      difficultySections = <p>Invalid team ID.</p>;
    var teamName = this.state.teamName || "Unknown Team";
    return (
      <Card inverse style={{ backgroundColor: this.props.color, borderColor: this.props.color }}>
        <CardBody>
          <a href="#" onClick={this.props.remove} className="xBtn">&#x2715;</a>
          <select value={this.props.color} style={{color: "white", backgroundColor: this.props.color}} onChange={this.props.changeColor}>
            <option style={{backgroundColor: "grey"}}>grey</option>
            {Object.keys(spectrum).reduce(function(previous, current) {
                previous.push(<option key={spectrum[current]} value={spectrum[current]} style={{backgroundColor: spectrum[current]}}>{current}</option>);
                return previous;
            }, [])}
          </select>
          <CardTitle>{teamName}</CardTitle>
          <CardSubtitle>ID: 
            <Autocomplete
              getItemValue={(item) => item.id}
              items={this.state.autocompleteTeams}
              renderItem={(item, isHighlighted) =>
                <div style={{ background: isHighlighted ? 'lightgray' : 'white', color : 'black' }}>
                  {item.id} {item.name}
                </div>
              }
              value={this.props.teamId}
              onChange={this.setTeamId.bind(this)}
              onSelect={this.setTeamId.bind(this)}
              shouldItemRender={(item, value) => (item.id + ' ' + item.name).toLowerCase().includes(value.toLowerCase())}
            />
            <span style={{'float': 'right'}}>Score: <b>{this.state.totalScore}</b></span>
          </CardSubtitle>
          
          {difficultySections}
        </CardBody>
      </Card>
    );
  }
}

class TeamCardSet extends React.Component {
  constructor(props) {
    super(props);
    
    if(!Cookies.get('state'))
      Cookies.set('state', JSON.stringify({cards: {}, colors: {}}));
    this.state = JSON.parse(Cookies.get('state'));
    if(!this.state.cards) this.state.cards = {};
    if(!this.state.colors) this.state.colors = {};
    window.updateUserStatus({tracking:Object.values(this.state.cards)})
  }
  setStateSave(newstate){
    this.setState(newstate, function(){
      Cookies.set('state', JSON.stringify(this.state));
      window.updateUserStatus({tracking:Object.values(this.state.cards)})
    });
  }
  addCard(id){
    var index;
    do{index = 'card' + Math.floor(Math.random() * 100000000);}
    while(this.state.cards[index] !== undefined);
    
    this.state.cards[index] = typeof id == "string" ? id : "";
    this.state.colors[index] = "gray";
    this.setStateSave({cards: this.state.cards});
  }
  removeCard(i){
    this.state.cards[i] = undefined;
    this.setStateSave({cards: this.state.cards});
  }
  updateId(i, newid){
    this.state.cards[i] = newid || "";
    this.setStateSave({cards: this.state.cards});
  }
  changeCardColor(i, event){
    this.state.colors[i] = event.target.value;
    this.setStateSave({colors: this.state.colors});
  }
  render() {
    if(true||window.token){
      var cards = [];
      for(var prop in this.state.cards){
        // console.log(this.state.cards);
        if(this.state.cards.hasOwnProperty(prop) && this.state.cards[prop] !== undefined)
          cards.push(<TeamCard token={window.token} remove={this.removeCard.bind(this, prop)} updateId={this.updateId.bind(this, prop)} teamId={this.state.cards[prop]} color={this.state.colors[prop]} changeColor={this.changeCardColor.bind(this, prop)} key={prop} />);
      }
      if(cards.length == 0)
        cards = <div style={{width: "50%"}}>
                  Press the + button above to start tracking a team! You can:
                  <ul>
                    <li>Enter a team ID to begin tracking a team's score live</li>
                    <li>Set colors to help quickly visually identify teams</li>
                    <li>Enter scores by clicking the score (0, 1, 2, or 3). You can cancel a score by clicking 'x', but you can only cancel the last non-x score.</li>
                    <li>Advance to the next question (&gt;) or go back to a previous question (&lt;). The packet difficulty and number shown should always be the one that the team has or can take next.</li>
                    <li>Everything updates instantly on the scoreboard.</li>
                    <li><i>Mouse over the + button to display these instructions again.</i></li>
                  </ul>
                </div>;
      return (
        <div>
          <header>
            <h1><img src="wuct.jpg" alt="WUCT" />Breaking Bonds Round: Scoring</h1>
            <a href="#" className="add" onClick={this.addCard.bind(this)} title="Press the + button above to start tracking a team! You can:&#013;&bull; Enter a team ID to begin tracking a team's score live&#013;&bull; Set colors to help quickly visually identify teams&#013;&bull; Enter scores by clicking the score (0, 1, 2, or 3). You can cancel a score by clicking 'x', but you can only cancel the last non-x score.&#013;&bull; Advance to the next question (>) or go back to a previous question (<). The packet difficulty and number shown should always be the one that the team has or can take next.&#013;&bull; Everything updates instantly on the scoreboard."><i className="fas fa-plus" aria-hidden="true"></i></a>
            <div id="timer" style={{display: "inline-block", margin: "0 1em", fontSize: "1.5em"}}></div><label style={{fontSize: "1.5em"}}>Identifier: <input type="text" id="identifier" placeholder="Scoring Station 3" onChange={function(e){window.updateUserStatus({identifier:e.target.value})}} /></label>
            <a href="#" className="signout" onClick={function(){window.signOut()}}><i className="fas fa-sign-out-alt" aria-hidden="true" title="Log out"></i></a>
          </header>
          <div>{cards}</div>
        </div>
      );
    }else{
      return <p>Not authenticated</p>;
    }
  }
  componentDidMount() {
    window.setTimer(document.getElementById("timer"), function(total){
      if(total <= 0)
        document.getElementById("timer").style.color = "red";
      else
        document.getElementById("timer").style.color = "white";
    });
  }
}

window.updateUserStatus = function(obj){
  // obj.tracking is a list
  // obj.identifier is a string
  if(obj.tracking) fb.child("users/" + Cookies.get('userID')).update({tracking: obj.tracking});
  if(obj.identifier) fb.child("users/" + Cookies.get('userID')).update({identifier: obj.identifier});
};

window.render = function(){
  ReactDOM.render(
    <TeamCardSet />,
    document.getElementById('app')
  );
  if(!Cookies.get('userID'))
    Cookies.set('userID', uuidv4());
  console.log(Cookies.get('userID'));
  
  var ref = fb.child("users/" + Cookies.get('userID'));
  ref.onDisconnect().update({
    tracking: null
  });
};
