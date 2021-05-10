var teams = [[]]; // Set this up with the data exported from phpMyAdmin, as an array of rows, which are themselves arrays of cells.

var scoresAll = {};
var teamsAll = {};
var answersAll = {};
for(var i = 0; i < teams.length; i++) {
    var scores = {"hard":[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]};
    scoresAll["team"+teams[i][0]] = scores;
    teamsAll[teams[i][0]] = {"name": teams[i][1]};
    answersAll[teams[i][0]] = {[teams[i][3]]: {"created": ""+new Date()}};
}
fb.child('teams').set(teamsAll);
fb.child('scores').set(scoresAll);
fb.child('answers').set(answersAll);
