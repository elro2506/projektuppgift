"use strict";

import './scss/styles.scss';

/**
 * Sveriges geografiska gränser så att man bara ser Sverige i kartvyn
 * @type {number[][]}
 */
//Kartan
const SverigeBounds = [ //Vill begränsa till svenska kartan
    [55.0, 10.0],
    [69.0, 24.0]
];

/**
 * Anpassad ikon för respektive väderdata
 * @type {L.icon}
 */
var sunnyIcon = L.icon({
    iconUrl: './bilder/soligt.svg',
    iconSize: [50, 50], //Kod hämtad från Leaflet och modifierad för att passa min kod
});

var rainyIcon = L.icon({
    iconUrl: './bilder/regn.svg',
    iconSize: [50, 50], //Kod hämtad från Leaflet och modifierad för att passa min kod
});

var windyIcon = L.icon({
    iconUrl: './bilder/windy.svg',
    iconSize: [50, 50], //Kod hämtad från Leaflet och modifierad för att passa min kod
});

var cloudyIcon = L.icon({
    iconUrl: './bilder/cloudy.svg',
    iconSize: [50, 50], //Kod hämtad från Leaflet och modifierad för att passa min kod
});

var moonIcon = L.icon({
    iconUrl: './bilder/moon.svg',
    iconSize: [41, 40],
});

/**
 * En karta från Leaflet och den är begränsad till Sveriges väder
 * @type {L.map}
 */
const map = L.map('map', {
    maxBounds: SverigeBounds,
    maxBoundsViscosity: 1.0
}).fitBounds(SverigeBounds);

/**
 * Markörerna rensas vid nästa klick
 * @type {L.LayerGroup}
 */
const marker = L.layerGroup().addTo(map); //för att senare kunna rensa kartan vid nästa klick så inte det blir massa nya ikoner

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 5, //Så att man inte zoomar ut i övriga länder
    maxZoom: 10, //Lagom inzoomning så att man ser namnet på den svenska staden
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

/**
 * En array med lista över städer och dess koordinater för att använda detta i webbapplikationen
 * @type {{name: string, lat: number, lon: numbre}[]}
 */
const cities = [
    { name: "Malmö", lat: 55.6052, lon: 13.0001 },
    { name: "Halmstad", lat: 56.6739, lon: 12.8574 },
    { name: "Göteborg", lat: 57.7072, lon: 11.9670 },
    { name: "Karlstad", lat: 59.3809, lon: 13.5027 },
    { name: "Falun", lat: 60.6070, lon: 15.6323 },
    { name: "Östersund", lat: 63.1793, lon: 14.6357 },
    { name: "Kiruna", lat: 67.8496, lon: 20.3062 },
    { name: "Luleå", lat: 65.5831, lon: 22.1459 },
    { name: "Umeå", lat: 63.8256, lon: 20.2630 },
    { name: "Sundsvall", lat: 62.3907, lon: 17.3071 },
    { name: "Stockholm", lat: 59.3251, lon: 18.0710 },
    { name: "Linköping", lat: 58.4098, lon: 15.6245 },
    { name: "Visby", lat: 57.6379, lon: 18.2979 },
    { name: "Kalmar", lat: 56.6628, lon: 16.3662 },
    { name: "Simrishamn", lat: 55.5565, lon: 14.3499 },
];

/**
 * Hämtar väderdatan för en stad och visar en markör/ikon om vädret är soligt. Visar månikonen om det är klart väder på natten.
 * @param {{name: string, lat: number, lon: number}} city - stadens namn och koordinater
 * @returns {Promise}
 */
async function showSunnyWeather(city) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=precipitation,weather_code,wind_speed_10m,cloud_cover,is_day&forecast_days=1&wind_speed_unit=ms`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.current.weather_code <= 2 &&
        data.current.cloud_cover <= 50 &&
        data.current.precipitation === 0 &&
        data.current.is_day === 1) { //För att se om det är dagtid
        L.marker([city.lat, city.lon],
            { icon: sunnyIcon }).addTo(marker)
            .bindPopup("Solen skiner här i " + city.name + "!");
    }

    else if (
        data.current.weather_code <= 2 &&
        data.current.is_day === 0
    ) {
        L.marker([city.lat, city.lon],
            { icon: moonIcon }).addTo(marker)
            .bindPopup("Det är klart väder i " + city.name + ", men solen har gått ned.");
    }

}

async function showRainyWeather(city) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=precipitation,weather_code,wind_speed_10m,cloud_cover&forecast_days=1&wind_speed_unit=ms`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.current.precipitation > 0) {
        L.marker([city.lat, city.lon],
            { icon: rainyIcon }).addTo(marker)
            .bindPopup("Det regnar här i " + city.name + "!");
    }

}

async function showWindyWeather(city) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=precipitation,weather_code,wind_speed_10m,cloud_cover&forecast_days=1&wind_speed_unit=ms`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.current.wind_speed_10m > 6) {
        L.marker([city.lat, city.lon],
            { icon: windyIcon }).addTo(marker)
            .bindPopup("Det blåser mer än 6 m/s här i " + city.name + "!");
    }

}

async function showCloudyWeather(city) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=precipitation,weather_code,wind_speed_10m,cloud_cover&forecast_days=1&wind_speed_unit=ms`;

    const response = await fetch(url);
    const data = await response.json();




    if (data.current.cloud_cover > 50 &&
        data.current.precipitation === 0) {
        L.marker([city.lat, city.lon],
            { icon: cloudyIcon }).addTo(marker)
            .bindPopup("Det är molnigt här i " + city.name + "!");
    }

}

/**
 * Visar alla städer som just nu har soligt väder
 * Om inga städer matchas så visas i stället ett textmeddelande
 * @returns {Promise}
 */
async function showSunnyCities() {
    marker.clearLayers(); //för att rensa fält innan nästa klick
    const element = document.getElementById("map");


    const message = document.getElementById("weatherText");
    message.textContent = "";

    for (const city of cities) {
        await showSunnyWeather(city);
    }

    if (marker.getLayers().length === 0) {
        message.scrollIntoView({
            behavior: "smooth"
        });
        message.textContent = "Varning för brist på vitamin D idag! Men att sitta inomhus och titta på en film är också bra för hälsan ibland!";
    }
    else {
        element.scrollIntoView({
            behavior: "smooth"
        });
    }
}

async function showRainyCities() {
    marker.clearLayers(); //för att rensa fält innan nästa klick
    const element = document.getElementById("map");


    const message = document.getElementById("weatherText");
    message.textContent = "";

    for (const city of cities) {
        await showRainyWeather(city);
    }

    if (marker.getLayers().length === 0) {
        message.scrollIntoView({
            behavior: "smooth"
        });
        message.textContent = "Fäll ihop paraplyet och ställ in gummistövlarna, idag har regnet gett plats åt andra spännande väder!";
    }
    else {
        element.scrollIntoView({
            behavior: "smooth"
        });
    }

}

async function showWindyCities() {
    marker.clearLayers(); //för att rensa fält innan nästa klick
    const element = document.getElementById("map");


    const message = document.getElementById("weatherText");
    message.textContent = "";

    for (const city of cities) {
        await showWindyWeather(city);
    }

    if (marker.getLayers().length === 0) {
        message.scrollIntoView({
            behavior: "smooth"
        });
        message.textContent = "Sätt ankare på segelbåten och fäll ihop draken, nu är det ingen vind i sikte. Idag är det perfekt badminton-väder eller så kan du spegla dig i havet!";
    }
    else {
        element.scrollIntoView({
            behavior: "smooth"
        });
    }
}

async function showCloudyCities() {
    marker.clearLayers(); //för att rensa fält innan nästa klick
    const element = document.getElementById("map");


    const message = document.getElementById("weatherText");
    message.textContent = "";

    for (const city of cities) {
        await showCloudyWeather(city);
    }

    if (marker.getLayers().length === 0) {
        message.scrollIntoView({
            behavior: "smooth"
        });
        message.textContent = "Just nu kan ni inte bråka om det där molnet ser ut som en dinosaurie eller en clown. Bättre lycka nästa gång!";
    }
    else {
        element.scrollIntoView({
            behavior: "smooth"
        });
    }
}

/**
 * Elementet är klickbart för soligt väder
 * @type {HTMLElement}
 */
const elementSunny = document.getElementById("sunny");
elementSunny.addEventListener("click", showSunnyCities);

const elementRainy = document.getElementById("rainy");
elementRainy.addEventListener("click", showRainyCities);

const elementWindy = document.getElementById("windy");
elementWindy.addEventListener("click", showWindyCities);

const elementCloudy = document.getElementById("cloudy");
elementCloudy.addEventListener("click", showCloudyCities);