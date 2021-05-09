import React from 'react'
import ReactDOM from 'react-dom'
import { Card, CardBody, CardTitle, CardSubtitle, Button, ButtonGroup } from 'reactstrap'
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
    
    var initialScores = new Array(numPackets[props.difficulty]).fill(-1);
    var initialSubmitted = new Array(numPackets[props.difficulty]).fill(false);
    this.state = {
      currentQuestion: 0,
      scores: initialScores,
      submitted: initialSubmitted,
    };
    this.ref = fb.child('scores')
      .child('team'+this.props.teamId)
      .child(window.dClass[this.props.difficulty]);
    this.ref2 = fb.child("answers").child(this.props.teamId).child(this.props.passcode).child(dClass[this.props.difficulty]);
  }
  componentDidMount(){
    this.ref.once('value', function(snapshot){
      if(!snapshot.val()) // Can this happen in any situation other than there being no value?
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

    this.ref2.on('value', function(snapshot){
      var submitted = new Array(numPackets[this.props.difficulty]).fill(false);
      var answers = snapshot.val();
      if(answers)
        for(var i = 0; i < answers.length; i++)
          if(answers[i].submit)
            submitted[i] = true;
      this.setState({submitted: submitted});
    }.bind(this));
  }
  componentWillUnmount(){
    this.ref.off('value');
    this.ref2.off('value');
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
        <h3><button disabled={!this.state.submitted[this.state.currentQuestion] || this.state.currentQuestion == numPackets[this.props.difficulty] - 1} onclick={/**/e=>window.renderSide(e, this.props.teamId, this.props.teamName, this.props.passcode, this.props.difficulty, this.state.currentQuestion, this.next.bind(this))}>{dTitle[this.props.difficulty]} {this.state.currentQuestion+1}</button></h3>
        {/* <RadioBtnGroup selected={this.state.scores[this.state.currentQuestion]} scoreHandler={this.scoreHandler.bind(this)} xdisabled={this.state.currentQuestion < numPackets[this.props.difficulty] - 1 && this.state.scores[this.state.currentQuestion + 1] != -1} /> */}
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
      autocompleteTeams: [],
      passcode: null,
    };
  }
  componentWillMount(){
    if(this.props.teamId)
      this.setTeamId({target:{value:this.props.teamId}});
    fb.child('teams').on('value', function(snapshot){
      if(snapshot.val()){
        this.setState({'autocompleteTeams': Object.keys(snapshot.val()).map(k=>{return{id:k,name:snapshot.val()[k].name}})});
        this.setTeamId(this.props.teamId);
      }
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
    this.setState({teamName: null, passcode: null});
    this.props.updateId(teamId);
    if(teamId && this.state.autocompleteTeams.some(t => t.id == teamId)){
      fb.child("answers").child(teamId).once("value", function(snap) { // TODO: "once" hmmm
        if(snap.val())
          this.setState({ passcode: Object.keys(snap.val())[0] });
      }.bind(this));
      fb.child('teams').child(teamId).child('name').on('value', function(snapshot){
        if(snapshot.val())
          this.setState({teamName: snapshot.val()});
      }.bind(this));
      fb.child('scores').child('team'+this.props.teamId).on('value', function(snapshot){
        if(snapshot.val())
          this.setState({totalScore: getScore(snapshot.val())});
      }.bind(this));
    }
  }
  componentWillUnmount(){
    if(this.props.teamId)
      fb.child('teams').child(this.props.teamId).child('name').off('value');
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
    if(this.state.teamName != null && this.state.passcode != null)
      difficultySections = 
        <div>
          {/* <DifficultySection difficulty="0" teamId={this.props.teamId} teamName={this.state.teamName} passcode={this.state.passcode}/>
          <DifficultySection difficulty="1" teamId={this.props.teamId} teamName={this.state.teamName} passcode={this.state.passcode}/> */}
          <DifficultySection difficulty="2" teamId={this.props.teamId} teamName={this.state.teamName} passcode={this.state.passcode}/>
        </div>;
    else
      difficultySections = <p>Invalid team ID.</p>;
    var teamName = this.state.teamName || "Unknown Team";
    return (
      <Card inverse style={{ backgroundColor: this.props.color, borderColor: this.props.color }}>
        <CardBody>
          <a href="#" onClick={this.props.remove} className="xBtn">&#x2715;</a>
          <select value={this.props.color} style={{color: "white", backgroundColor: this.props.color}} onChange={this.props.changeColor}>
            <option key={"grey"} value={"grey"} style={{backgroundColor: "grey"}}>grey</option>
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
    this.state = Cookies.getJSON('state');
    if(!this.state.cards) this.state.cards = {};
    if(!this.state.colors) this.state.colors = {};
    if(!this.state.identifier) this.state.identifier = "";
    Cookies.set('state', JSON.stringify(this.state));
    window.updateUserStatus();
  }
  setStateSave(newstate){
    this.setState(newstate, function(){
      Cookies.set('state', JSON.stringify(this.state));
      window.updateUserStatus();
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
  updateIdentifier(e){
    this.setStateSave({identifier: e.target.value});
    window.updateUserStatus();
    return true;
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
        cards = <div style={{width: "50%", margin: "2em"}}>
                  Press the + below to start tracking a team! You can:
                  <ul>
                    <li>Enter a team ID to begin tracking a team's score live.</li>
                    <li>Set colors to help quickly visually identify teams.</li>
                    <li>Examine and score a team's answers by clicking the difficulty-specific button when it's available.</li>
                    <li>Manually enter scores by clicking the score (0, 1, 2, or 3). You can cancel a score by clicking 'x', but you can only cancel the last non-x score.</li>
                    <li>Advance to the next question (&gt;) or go back to a previous question (&lt;). The last packet difficulty and number shown should always be the one that the team has or can take next.</li>
                    <li>Everything updates instantly on the scoreboard.</li>
                    <li><i>Mouse over the + button to display these instructions again.</i></li>
                  </ul>
                  Don't open multiple scoring windows in the same browser! It will get confused.
                </div>;
      return (
      <div>
          <header>
            <h1><img src="lmtlogowhite.svg" alt="LMT" />Guts Round: Scoring</h1>
            <div id="timer" style={{display: "inline-block", margin: "0 1em", fontSize: "1.5em"}}></div><label style={{verticalAlign: "0.2em"}}>Identifier: <input type="text" id="identifier" placeholder="Unidentified Scoring Station" required onChange={this.updateIdentifier.bind(this)} value={this.state.identifier} /></label>
            <div style={{float: "right"}}>
              <a href="#" className="help" onClick={()=>window.alert("Press the + button below to start tracking a team! You can:\n- Enter a team ID to begin tracking a team's score live.\n- Set colors to help quickly visually identify teams.\n- Examine and score a team's answers by clicking the difficulty-specific button when it's available.\n- Manually enter scores by clicking the score (0, 1, 2, or 3). You can cancel a score by clicking 'x', but you can only cancel the last non-x score.\n- Advance to the next question (>) or go back to a previous question (<). The last packet difficulty and number shown should always be the one that the team has or can take next.\n- Everything updates instantly on the scoreboard.\nDon't open multiple scoring windows in the same browser! It will get confused.")}>?</a>
              <a href="#" className="signout" onClick={function(){window.signOut()}}>LOG OUT [admin]</a>
            </div>
          </header>
          <div id="notside">
            <div>{cards}</div>
            <button id="plusbtn" onClick={this.addCard.bind(this)}>+</button>
          </div>
          <div id="side" style="display: none">
            <div class="pdfansbox_left">
              <p><iframe src="" id="pdf"></iframe></p>
            </div>
            <div class="pdfansbox_right">
              <h2 id="pdfansbox_title"></h2>
              <div><span>1</span><textarea id="q1" disabled></textarea><input id="q1c" type="checkbox" /></div>
              <div><span>2</span><textarea id="q2" disabled></textarea><input id="q2c" type="checkbox" /></div>
              <div><span>3</span><textarea id="q3" disabled></textarea><input id="q3c" type="checkbox" /></div>
              <button id="scoresubmit">Submit</button><button id="scorecancel">Back</button>
            </div>
          </div>
        </div>
      );
    }else{
      return <p>Not authenticated</p>;
    }
  }
  componentDidMount() {
    this.timer = window.setTimer(document.getElementById("timer"), function(total){
      if(total <= 0)
        document.getElementById("timer").style.color = "red";
      else
        document.getElementById("timer").style.color = "white";
    });
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
}

window.renderSide = function(e, id, teamname, pc, d, n, successCallback) {
  document.getElementById("notside").style.display = "block";
  document.getElementById("side").style.display = "none";
  document.getElementById("pdf").src = "";
  // alertSuccess("hi " + id + " " + d + " " + n);
  fb.child("answers").off();
  document.getElementById("scoresubmit").onclick = null;
  fb.child("answers").child(id).child(pc).child(window.dClass[d]).child(n).on("value", function(snap) {
    var ans = snap.val();
    if(ans && ans["submit"]) {
      fb.child("scores").child("team"+id).child(window.dClass[d]).child(n).once("value", function(snap) {
        var currscore = snap.val();
        if(currscore < 0) currscore = "";
        console.log(currscore)
        if(parseInt(currscore) == currscore && currscore >= 0 && currscore < 8) {
          document.getElementById("q1c").checked = ((currscore & 1) > 0);
          document.getElementById("q2c").checked = ((currscore & 2) > 0);
          document.getElementById("q3c").checked = ((currscore & 4) > 0);
        } else {
          document.getElementById("q1c").checked = false;
          document.getElementById("q2c").checked = false;
          document.getElementById("q3c").checked = false;
        }
        
        document.getElementById("notside").style.display = "none";
        document.getElementById("side").style.display = "block";
        document.getElementById("pdf").src = window.ak[dClass[d]][n];
        document.getElementById("pdfansbox_title").innerText = teamname + ": " + dTitle[d] + " " + (n+1)
        document.getElementById("q1").value = ans["q1"] || "";
        document.getElementById("q2").value = ans["q2"] || "";
        document.getElementById("q3").value = ans["q3"] || "";
        document.getElementById("scorecancel").onclick = function(e) {
          document.getElementById("notside").style.display = "block";
          document.getElementById("side").style.display = "none";
          document.getElementById("pdf").src = "";
          fb.child("answers").off();
          document.getElementById("scoresubmit").onclick = null;
        }
        document.getElementById("scoresubmit").onclick = function(e) {
          var score = (document.getElementById("q1c").checked ? 1 : 0)
                    + (document.getElementById("q2c").checked ? 2 : 0)
                    + (document.getElementById("q3c").checked ? 4 : 0);
          // if(!(score == 0 || score == 1 || score == 2 || score == 3))
          //   alertFailure("Invalid score - must be 0, 1, 2, or 3");
          // else {
            fb.child("scores").child("team"+id).child(window.dClass[d]).child(n).set(score);
            if(successCallback) successCallback();
            document.getElementById("notside").style.display = "block";
            document.getElementById("side").style.display = "none";
            document.getElementById("pdf").src = "";
            fb.child("answers").off();
            document.getElementById("scoresubmit").onclick = null;
          // }
          e.preventDefault();
          return false;
        }
      });
    }
  });
  e.preventDefault();
  return false;
}

window.updateUserStatus = function(){
  var state = Cookies.getJSON('state');
  fb.child("users/" + Cookies.get('userID')).update({
    tracking: JSON.stringify(Object.values(state.cards).filter(x=>!!x)),
    identifier: state.identifier
  });
};

window.render = function(){
  if(!Cookies.get('userID'))
    Cookies.set('userID', uuid.v4());

  document.getElementById('app').innerHTML = '';
  ReactDOM.render(
    <TeamCardSet />,
    document.getElementById('app')
  );

  fb.child("ak").on("value", function(snap) {
    if(snap.val())
      window.ak = snap.val()
  })

  var connectedRef = firebase.database().ref(".info/connected");
  connectedRef.on("value", function(snap) {
    if (snap.val() === true) {
      fb.child("users/" + Cookies.get('userID')).onDisconnect().set(null);
      fb.child("users/" + Cookies.get('userID')).on('value', function(snapshot){
        if(!snapshot.val())
          window.signOut();
      });
      window.updateUserStatus();
    }
  });
};
