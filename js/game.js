let gl_countries = [];
let gl_country = [];
let gl_countryImage = [];

let score = 0;

function getJSON() {
    fetch('https://raw.githubusercontent.com/0xdane/TempTest/main/countries.json').then (data => data.json()).then(data => {
    gl_countries.push(data.countries);
    console.log(gl_countries)
    randomCountry();
        
    })
    .catch(error => {
        console.log(error);
    })
}

function randomCountry() {
    let randomCountry = [];

    var randomCountrySample = _.sample(gl_countries[0]);

    randomCountry = [];
    randomCountry.push(randomCountrySample);

    console.log(randomCountry);
    gl_country.push(randomCountry);
    getCountryImage();
}

function getCountryImage() {
    let countryRandomImage = [];
    var randomImage = _.sample(gl_country[0][0].images)

    countryRandomImage = [];
    countryRandomImage.push(randomImage);
    console.log(countryRandomImage);

    gl_countryImage.push(countryRandomImage)

}