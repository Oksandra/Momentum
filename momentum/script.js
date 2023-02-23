import playList from './js/playList.js';
import i18Obj from './js/translate.js';

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
  if(lang === 'en') {
    const currentDate = date.toLocaleDateString('en-US', options);
    todayDate.innerText = currentDate;
   } else {
    const currentDate = date.toLocaleDateString('ru', options);
    todayDate.innerText = currentDate;
   }
}

//Greeting
function showGreeting() {
    const greetingContainer = document.querySelector('.greeting');
    if(lang === 'en') {
      let timeOfDay = getTimeOfDay();
      greetingContainer.innerText = `Good ${timeOfDay}`;
    } else {
      let timeOfDayRus = getTimeOfDayRus();
      greetingContainer.innerText = `${timeOfDayRus}`;
    }
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

function getTimeOfDayRus() {
  const date = new Date();
  const hours = date.getHours();
    if(hours >= 6 & hours < 12) {
      return 'Доброе утро';
  } else if(hours >= 12 & hours < 18) {
      return 'Добрый день';
  } else if(hours >= 18 & hours < 24) {
      return 'Добрый вечер';
  } else {
      return 'Доброй ночи';
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

 function defineLangBeforeLoading() {
  let language = localStorage.getItem('lang')
  return language;
 }
 let lang = defineLangBeforeLoading();

 function addPlaceholder() {
 const inputValue = document.querySelector('.name'); 
 if(lang === 'en') {
  inputValue.setAttribute('placeholder', '[Enter name]');
 } else {
  inputValue.setAttribute('placeholder', '[Введите имя]');
 }
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
  addBlackoutClick();
  addClickHandlerSetting();
  addClickLang();
  getTranslate(lang);
  showGrade();
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
        if(lang === 'en') {
        inputValue.value = 'Minsk'; } else {
        inputValue.value = 'Минск';  
    } 
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
    if(lang === 'en') {
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
    } } else {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=ru&appid=3533e6e21221ee239bd402d94c9945c4&units=metric`;
        const res = await fetch(url);
        const data = await res.json(); 
    
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        weatherError.textContent = '';
        temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        windSpeed.textContent = `Скорость ветра: ${data.wind.speed.toFixed(0)}м/с`;
        humidity.textContent = `Влажность: ${data.main.humidity.toFixed(0)}%`;
    } catch {
        weatherError.textContent = `Ошибка! Не найден город для '${city.value}'!`
        temperature.textContent = '';
        weatherDescription.textContent = '';
        windSpeed.textContent = '';
        humidity.textContent = '';
    }
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
    if(lang === 'en') { 
    const quotes = './assets/data.json';
    const res = await fetch(quotes);
    const data = await res.json();
    let quoteNmber = getRandomNum(0, data.length - 1);
    quote.textContent = data[quoteNmber].text;
    author.textContent = data[quoteNmber].author;
  } else {
    const quotes = './assets/data-rus.json';
    const res = await fetch(quotes);
    const data = await res.json();
    let quoteNmber = getRandomNum(0, data.length - 1);
    quote.textContent = data[quoteNmber].text;
    author.textContent = data[quoteNmber].author;
    }
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


//Text translation
function setLocalStorageLanguage() {
  const languageValue = document.querySelector('.active-language');
  if(languageValue) {
    localStorage.setItem('lang', languageValue.innerText);
  } else 
  localStorage.setItem('lang', 'en');
}

function getLocalStorageLanguage() {
  const ButtonsLang = document.querySelectorAll('.item-language');
  ButtonsLang.forEach(button => {
    if(button.innerText === localStorage.getItem('lang')) {
     button.classList.add('active-language');
  } }
    )
}

window.addEventListener('load', getLocalStorageLanguage) 
window.addEventListener('beforeunload', setLocalStorageLanguage);

function translateDefaultCity() {
  const DefaultCity = document.querySelector('.city');
  if(DefaultCity.value === 'Minsk' || DefaultCity.value === 'Минск') {
    if(lang === 'en') {
      DefaultCity.value = 'Minsk'
    } else {
      DefaultCity.value = 'Минск'
    }
  }
}

function getTranslate(lang) {
  const elementsForTranslate = document.querySelectorAll('[data-i18]');
  elementsForTranslate.forEach(item => {
    item.textContent = i18Obj[lang][item.dataset.i18];
  })
}

function addClickLang() {
  const buttonChoiceLang = document.querySelector('.choice-language');
  buttonChoiceLang.addEventListener('click', (event) => {
    if(event.target.classList.contains('item-language') && !event.target.classList.contains('active-language')) {
      let clickedButton = event.target;
      removeSelectedButtonsLang();
      selectedClickButtonLang(clickedButton);
      lang = defineLangAfterClick();
      addPlaceholder();
      showDate();
      showGreeting();
      getWeather();
      translateDefaultCity();
      getQuotes();
      getTranslate(lang);
    }
})
}

function defineLangAfterClick() {
  const ButtonsLang = document.querySelectorAll('.item-language');
  let language
  ButtonsLang.forEach(button => {
    if(button.classList.contains('active-language')) {
     language = button.innerText;
    }
  })
  return language;
 }

function removeSelectedButtonsLang() {
 const ButtonsLang = document.querySelectorAll('.item-language');
 ButtonsLang.forEach(button => 
  button.classList.remove('active-language'))
}

function selectedClickButtonLang(button) {
  button.classList.add('active-language');
}

//Setting
function addClickHandlerSetting() {
 const settingButton = document.querySelector('.setting');
  settingButton.addEventListener('click', () => {
    openSettingMenu();
    changeSettingIcon();
    addBlackout();
  }) 
}

function openSettingMenu() {
  const menu = document.querySelector('.setting-menu');
  menu.classList.toggle('setting-menu-active');
}

function changeSettingIcon() {
  const settingButton = document.querySelector('.setting');
  settingButton.classList.toggle('setting-active');
}

function addBlackout() {
  const blackout = document.querySelector('.blackout');
  blackout.classList.toggle('blackout-active');
}

function addBlackoutClick() {
  const blackout = document.querySelector('.blackout');
  blackout.addEventListener('click', (event) => {
    if(event.target.classList.contains('blackout')) {
      blackout.classList.remove('blackout-active');
      openSettingMenu();
      changeSettingIcon();
    }
  }
) }

function showGrade() {
  console.log(`Общее количество: 123 баллов.
  Часы и календарь +15
  Приветствие +10
  Смена фонового изображения +20
  Виджет погоды +15
  Виджет цитата дня +10
  Аудиоплеер +15
  Продвинутый аудиоплеер +20
  Перевод приложения на два языка (en/ru) +15
  Настройки приложения +3`)
 }
