//Clock and calendar
function showTime() {
    const time = document.querySelector('.time');
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.innerText = currentTime;
    setTimeout(showTime, 1000);
    showDate();
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

