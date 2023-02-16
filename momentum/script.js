//Clock and calendar
function showTime() {
    const time = document.querySelector('.time');
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.innerText = currentTime;
    setTimeout(showTime, 1000);
    showDate();
    showGreeting();
}

function showDate() {
    const todayDate = document.querySelector('.date');
    const date = new Date();
    const options = {month: 'long', weekday: 'long', day: 'numeric'};
    const currentDate = date.toLocaleDateString('en-US', options);
    todayDate.innerText = currentDate;
}

//Greeting
function showGreeting() {
    const greetingContainer = document.querySelector('.greeting');
    let timeOfDay = getTimeOfDay();
    greetingContainer.innerText = `Good ${timeOfDay}`;
}

function getTimeOfDay() {
    const date = new Date();
    const hours = date.getHours();
    if(hours >= 6 & hours < 12) {
        return 'morning';
    } else if(hours >= 12 & hours < 18) {
        return 'afternoon';
    } else if(hours >= 18 & hours < 24) {
        return 'evening';
    } else {
        return 'night';
    }
}

function setLocalStorage() {
    const inputValue = document.querySelector('.name');
    localStorage.setItem('name', inputValue.value);
  }

  function getLocalStorage() {
    const inputValue = document.querySelector('.name');  
    if(localStorage.getItem('name')) {
        inputValue.value = localStorage.getItem('name');
    } 
    else {
      addPlaceholder();
}
  }
  window.addEventListener('load', getLocalStorage) 
  window.addEventListener('beforeunload', setLocalStorage);

 function addPlaceholder() {
 const inputValue = document.querySelector('.name'); 
 inputValue.setAttribute('placeholder', '[Enter name]');
}
 
function changePlaceholder() {
    const inputValue = document.querySelector('.name'); 
    inputValue.addEventListener('input', () => {
      if(inputValue.value === '') {
               addPlaceholder();
    }}) 
}

//Image slider
let randomNum 
randomNum = getRandomNum(1, 20);
window.onload = function() {
    showTime();
    setBg();
    sliderImage();
    changePlaceholder(); 
    setCity();
}

function setBg() {
    const img = new Image();
    const body = document.querySelector('body');
    let timeOfDay = getTimeOfDay();
    let bgNum = getBgNum(randomNum);
    img.src = `https://raw.githubusercontent.com/Oksandra/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
    img.onload = () => {      
        body.style.backgroundImage = `url(${img.src})`;
      }; 
    }

function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; 
  }

function getBgNum(num) {
    let stringFromNum = num.toString();
    return stringFromNum.padStart(2, "0");
}

function sliderImage() {
    const slideNext = document.querySelector('.slide-next');
    const slidePrev = document.querySelector('.slide-prev');
    slideNext.addEventListener('click', getSlideNext);
    slidePrev.addEventListener('click', getSlidePrev);
}

function getSlideNext() { 
    if(randomNum === 20) {
        randomNum = 1;   
      } else {
        randomNum += 1; 
      }
    setBg(); 
}

function getSlidePrev() {
    if(randomNum === 1) {
      randomNum = 20;   
    } else {
       randomNum = randomNum - 1; 
    }
    setBg(); 
}

//Weather widget
function setLocalStorageCity() {
    const inputValue = document.querySelector('.city');
    localStorage.setItem('city', inputValue.value);
  }

  function getLocalStorageCity() {
    const inputValue = document.querySelector('.city');  
    if(localStorage.getItem('city')) {
        inputValue.value = localStorage.getItem('city');
    } else {
        inputValue.value = 'Minsk';
    }
    getWeather();
  }
  window.addEventListener('load', getLocalStorageCity) 
  window.addEventListener('beforeunload', setLocalStorageCity);

async function getWeather() {  
    const weatherIcon = document.querySelector('.weather-icon');
    const temperature = document.querySelector('.temperature');
    const weatherDescription = document.querySelector('.weather-description');
    const windSpeed = document.querySelector('.wind');
    const humidity = document.querySelector('.humidity');
    const weatherError = document.querySelector('.weather-error');
    const city = document.querySelector('.city');
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=3533e6e21221ee239bd402d94c9945c4&units=metric`;
        const res = await fetch(url);
        const data = await res.json(); 
    
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        weatherError.textContent = '';
        temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        windSpeed.textContent = `Wind speed: ${data.wind.speed.toFixed(0)}m/s`;
        humidity.textContent = `Humidity: ${data.main.humidity.toFixed(0)}%`;
    } catch {
        weatherError.textContent = `Error! City not found for '${city.value}'!`
        temperature.textContent = '';
        weatherDescription.textContent = '';
        windSpeed.textContent = '';
        humidity.textContent = '';
    }
    
  }

  function setCity() {
    const city = document.querySelector('.city');
    city.addEventListener('change', getWeather);
  }



