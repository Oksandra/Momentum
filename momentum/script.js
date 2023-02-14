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
showTime();

function showDate() {
    const todayDate = document.querySelector('.date');
    const date = new Date();
    const options = {month: 'long', weekday: 'long', day: 'numeric', timeZone: 'UTC'};
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
  window.addEventListener('load', getLocalStorage) 
  window.addEventListener('beforeunload', setLocalStorage);

  function getLocalStorage() {
    const inputValue = document.querySelector('.name');  
    if(localStorage.getItem('name')) {
        inputValue.value = localStorage.getItem('name');
    }
  }
  
//Image slider
let randomNum 
randomNum = getRandomNum(1, 20);
window.onload = function() {
    setBg();
    sliderImage();
}

function setBg() {
    const img = new Image();
    const body = document.querySelector('body');
    let timeOfDay = getTimeOfDay();
    let bgNum = getBgNum(randomNum);
    img.src = `https://raw.githubusercontent.com/Oksandra/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
    img.onload = () => {      
        body.style.backgroundImage = `url(https://raw.githubusercontent.com/Oksandra/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg)`;
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



