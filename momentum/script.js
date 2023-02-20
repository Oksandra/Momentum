import playList from './js/playList.js';

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
    getQuotes();
    changeQuote();
    addClickHandlerAudio();
    playNextAudio();
    playPrevAudio();
    if(playList) {
      createPlaylist(playList);
      showCurrentAudio();
      addHandlerProress();
      addClickHandlerAudios();
  };
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

//Quote widget
async function getQuotes() {
    const quote = document.querySelector('.quote'); 
    const author = document.querySelector('.author'); 
    const quotes = 'data.json';
    const res = await fetch(quotes);
    const data = await res.json(); 

    let quoteNmber = getRandomNum(0, data.length - 1);
    quote.textContent = data[quoteNmber].text;
    author.textContent = data[quoteNmber].author;
  }

function changeQuote() {
    const changeQuotes = document.querySelector('.change-quote');
    changeQuotes.addEventListener('click', getQuotes);  
}

//Audio player
let isPlay = false;
let playNum = 0;
let timeElapsed = 0;

const audio = new Audio();
function playAudio() {
  selectedCurrentAudio();
  showCurrentAudio();
  if(!isPlay) {
    audio.src = playList[playNum].src;
    audio.currentTime = timeElapsed;
    audio.play();
    isPlay = true;
    toggleBtn();
  } else {
    timeElapsed = audio.currentTime;
    audio.pause();
    isPlay = false;
    toggleBtn();
  }
}

function addClickHandlerAudio() {
  const play = document.querySelector('.play');
  play.addEventListener('click', playAudio);
}

function toggleBtn() {
  const buttonPlay = document.querySelector('.play');
  buttonPlay.classList.toggle('pause');
}

function playNext() {
  if(playNum === playList.length - 1) {
    playNum = 0;   
  } else {
    playNum += 1; 
  }
  if(isPlay) {
    timeElapsed = 0
    playAudio();
  }  
    timeElapsed = 0
  playAudio();
}

function playPrev() {
  if(playNum === 0) {
    playNum = playList.length - 1;   
  } else {
    playNum = playNum - 1;
  }
  if(isPlay) {
    timeElapsed = 0;
    playAudio();
  }
    timeElapsed = 0;
  playAudio();
}

function playNextAudio() {
  const playNextButton = document.querySelector('.play-next');
  playNextButton.addEventListener('click', playNext);
}

function playPrevAudio() {
  const playPrevButton = document.querySelector('.play-prev');
  playPrevButton.addEventListener('click', playPrev);
}

function createPlaylist(playList) {
  const playListContainer = document.querySelector('.play-list');
  playList.forEach(element => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = element.title;
    playListContainer.append(li);
  }
  )
}

function selectedCurrentAudio() {
 const playItems = document.querySelectorAll('.play-item');
 playItems.forEach((item, index) => { if(index === playNum && isPlay === false) {
  item.classList.add('item-active');
  item.classList.remove('item-active-partial');
 } else if(index === playNum && isPlay === true) {
  item.classList.remove('item-active');
  item.classList.add('item-active-partial');
 } else {
  item.classList.remove('item-active');
  item.classList.remove('item-active-partial');
 }
 })
}

function addClickHandlerAudios() {
  const playItems = document.querySelectorAll('.play-item');
  const buttonPlay = document.querySelector('.play');
  playItems.forEach((item, index) => item.addEventListener('click', () => {
    playNum = index;
    if(isPlay && item.classList.contains('item-active')) {
      timeElapsed = 0;
      playAudio();
    } else if(isPlay) {
      isPlay = false;
      timeElapsed = 0;
      buttonPlay.classList.remove('pause');
    playAudio();
    } else {
      timeElapsed = 0;
      playAudio();
    }
  }
  ))
}

audio.addEventListener('ended', playNext);

//Advanced Audio player
function showCurrentAudio() {
  const currentAudio = document.querySelector('.current-audio');
  currentAudio.innerText = playList[playNum].title;
}

audio.addEventListener('timeupdate', (event) => {
  const {currentTime, duration} = event.srcElement;
  //console.log(currentTime);
  const progress = document.querySelector('.progress');
  const currentAudioLength = document.querySelector('.audio-length');
  const currentTimeLength = document.querySelector('.current');
  let progressTime = (currentTime / duration) * 100;
  progress.style.width = `${progressTime}%`;
  //console.log(progressTime);
  let minDuration = Math.floor(duration / 60);
  let secDuration = Math.floor(duration % 60);
  if(duration) {
    currentAudioLength.innerText = `${minDuration}:${secDuration}`;
  }

  let minCurrentTime = Math.floor(currentTime / 60);
  let secCurrentTime = Math.floor(currentTime % 60);
  if(secCurrentTime < 10 ) {
    secCurrentTime = `0${secCurrentTime}`;
  }
    currentTimeLength.innerText = `${minCurrentTime}:${secCurrentTime}`;
});

function addHandlerProress() {
  const proressContainer = document.querySelector('.timeline');
  proressContainer.addEventListener('click', (event) => {
    const {duration} = audio;
    let moveProgress = (event.offsetX / event.srcElement.clientWidth) * duration;
    audio.currentTime = moveProgress;
    timeElapsed = moveProgress;
  })
}

const volumeSlider = document.querySelector(".volume-slider");
volumeSlider.addEventListener('click', e => {
  const sliderWidth = window.getComputedStyle(volumeSlider).width;
  const newVolume = e.offsetX / parseInt(sliderWidth);
  audio.volume = newVolume;
  document.querySelector(".volume-percentage").style.width = newVolume * 100 + '%';
}, false)


document.querySelector(".volume-button").addEventListener("click", () => {
  const volumeEl = document.querySelector(".volume");
  audio.muted = !audio.muted;
  if (audio.muted) {
    volumeEl.classList.remove("icono-volumeMedium");
    volumeEl.classList.add("icono-volumeMute");
  } else {
    volumeEl.classList.add("icono-volumeMedium");
    volumeEl.classList.remove("icono-volumeMute");
  }
});

