
const weatherForm = document.querySelector(`.weatherForm`);
const cityInput = document.querySelector(`.cityInput`);
const card = document.querySelector(`.card`);
const time = Date.now().time;

weatherForm.addEventListener("submit", async event => {

    event.preventDefault();

    const city = cityInput.value;
    if(city){
        const weatherData = await getWeatherData(city);
        displayWeatherInfo(weatherData);
    }else{
        displayError("Please Enter a City!");
    }
});

async function getWeatherData(city){

    try{
    const apiUrl1 =`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    const response1 = await fetch(apiUrl1);

    if(!response1.ok){
        throw new Error("Couldn't fetch data!");
    }

    const geoData = await response1.json();

    if(geoData.length === 0){
        throw new Error("City not Found!");
    }

    const {lat, lon} = geoData[0];
    const apiUrl2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response2 = await fetch(apiUrl2);
    
     if(!response2.ok){
        throw new Error("Couldn't fetch data!");
    }

    return await response2.json();

    }catch(error){
        displayError(error.message);
        return null;
    }
}

function displayWeatherInfo(data){

    const {name: city,
           main:{temp,humidity} ={},
           weather: [{description, id,icon}] = [],
           timezone
        } = data;
    
    card.textContent = "";
    card.style.display = "flex";

    const timeDisplay = document.createElement("p");
    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");


    timeDisplay.textContent = getLocalTime(timezone);
    cityDisplay.textContent = city;
    tempDisplay.textContent = `${temp}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmojiAndBackground(id,icon);

    timeDisplay.classList.add("timeDisplay");
    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");
    
    card.appendChild(timeDisplay);
    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
}

function getWeatherEmojiAndBackground(weatherId, icon) {
    let emoji = "❓";
    let background = "";
    
    const isNight = icon && icon.includes("n");

    switch (true) {
        case (weatherId >= 200 && weatherId < 300):
            emoji = "⛈️";
            background = isNight 
                ? `radial-gradient(ellipse at top left, #555 0px, #2a1b38 50px, #150d1c 60px, #000000 50%)`
                : `radial-gradient(ellipse at top left, #888 0px, #4b134f 50px, #2b0a2e 60px, #111 50%)`;
            break;
            
        case (weatherId >= 300 && weatherId < 600):
            emoji = "🌧️";
            background = isNight 
                ? `radial-gradient(ellipse at top left, #6688aa 0px, #1c3b57 50px, #0f2537 60px, #050a10 50%)`
                : `radial-gradient(ellipse at top left, white 0px, #88ccff 50px, #336699 60px, #16222a 50%)`;
            break;
            
        case (weatherId >= 600 && weatherId < 700):
            emoji = "❄️";
            background = isNight 
                ? `radial-gradient(ellipse at top left, #cccccc 0px, #445566 50px, #2a3644 60px, #0d131a 50%)`
                : `radial-gradient(ellipse at top left, white 0px, #ffffff 50px, #cccccc 60px, #8ba8c4 50%)`;
            break;
            
        case (weatherId >= 700 && weatherId < 800):
            emoji = "🌫️";
            background = isNight 
                ? `radial-gradient(ellipse at top left, #888888 0px, #444444 50px, #222222 60px, #0a0a0a 50%)`
                : `radial-gradient(ellipse at top left, white 0px, #cccccc 50px, #999999 60px, #4a5c6a 50%)`;
            break;
            
        case (weatherId === 800):
            if (isNight) {
                emoji = "🌙";
                background = `radial-gradient(ellipse at top left, white 0px, #6da5ff 50px, #4a7db3 60px, #0d1b2a 50%)`;
            } else {
                emoji = "☀️";
                background = `radial-gradient(ellipse at top left, white 0px, yellow 50px, yellow 60px, rgb(38, 134, 245) 50%)`;
            }
            break;
            
        case (weatherId >= 801 && weatherId < 810):
            emoji = "☁️";
            background = isNight 
                ? `radial-gradient(ellipse at top left, #999999 0px, #555555 50px, #333333 60px, #151f28 50%)`
                : `radial-gradient(ellipse at top left, white 0px, #dddddd 50px, #aaaaaa 60px, #2c3e50 50%)`;
            break;
    }

    document.body.style.background = background;
    return emoji;
}

function getLocalTime(timezoneOffset) {
    const date = new Date();
    
    const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);
    const cityTime = new Date(utcTime + (1000 * timezoneOffset));

    let hours = cityTime.getHours();
    let minutes = cityTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutes} ${ampm}`;
}

function displayError(message){

    const errordisplay = document.createElement("p");
    errordisplay.textContent = message;
    errordisplay.classList.add("errorMessage");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errordisplay);
}