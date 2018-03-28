window.dClass = ["easy", "medium", "hard"];
window.dTitle = ["Easy", "Med", "Hard"];
window.numPackets = [20, 15, 9];
window.scoreValues = [1, 3, 7];
window.dbName = 'wuct2018';

window.getScore = function(scores){
  var totalScore = 0;
  for(var i = 0; i < window.dClass.length; i++)
    totalScore += scores[window.dClass[i]].map(function(a){if(a==3)a++;return a*window.scoreValues[i];}).reduce(function(a,b){return a+b;});
  return totalScore;
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
