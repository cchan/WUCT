var requires = ["CardGroup", "Card", "CardImg", "CardText", "CardBlock",
                "CardTitle", "CardSubtitle", "Button"];
for(var i = 0; i < requires.length; i++)
  window[requires[i]] = Reactstrap[requires[i]];

var DifficultySection = React.createClass({
  render: function() {
    var dClasses = ["easy", "medium", "hard"];
    var dTitles = ["Easy", "Med", "Hard"]
    var currentQuestion = 1; //add to this.state
    return (
      <span className={"difficulty "+dClasses[this.props.difficulty]}>
        <h3>{dTitles[this.props.difficulty]} {currentQuestion}</h3>
        hello
      </span>
    );
  }
});
var TeamCard = React.createClass({
  render: function() {
    var title = "Unknown Team";
    return (
      <div>
        <Card inverse style={{ backgroundColor: '#696', borderColor: '#696' }}>
          <CardBlock>
            <CardTitle>{title}</CardTitle>
            <CardSubtitle>ID: <input type="text" placeholder="12345"/></CardSubtitle>
            <DifficultySection difficulty="0"/>
            <DifficultySection difficulty="1"/>
            <DifficultySection difficulty="2"/>
          </CardBlock>
        </Card>
      </div>
    );
  }
});
var TeamCardSet = React.createClass({
  render: function() {
    console.log('hi');
    var cards = [<TeamCard />, <TeamCard />];
    return (
      <CardGroup>{cards}</CardGroup>
    );
  }
});
ReactDOM.render(
  <TeamCardSet />,
  document.getElementById('app')
);