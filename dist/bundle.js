(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var requires = ["CardGroup", "Card", "CardImg", "CardText", "CardBlock", "CardTitle", "CardSubtitle", "Button"];
for (var i = 0; i < requires.length; i++) {
  window[requires[i]] = Reactstrap[requires[i]];
}var DifficultySection = React.createClass({
  displayName: "DifficultySection",

  render: function render() {
    var dClasses = ["easy", "medium", "hard"];
    var dTitles = ["Easy", "Med", "Hard"];
    var currentQuestion = 1; //add to this.state
    return React.createElement(
      "span",
      { className: "difficulty " + dClasses[this.props.difficulty] },
      React.createElement(
        "h3",
        null,
        dTitles[this.props.difficulty],
        " ",
        currentQuestion
      ),
      "hello"
    );
  }
});
var TeamCard = React.createClass({
  displayName: "TeamCard",

  render: function render() {
    var title = "Unknown Team";
    return React.createElement(
      "div",
      null,
      React.createElement(
        Card,
        { inverse: true, style: { backgroundColor: '#696', borderColor: '#696' } },
        React.createElement(
          CardBlock,
          null,
          React.createElement(
            CardTitle,
            null,
            title
          ),
          React.createElement(
            CardSubtitle,
            null,
            "ID: ",
            React.createElement("input", { type: "text", placeholder: "12345" })
          ),
          React.createElement(DifficultySection, { difficulty: "0" }),
          React.createElement(DifficultySection, { difficulty: "1" }),
          React.createElement(DifficultySection, { difficulty: "2" })
        )
      )
    );
  }
});
var TeamCardSet = React.createClass({
  displayName: "TeamCardSet",

  render: function render() {
    console.log('hi');
    var cards = [React.createElement(TeamCard, null), React.createElement(TeamCard, null)];
    return React.createElement(
      CardGroup,
      null,
      cards
    );
  }
});
ReactDOM.render(React.createElement(TeamCardSet, null), document.getElementById('app'));

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHBcXHNjcmlwdHNcXGFwcC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksV0FBVyxDQUFDLFdBQUQsRUFBYyxNQUFkLEVBQXNCLFNBQXRCLEVBQWlDLFVBQWpDLEVBQTZDLFdBQTdDLEVBQ0MsV0FERCxFQUNjLGNBRGQsRUFDOEIsUUFEOUIsQ0FBZjtBQUVBLEtBQUksSUFBSSxJQUFJLENBQVosRUFBZSxJQUFJLFNBQVMsTUFBNUIsRUFBb0MsR0FBcEM7QUFDRSxTQUFPLFNBQVMsQ0FBVCxDQUFQLElBQXNCLFdBQVcsU0FBUyxDQUFULENBQVgsQ0FBdEI7QUFERixDQUdBLElBQUksb0JBQW9CLE1BQU0sV0FBTixDQUFrQjtBQUFBOztBQUN4QyxVQUFRLGtCQUFXO0FBQ2pCLFFBQUksV0FBVyxDQUFDLE1BQUQsRUFBUyxRQUFULEVBQW1CLE1BQW5CLENBQWY7QUFDQSxRQUFJLFVBQVUsQ0FBQyxNQUFELEVBQVMsS0FBVCxFQUFnQixNQUFoQixDQUFkO0FBQ0EsUUFBSSxrQkFBa0IsQ0FBdEIsQ0FIaUIsQ0FHUTtBQUN6QixXQUNFO0FBQUE7QUFBQSxRQUFNLFdBQVcsZ0JBQWMsU0FBUyxLQUFLLEtBQUwsQ0FBVyxVQUFwQixDQUEvQjtBQUNFO0FBQUE7QUFBQTtBQUFLLGdCQUFRLEtBQUssS0FBTCxDQUFXLFVBQW5CLENBQUw7QUFBQTtBQUFzQztBQUF0QyxPQURGO0FBQUE7QUFBQSxLQURGO0FBTUQ7QUFYdUMsQ0FBbEIsQ0FBeEI7QUFhQSxJQUFJLFdBQVcsTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQy9CLFVBQVEsa0JBQVc7QUFDakIsUUFBSSxRQUFRLGNBQVo7QUFDQSxXQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUMsWUFBRDtBQUFBLFVBQU0sYUFBTixFQUFjLE9BQU8sRUFBRSxpQkFBaUIsTUFBbkIsRUFBMkIsYUFBYSxNQUF4QyxFQUFyQjtBQUNFO0FBQUMsbUJBQUQ7QUFBQTtBQUNFO0FBQUMscUJBQUQ7QUFBQTtBQUFZO0FBQVosV0FERjtBQUVFO0FBQUMsd0JBQUQ7QUFBQTtBQUFBO0FBQWtCLDJDQUFPLE1BQUssTUFBWixFQUFtQixhQUFZLE9BQS9CO0FBQWxCLFdBRkY7QUFHRSw4QkFBQyxpQkFBRCxJQUFtQixZQUFXLEdBQTlCLEdBSEY7QUFJRSw4QkFBQyxpQkFBRCxJQUFtQixZQUFXLEdBQTlCLEdBSkY7QUFLRSw4QkFBQyxpQkFBRCxJQUFtQixZQUFXLEdBQTlCO0FBTEY7QUFERjtBQURGLEtBREY7QUFhRDtBQWhCOEIsQ0FBbEIsQ0FBZjtBQWtCQSxJQUFJLGNBQWMsTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQ2xDLFVBQVEsa0JBQVc7QUFDakIsWUFBUSxHQUFSLENBQVksSUFBWjtBQUNBLFFBQUksUUFBUSxDQUFDLG9CQUFDLFFBQUQsT0FBRCxFQUFlLG9CQUFDLFFBQUQsT0FBZixDQUFaO0FBQ0EsV0FDRTtBQUFDLGVBQUQ7QUFBQTtBQUFZO0FBQVosS0FERjtBQUdEO0FBUGlDLENBQWxCLENBQWxCO0FBU0EsU0FBUyxNQUFULENBQ0Usb0JBQUMsV0FBRCxPQURGLEVBRUUsU0FBUyxjQUFULENBQXdCLEtBQXhCLENBRkYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHJlcXVpcmVzID0gW1wiQ2FyZEdyb3VwXCIsIFwiQ2FyZFwiLCBcIkNhcmRJbWdcIiwgXCJDYXJkVGV4dFwiLCBcIkNhcmRCbG9ja1wiLFxyXG4gICAgICAgICAgICAgICAgXCJDYXJkVGl0bGVcIiwgXCJDYXJkU3VidGl0bGVcIiwgXCJCdXR0b25cIl07XHJcbmZvcih2YXIgaSA9IDA7IGkgPCByZXF1aXJlcy5sZW5ndGg7IGkrKylcclxuICB3aW5kb3dbcmVxdWlyZXNbaV1dID0gUmVhY3RzdHJhcFtyZXF1aXJlc1tpXV07XHJcblxyXG52YXIgRGlmZmljdWx0eVNlY3Rpb24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcclxuICAgIHZhciBkQ2xhc3NlcyA9IFtcImVhc3lcIiwgXCJtZWRpdW1cIiwgXCJoYXJkXCJdO1xyXG4gICAgdmFyIGRUaXRsZXMgPSBbXCJFYXN5XCIsIFwiTWVkXCIsIFwiSGFyZFwiXVxyXG4gICAgdmFyIGN1cnJlbnRRdWVzdGlvbiA9IDE7IC8vYWRkIHRvIHRoaXMuc3RhdGVcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT17XCJkaWZmaWN1bHR5IFwiK2RDbGFzc2VzW3RoaXMucHJvcHMuZGlmZmljdWx0eV19PlxyXG4gICAgICAgIDxoMz57ZFRpdGxlc1t0aGlzLnByb3BzLmRpZmZpY3VsdHldfSB7Y3VycmVudFF1ZXN0aW9ufTwvaDM+XHJcbiAgICAgICAgaGVsbG9cclxuICAgICAgPC9zcGFuPlxyXG4gICAgKTtcclxuICB9XHJcbn0pO1xyXG52YXIgVGVhbUNhcmQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcclxuICAgIHZhciB0aXRsZSA9IFwiVW5rbm93biBUZWFtXCI7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2PlxyXG4gICAgICAgIDxDYXJkIGludmVyc2Ugc3R5bGU9e3sgYmFja2dyb3VuZENvbG9yOiAnIzY5NicsIGJvcmRlckNvbG9yOiAnIzY5NicgfX0+XHJcbiAgICAgICAgICA8Q2FyZEJsb2NrPlxyXG4gICAgICAgICAgICA8Q2FyZFRpdGxlPnt0aXRsZX08L0NhcmRUaXRsZT5cclxuICAgICAgICAgICAgPENhcmRTdWJ0aXRsZT5JRDogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCIxMjM0NVwiLz48L0NhcmRTdWJ0aXRsZT5cclxuICAgICAgICAgICAgPERpZmZpY3VsdHlTZWN0aW9uIGRpZmZpY3VsdHk9XCIwXCIvPlxyXG4gICAgICAgICAgICA8RGlmZmljdWx0eVNlY3Rpb24gZGlmZmljdWx0eT1cIjFcIi8+XHJcbiAgICAgICAgICAgIDxEaWZmaWN1bHR5U2VjdGlvbiBkaWZmaWN1bHR5PVwiMlwiLz5cclxuICAgICAgICAgIDwvQ2FyZEJsb2NrPlxyXG4gICAgICAgIDwvQ2FyZD5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxufSk7XHJcbnZhciBUZWFtQ2FyZFNldCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc29sZS5sb2coJ2hpJyk7XHJcbiAgICB2YXIgY2FyZHMgPSBbPFRlYW1DYXJkIC8+LCA8VGVhbUNhcmQgLz5dO1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPENhcmRHcm91cD57Y2FyZHN9PC9DYXJkR3JvdXA+XHJcbiAgICApO1xyXG4gIH1cclxufSk7XHJcblJlYWN0RE9NLnJlbmRlcihcclxuICA8VGVhbUNhcmRTZXQgLz4sXHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpXHJcbik7Il19
