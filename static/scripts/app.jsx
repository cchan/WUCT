import { Card, CardTitle, CardText, Button } from 'reactstrap';

var main = React.createClass({
  render: function() {
    return (
      <Card block>
        <CardTitle>Special Title Treatment</CardTitle>
        <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
        <Button>Go somewhere</Button>
      </Card>
    );
  }
});
ReactDOM.render(
  React.createElement(main, null),
  document.getElementById('app')
);
