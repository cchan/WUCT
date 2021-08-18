// A one-off script to regrade some questions.
fb.child("answers").once("value", function(snapshot){
  var teamscores = snapshot.val();
  for(var teamid in teamscores){
    var answers = teamscores[teamid][Object.keys(teamscores[teamid])[0]].hard;
    function setans(fbc, offset, correct) {
        fbc.once("value", function(snapshot){
            var val = snapshot.val();
            if(val >= 0 && val <= 7) {
                // console.log(val, offset, correct)
                if(correct) val |= 1 << offset;
                else val &= ~(1 << offset);
                // console.log(val)
                fbc.set(val)
            } else{console.log("??", val)}
        });
    }
    // Everyone who answered #7 gets it.
    if(answers && answers[2] && answers[2].q1)
        setans(fb.child("scores").child("team"+teamid).child("hard").child(2), 0, true);
    // Everyone who answered #14 gets it.
    if(answers && answers[4] && answers[4].q2)
        setans(fb.child("scores").child("team"+teamid).child("hard").child(4), 1, true);
    // Everyone who answered #21 gets it.
    if(answers && answers[6] && answers[6].q2)
        setans(fb.child("scores").child("team"+teamid).child("hard").child(6), 1, true);
    // The answer to #15 is 51.
    if(answers && answers[4] && answers[4].q3)
        setans(fb.child("scores").child("team"+teamid).child("hard").child(4), 2, parseInt(answers[4].q3) == 51);
  }
})