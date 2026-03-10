"use strict";

import './scss/styles.scss';

//Kartan

const SverigeBounds = [ //Vill begränsa till svenska kartan
   [55.0, 10.0],
    [69.0, 24.0]
];

const map = L.map('map', {
    maxBounds: SverigeBounds,
    maxBoundsViscosity: 1.0
}).fitBounds(SverigeBounds);
 
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 5, //Så att man inte zoomar ut i övriga länder
    maxZoom: 10, //Lagom inzoomning så att man ser namnet på den svenska staden
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//Jag skapar en array för de städer som ska finnas med i resultatet
const cities = [
    {name: "Malmö", lat: 55.6052, lon: 13.0001},
    {name: "Halmstad", lat: 56.6739, lon: 12.8574},
    {name: "Göteborg", lat: 57.7072, lon: 11.9670},
    {name: "Karlstad", lat: 59.3809, lon: 13.5027},
    {name: "Falun", lat: 60.6070, lon: 15.6323},
    {name: "Östersund", lat: 63.1793, lon: 14.6357},
    {name: "Kiruna", lat: 67.8496, lon: 20.3062},
    {name: "Luleå", lat: 65.5831, lon: 22.1459},
    {name: "Umeå", lat: 63.8256, lon: 20.2630},
    {name: "Sundsvall", lat: 62.3907, lon: 17.3071},
    {name: "Stockholm", lat: 59.3251, lon: 18.0710},
    {name: "Linköping", lat: 58.4098, lon: 15.6245},
    {name: "Visby", lat: 57.6379, lon: 18.2979},
    {name: "Kalmar", lat: 56.6628, lon: 16.3662},
    {name: "Simrishamn", lat: 55.5565, lon: 14.3499},
];

//Jag hämtar API-kod från Open-Meteo för att bland annat få fram väderkoden.
async function showWeather() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=59.32&longitude=18.06&current=weather_code,wind_speed_10m,precipitation&forecast_days=1&wind_speed_unit=ms";
    const response = await fetch(url);
    const data = await response.json();

    console.log(data);
}

showWeather();