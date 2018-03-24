var calendarID = "shells1072@gmail.com";
var serviceAccountID =
  "main-892@shellssgi-event-manager.iam.gserviceaccount.com";
// var calendarID = '853q9bltjib08m2e14lbjeacpk%40group.calendar.google.com';

//---------------------------------------------------------------------------------------
// AUTHENTICATION SECTION
// This entire section deals with Google Service Account authentication to obtain a token
// Tokens expire every hour and will be regenerated
// Most of this was found with help online, and then used KJUR api
//---------------------------------------------------------------------------------------

// load the corresponding file that contains the key.
loadKey = new XMLHttpRequest();
var jsonFile;

loadKey.open("GET", "shellssgi-event-manager-75ab4b3c9b57.json", false);
loadKey.onreadystatechange = function() {
  jsonFile = JSON.parse(loadKey.response);
};
loadKey.send(null);

var pHeader = { alg: "RS256", typ: "JWT" };
var sHeader = JSON.stringify(pHeader);

var pClaim = {};
pClaim.aud = "https://www.googleapis.com/oauth2/v4/token";
pClaim.scope = "https://www.googleapis.com/auth/calendar";
pClaim.iss = serviceAccountID;
pClaim.exp = KJUR.jws.IntDate.get("now + 1hour");
pClaim.iat = KJUR.jws.IntDate.get("now");

var sClaim = JSON.stringify(pClaim);

var key = jsonFile.private_key;

var sJWS = KJUR.jws.JWS.sign(null, sHeader, sClaim, key);

var XHR = new XMLHttpRequest();
var urlEncodedData = "";
var urlEncodedDataPairs = [];

urlEncodedDataPairs.push(
  encodeURIComponent("grant_type") +
    "=" +
    encodeURIComponent("urn:ietf:params:oauth:grant-type:jwt-bearer")
);
urlEncodedDataPairs.push(
  encodeURIComponent("assertion") + "=" + encodeURIComponent(sJWS)
);
urlEncodedData = urlEncodedDataPairs.join("&").replace(/%20/g, "+");

var token = "";

// We define what will happen if the data are successfully sent
XHR.addEventListener("load", function(event) {
  var response = JSON.parse(XHR.responseText);
  token = response["access_token"];
  // console.log(token);
});

// We define what will happen in case of error
XHR.addEventListener("error", function(event) {
  console.log("Oops! Something went wrong.");
});

XHR.open("POST", "https://www.googleapis.com/oauth2/v4/token", false);
XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
XHR.send(urlEncodedData);

// console.log(XHR.response);

//---------------------------------------------------------------------------------------
// END OF AUTHENTICATION SECTION
//---------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------
// returns an object formatted to send to Google Calendar API
//---------------------------------------------------------------------------------------
function formatEvent(fname, lname, email, phone, start, end) {
  return {
    end: {
      dateTime: end
    },
    start: {
      dateTime: start
    },
    summary: "RESERVED",
    creator: {
      displayName: fname + " " + lname,
      email: email
    },
    description: "Name: " + fname + " " + lname + "\nEmail: " + email + "\nPhone: " + phone
  };
}

//---------------------------------------------------------------------------------------
// sends request to Google Calendar API to add specified event
//---------------------------------------------------------------------------------------
function addEvent(event) {
  xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "https://www.googleapis.com/calendar/v3/calendars/" +
      calendarID +
      "/events?" +
      "access_token=" +
      token,
    false
  );
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onreadystatechange = function() {
    console.log("added");
  };
  // console.log(JSON.stringify(event));
  xhr.send(JSON.stringify(event));
}