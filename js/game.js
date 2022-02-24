let gl_countries = [];
let gl_country = [];
let gl_countryImage = [];
let gl_countryHints = [];

let score = 0;
let hints = 3;
let remainingTries = 3;
let remainingSkips = 2;

    $("#guess-box").keyup(function(event) {
    if (event.keyCode === 13) {
    $("#btn-guess").click();
    }
    });

function getJSON() {
    fetch('https://raw.githubusercontent.com/0xdane/GuessTheCountry/main/json/countries.json').then (data => data.json()).then(data => {
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
        Swal.fire({
            title: "<h1 style='color: white;'><b>Great job!</b></h1>",
            html: "<p style='color: white'>You have named all of the countries! Thanks for playing :)</p>",
            imageUrl: 'assets/img/misc/celebration.gif',
            imageWidth: 100,
            imageHeight: 100,
            background: '#363636',
            imageAlt: 'Clapping Face',
            showDenyButton: true,
            confirmButtonColor: "#ffffff",
            confirmButtonText: "Play again",
            denyButtonColor: "#ffffff",
            denyButtonText: "Return to dane.lol",
            backdrop: `
            rgba(0,0,0,0.4)
            url("assets/img/misc/confetti.gif")
            left top
            `
          }).then((result) => {
            if (result.isConfirmed) {
                location.reload();
            } else if (result.isDenied) {
                window.location.href = "https://dane.lol";
            }
          });
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

function skipCountry() {
    if(remainingSkips > 0) {
        remainingSkips = remainingSkips - 1;
        gl_country = [];
        gl_countryImage = [];
        gl_countryHints = [];
        randomCountry();
    } else {
        Swal.fire({
            title: "<h1 style='color: white;'><b>Oh no!</b></h1>",
            html: "<p style='color: white'>You've hit the limit of how many times you can skip</p>",
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
    remainingTries = 3;

    $("#country-image").html("<img id=\"countryimg-canvas\" src=\"" + gl_countryImage + "\">");
    $("#remaining-hints").html("You have <span style=\"color: aqua\"><b>" + hints + "</b></span> hints remaining.")
    $(".score-counter").html("<h3><b>SCORE: " + score + "</b></h3>")
    $("#tries-remaining").html("You have <span style=\"color: red;\"><b>" + remainingTries + "</b></span> guesses remaining.")
    $(".hints-section").html("");

    randomRotateImage();
}

function makeGuess() {
   var guessText = $("#guess-box").val().toLowerCase();
   var utteranceArr = gl_country[0][0].utterances;

   if ($("#guess-box").val() !== "") {
    if(remainingTries > 0) {
        if(utteranceArr.includes(guessText)) {
            utteranceArr = [];
            gl_country = [];
            gl_countryImage = [];
            gl_countryHints = [];
     
            hints = 3;
            score = score + 1;
            remainingTries = 3;

            var audio = new Audio('assets/sounds/correct.mp3');
            audio.play();
    
            $("#guess-box").val("");
    
            randomCountry();
        } else {
            if(remainingTries > 1) {
                Swal.fire({
                    icon: 'error',
                    title: "<h1 style='color: white;'><b>That is incorrect!</b></h1>",
                    background: '#363636',
                    showConfirmButton: false,
                    timer: 1100,
                    timerProgressBar: true,
                    progressBarColor: "#ffffff",
                    didOpen: () => {
                    timerInterval = setInterval(() => {
                    b.textContent = Swal.getTimerLeft()
                    }, 100)
                    },
                    willClose: () => {
                    clearInterval(timerInterval)
                    }
                  })
            }
            remainingTries = remainingTries - 1
            $("#tries-remaining").html("You have <span style=\"color: red;\"><b>" + remainingTries + "</b></span> guesses remaining.")
            $("#guess-box").val("");
            checkIfLost();
        }
     }
   } else {
    Swal.fire({
        icon: 'error',
        title: "<h1 style='color: white;'><b>Oops...</b></h1>",
        html: "<p style='color: white'>You didn't enter anything in the textbox :(</p>",
        background: '#363636',
        confirmButtonColor: "#ffffff",
        confirmButtonText: "Okay"
      })
   } 
}

function checkIfLost() {
    if(remainingTries === 0) {
        $("#losing-score").html("<b>" + score + "</b>")
        $("#twitter-button").html("<a href=\"https://twitter.com/intent/tweet?text=I%20just%20scored%20" + score + " playing%20Guess%20The%20Country.%20Think%20you%20can%20score%20higher?%20https://dane.lol/guess-the-country\" id=\"tweet-button\" class=\"button\"><i class=\"fab fa-twitter\"></i> Tweet</a>")
        $("#losingModal").modal("show")
        var audio = new Audio('assets/sounds/incorrect.mp3');
            audio.play();
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