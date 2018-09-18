$(document).ready(function(){




  var config = {
    apiKey: "AIzaSyAhobvhfZXGMNAt-ZCPeV4cVchN1adix9o",
    authDomain: "train-scheduler-f4983.firebaseapp.com",
    databaseURL: "https://train-scheduler-f4983.firebaseio.com",
    projectId: "train-scheduler-f4983",
    storageBucket: "train-scheduler-f4983.appspot.com",
    messagingSenderId: "573809716215"
  };
  firebase.initializeApp(config);

var database = firebase.database();


$("#addTrainBtn").on("click", function (event) {
  event.preventDefault();

  var trainName = $("#trainName").val().trim();
  var destination = $("#destination").val().trim();
  var trainTime = $("#trainTime").val().trim();
  var freq = $("#frequency").val().trim();
  var line = $("#line").val().trim();


  database.ref().push({
    trainName: trainName,
    destination: destination,
    trainTime: trainTime,
    frequency: freq,
    line: line
  });
});


database.ref().on("child_added", function (childSnapshot) {

  var newTrain = childSnapshot.val().trainName;
  var newLocation = childSnapshot.val().destination;
  var newtrainTime = childSnapshot.val().trainTime;
  var newFreq = childSnapshot.val().frequency;
  var newLine = childSnapshot.val().line;


  var startTimeConverted = moment(newtrainTime, "hh:mm").subtract(1, "years");
  var currentTime = moment();
  var diffTime = moment().diff(moment(startTimeConverted), "minutes");
  var tRemainder = diffTime % newFreq;
  var tMinutesTillTrain = newFreq - tRemainder;
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  var catchTrain = moment(nextTrain).format("HH:mm");


  $("#trainTableDisp").append(
    ' <tr><th>' + newTrain +
    ' </th><th>' + newLine +
    ' </th><th>' + newLocation +
    ' </th><th>' + newFreq +
    ' </th><th>' + catchTrain +
    ' </th><th>' + tMinutesTillTrain + ' </th></tr>');


  $("#trainName, #line, #destination, #trainTime, #frequency").val("");
  return false;
},

  function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
});