// note the the number of difficulty classes is fixed at 3, for now
window.dClass = ["easy", "medium", "hard"];
window.dTitle = ["Easy", "Med", "Hard"];
window.numPackets = [20, 14, 7];
window.scoreValues = [1, 3, 7];

if(window.location.hostname == 'wuct.clive.io')
  window.dbName = new URLSearchParams(window.location.search).get("db") || 'wuct2021';
else if (window.location.hostname == 'localhost' && window.location.port == 8849)
  window.dbName = new URLSearchParams(window.location.search).get("db") || 'wuct2021';
else
  throw new Error();
console.log(window.dbName);

window.getScore = function(scores){
  var totalScore = 0;
  for(var i = 0; i < window.dClass.length; i++)
    totalScore += (scores[window.dClass[i]] || scores[i] || []).map(function(a){
      if(a == -1)
        return 0;
      if(a == 3)
        a++;
      return a*window.scoreValues[i];
    }).reduce(function(a,b){return a+b;});
  return totalScore;
}
window.getProgress = function(scores){
  var progress = [];
  for(var i = 0; i < window.dClass.length; i++){
    progress[i] = scores[window.dClass[i]].findIndex(a => a == -1); // Number they finished
    if(progress[i] == -1)
      progress[i] = scores[window.dClass[i]].length;
    progress[i] /= numPackets[i];
  }
  return progress;
}

// Initialize Firebase
var fbconfig = {
  apiKey: "AIzaSyC4siYV0A1Nq4POMUfvdRKyP0-xzUUvMVo",
  authDomain: "wuct-1f4ca.firebaseapp.com",
  databaseURL: "https://wuct-1f4ca.firebaseio.com",
  storageBucket: "wuct-1f4ca.appspot.com",
  messagingSenderId: "833633709327"
};
firebase.initializeApp(fbconfig);
window.fb = firebase.database().ref(window.dbName);

//Don't use this during leap seconds btw.
function setTimer(el, cb){
  var timerlength, currentTarget = 0;
  fb.child('timer').on('value', function(snapshot){
    if(snapshot.val()){
      currentTarget = snapshot.val().target;
      timerlength = snapshot.val().timerlength;
    }
  });
  return setInterval(function(){
    var total = Math.floor((currentTarget - (new Date()).getTime())/1000);
    if(cb)
      cb(total);
    if(total > timerlength * 60)
      total = timerlength * 60;
    if(total < 0)
      total = 0;
    var hours = "" + Math.floor(total/3600);
    var minutes = "" + Math.floor(total/60) % 60;
    var seconds = "" + total % 60;
    el.innerHTML = ((hours<10)?"0":"") + hours + ":" + ((minutes<10)?"0":"") + minutes + ":" + ((seconds<10)?"0":"") + seconds;
  }, 500);
}


function alertSuccess(text, persistent) {
    $("#success-alert").hide();
    $("#failure-alert").hide();
    $("#success-alert").text(text).fadeTo(2000, 500);
    if(!persistent)
      $("#success-alert").slideUp(500, function(){
         $("#success-alert").slideUp(3000);
      });
}
function alertFailure(text, persistent) {
    $("#success-alert").hide();
    $("#failure-alert").hide();
    $("#failure-alert").text(text).fadeTo(2000, 500);
    if(!persistent)
      $("#failure-alert").slideUp(500, function(){
         $("#failure-alert").slideUp(3000);
      });
}
$(function(){
  $('body').append(`<div class="alerts" style="position: fixed; top: 4em; left: 1em; right: 1em; height: 4em; pointer-events: none;">
    <div class="alert alert-success" id="success-alert" style="position:absolute; width: 15em; right: 1em; text-align: center;"></div>
    <div class="alert alert-danger" id="failure-alert" style="position:absolute; width: 15em; right: 1em; text-align: center;"></div>
  </div>`);
  $("#success-alert").hide();
  $("#failure-alert").hide();
});

var connectedRef = firebase.database().ref(".info/connected");
connectedRef.on("value", function(snap) {
  if (snap.val() === true) {
    alertSuccess("connected");
  } else {
    alertFailure("not connected", true);
  }
});


(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-62605323-4', 'auto');
ga('send', 'pageview');

