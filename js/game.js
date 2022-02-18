let gl_countries = [];
let gl_country = [];
let gl_countryImage = [];
let gl_countryHints = [];

let score = 0;
let hints = 3;
let remainingTries = 3;

    $("#guess-box").keyup(function(event) {
    if (event.keyCode === 13) {
    $("#btn-guess").click();
    }
    });

function getJSON() {
    fetch('https://raw.githubusercontent.com/0xdane/TempTest/main/countries.json').then (data => data.json()).then(data => {
    gl_countries.push(data.countries);
    console.log(gl_countries);
    randomCountry();
        
    })
    .catch(error => {
        console.log(error);
    })
}

function randomCountry() {
    let randomCountry = [];
    
    if(gl_countries[0][0] !== undefined) {
        var randomCountrySample = _.sample(gl_countries[0]);

    randomCountry = [];
    randomCountry.push(randomCountrySample);

    _.remove(gl_countries[0], function(h) {
        return h === randomCountrySample;
    });

    console.log(randomCountry);
    gl_country.push(randomCountry);
    getCountryImage();
    } else {
        alert ("You have named all of the countries. Thanks for playing! :)")
    }
}

function getCountryImage() {
    let countryRandomImage = [];
    var randomImage = _.sample(gl_country[0][0].images)

    countryRandomImage = [];
    countryRandomImage.push(randomImage);
    console.log(countryRandomImage);

    gl_countryImage.push(countryRandomImage);

    populateData();
}

function getNewHint() {
    if(hints > 0) {
        var randomNewHint = _.sample(gl_country[0][0].hints)
        gl_countryHints.push(randomNewHint);
        // console.log(gl_countryHints);

        hints = hints - 1;

        _.remove(gl_country[0][0].hints, function(h) {
            return h === randomNewHint;
        });

        // console.log(gl_country[0][0].hints);

        $("#remaining-hints").html("You have <span style=\"color: aqua\"><b>" + hints + "</b></span> hints remaining.")
        
        $(".hints-section").append(randomNewHint + "<br>")
    } else {
        Swal.fire({
            title: "<h1 style='color: white;'><b>Oh no!</b></h1>",
            html: "<p style='color: white'>You have no more hints remaining.</p>",
            imageUrl: 'assets/img/misc/sad.gif',
            imageWidth: 100,
            imageHeight: 100,
            background: '#363636',
            imageAlt: 'Sad Face',
            confirmButtonColor: "#ffffff",
            confirmButtonText: "Okay",
          })
    }
}

function populateData() {
    $("#country-image").html("<img id=\"countryimg-canvas\" src=\"" + gl_countryImage + "\">");
    $("#remaining-hints").html("You have <span style=\"color: aqua\"><b>" + hints + "</b></span> hints remaining.")
    $(".score-counter").html("<h3><b>SCORE: " + score + "</b></h3>")
    $(".hints-section").html("");
    randomRotateImage();
}

function makeGuess() {
   var guessText = $("#guess-box").val().toLowerCase();
   var utteranceArr = gl_country[0][0].utterances;

   if(remainingTries > 0) {
    if(utteranceArr.includes(guessText)) {
        utteranceArr = [];
        gl_country = [];
        gl_countryImage = [];
        gl_countryHints = [];
 
        hints = 3;
        score = score + 1;
        remainingTries = 3;

        $("#guess-box").val("");

        randomCountry();
    } else {
        alert("That is incorrect");
        remainingTries = remainingTries - 1
        $("#guess-box").val("");
        checkIfLost();
    }
 } 
}

function checkIfLost() {
    if(remainingTries === 0) {

        $("#losingModal").modal("show")
    }
}

function randomRotateImage() {
    const min = 0;
    const max = 359;
    const randomDeg = Math.floor(Math.random() * (max - min + 1)) + min;

    var id = 'countryimg-canvas';
    var deg = randomDeg;
    document.getElementById(id).style = 'transform: rotate(' + deg + 'deg)'; 
    $(".country-image").show();
}