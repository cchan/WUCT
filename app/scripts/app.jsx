import React from 'react'
import ReactDOM from 'react-dom'
import {CardDeck, Card, CardImg, CardText, CardBlock, CardTitle, CardSubtitle, Button} from 'reactstrap'

class DifficultySection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuestion: 0
    };
  }
  render() {
    //fb.child(this.state.id + '/' + this.props.difficulty);
    const dClass = ["easy", "medium", "hard"];
    const dTitle = ["Easy", "Med", "Hard"];
    const numQuestions = [3, 3, 3]; //if currentQuestion hits this then display end screen
    return (
      <span className={"difficulty "+dClass[this.props.difficulty]}>
        <h3>{dTitle[this.props.difficulty]} {this.state.currentQuestion+1}</h3>
        <input type="text" placeholder="score" />
        <div><Button className="back">&lt;</Button><Button className="next">&gt;</Button></div>
      </span>
    );
  }
}

class TeamCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamName: "Unknown Team"
    };
  }
  render() {
    return (
      <div>
        <Card inverse style={{ backgroundColor: '#696', borderColor: '#696' }}>
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
    var cards = [<TeamCard />, <TeamCard />,<TeamCard />, <TeamCard />,<TeamCard />, <TeamCard />,<TeamCard />, <TeamCard />];
    return (
      <CardDeck>{cards}</CardDeck>
    );
  }
}

ReactDOM.render(
  <TeamCardSet />,
  document.getElementById('app')
);
