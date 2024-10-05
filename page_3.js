/*Classes*/
class ApiURL {
    constructor(url, dataTable){
        this.url = url;
        this.dataTable = dataTable;
    }
};

/*Global*/
const oslo = new ApiURL('https://api.open-meteo.com/v1/forecast?latitude=59.8937521&longitude=10.6203147&current_weather=true',document.getElementById('oslo').children[1].children[1].children[0].children);
const berlin = new ApiURL('https://api.open-meteo.com/v1/forecast?latitude=52.5067296&longitude=13.2599283&current_weather=true',document.getElementById('berlin').children[1].children[1].children[0].children);
const london = new ApiURL('https://api.open-meteo.com/v1/forecast?latitude=51.5285262&longitude=-0.2664023&current_weather=true',document.getElementById('london').children[1].children[1].children[0].children);
const washingtondc = new ApiURL('https://api.open-meteo.com/v1/forecast?latitude=38.8936509&longitude=-77.1704633&current_weather=true',document.getElementById('washington_dc').children[1].children[1].children[0].children);
const seoul = new ApiURL('https://api.open-meteo.com/v1/forecast?latitude=37.5647616&longitude=126.8093331&current_weather=true',document.getElementById('seoul').children[1].children[1].children[0].children);
const cities = [oslo, berlin, london, washingtondc, seoul];
const dayNight = ['<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm283-100q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-160Z"/></svg>','<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M484-80q-84 0-157.5-32t-128-86.5Q144-253 112-326.5T80-484q0-146 93-257.5T410-880q-18 99 11 193.5T521-521q71 71 165.5 100T880-410q-26 144-138 237T484-80Zm0-80q88 0 163-44t118-121q-86-8-163-43.5T464-465q-61-61-97-138t-43-163q-77 43-120.5 118.5T160-484q0 135 94.5 229.5T484-160Zm-20-305Z"/></svg>']
const weatherIcons = ["clear", "partly_clear","fog", "drizzle", "rain", "freezing_rain","snowshowers", "thunderstorm"];

/*Onload*/
window.addEventListener('load', function(){

    //Loop through all the cities, fetch and update
    cities.forEach(city => { 
        fetchWeather(city);
    });

})


/*Update on a 1 min interval*/
setInterval(() => {
    //Loop through all the cities, fetch and update
    cities.forEach(city => {
        fetchWeather(city);
    });
},60000);

//Fetch data
async function fetchWeather(city) {
    try{
        const response = await fetch(city.url);
        if(!response.ok){
            throw new Error('Network issues');
        }
        weatherData = await response.json();
        updateTable(weatherData,city.dataTable);
    } catch (error){
        console.log("Could not fetch data: ", error);
    }
}

//Update the tables
const updateTable = (weather, dataTable) => {
    let weatherData = [];
    weatherData.push(weather.current_weather.temperature,
        weather.current_weather.windspeed, 
        weather.current_weather.winddirection, 
        weather.current_weather.is_day, 
        weather.current_weather.weathercode);
    
    for (let i = 0; i < dataTable.length; i++){
        
        if(i == 0){ //Check if temperature
            dataTable[i].textContent = weatherData[i] + " " + weather.current_weather_units.temperature;
        }else if(i == 1){ //Check if windspeed
            dataTable[i].textContent = weatherData[i] + " " + weather.current_weather_units.windspeed;
        }else if(i == 2){ //Check if wind direction

            dataTable[i].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" style="transform: rotate(${weatherData[2]}deg)" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z"/></svg>`;
        } else if (i == 3){ //Check if day or night
            if(weatherData[3]){
                dataTable[i].innerHTML = dayNight[0];
            }else{
                dataTable[i].innerHTML = dayNight[1];
            }
        }else if(i == 4){ //Check if wmo code
            dataTable[i].innerHTML = convertWMOCodes(weatherData[i]);
        }
    }
};

//Convert weather codes into icons
const convertWMOCodes = (wmo) => {
    let iconHtml;

    switch (wmo) {
        case 0: 
            iconHtml = `<img src="weather_icon/${weatherIcons[0]}.png" alt="Clear.">`;
            break;
        case 1: case 2: case 3: 
            iconHtml = `<img src="weather_icon/${weatherIcons[1]}.png" alt="Partly Clear.">`;
            break;
        case 45: case 48: 
            iconHtml = `<img src="weather_icon/${weatherIcons[2]}.png" alt="Fog.">`;
            break;
        case 51: case 53: case 55: case 56: case 57: 
            iconHtml = `<img src="weather_icon/${weatherIcons[3]}.png" alt="Drizzle.">`;
            break;
        case 61: case 63: case 65: 
            iconHtml = `<img src="weather_icon/${weatherIcons[4]}.png" alt="Rain.">`;
            break;
        case 66: case 67: 
            iconHtml = `<img src="weather_icon/${weatherIcons[5]}.png" alt="Freezing Rain.">`;
            break;
        case 71: case 73: case 75: case 77: 
            iconHtml = `<img src="weather_icon/${weatherIcons[6]}.png" alt="Snow.">`;
            break;
        case 95: case 96: case 99: 
            iconHtml = `<img src="weather_icon/${weatherIcons[7]}.png" alt="Thunderstorm.">`;
            break;
        default:
            iconHtml = wmo;
    }
    

    return iconHtml;
};