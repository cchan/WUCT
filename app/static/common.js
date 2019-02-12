// note the the number of difficulty classes is fixed at 3, for now
window.dClass = ["easy", "medium", "hard"];
window.dTitle = ["Easy", "Med", "Hard"];
window.numPackets = [20, 15, 9];
window.scoreValues = [1, 3, 7];
window.dbName = 'wuct2019';

if(window.location.hostname != 'wuct.clive.io' && (window.location.hostname != 'localhost' || window.location.port != 8849)) throw new Error();

window.getScore = function(scores){
  var totalScore = 0;
  for(var i = 0; i < window.dClass.length; i++)
    totalScore += scores[window.dClass[i]].map(function(a){
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
  setInterval(function(){
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
  }, 200);
}


(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-62605323-4', 'auto');
ga('send', 'pageview');

