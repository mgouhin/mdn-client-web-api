const media = document.querySelector('video');
const controls = document.querySelector('.controls');

const play = document.querySelector('.play');
const stop = document.querySelector('.stop');
const rwd = document.querySelector('.rwd');
const fwd = document.querySelector('.fwd');

const timeWrapper = document.querySelector('.timer');
const timer = document.querySelector('.timer span');
const timerBar = document.querySelector('.timer div');

let intervalFwd;
let intervalRwd;

media.removeAttribute('controls');
controls.style.visibility = 'visible';

play.addEventListener('click', playPauseMedia);
stop.addEventListener('click', stopMedia);
media.addEventListener('ended', stopMedia);
rwd.addEventListener('click', mediaBackward);
fwd.addEventListener('click', mediaForward);
timeWrapper.addEventListener('click', modifyTime);

media.addEventListener('click', playPauseMedia);
media.addEventListener('timeupdate', setTime);

function playPauseMedia() {
  rwd.classList.remove('active');
  fwd.classList.remove('active');
  clearInterval(intervalRwd);
  clearInterval(intervalFwd);

  if (media.paused) {
    play.setAttribute('data-icon', 'u');
    media.play();
  } else {
    play.setAttribute('data-icon', 'P');
    media.pause();
  }
}

function stopMedia() {
  media.pause();
  media.currentTime = 0;
  play.setAttribute('data-icon', 'P');

  rwd.classList.remove('active');
  fwd.classList.remove('active');
  clearInterval(intervalRwd);
  clearInterval(intervalFwd);
}

function mediaBackward() {
  clearInterval(intervalFwd);
  fwd.classList.remove('active');

  if (rwd.classList.contains('active')) {
    rwd.classList.remove('active');
    clearInterval(intervalRwd);
    media.play();
  } else {
    rwd.classList.add('active');
    media.pause();
    intervalRwd = setInterval(windBackward, 200);
  }
}

function mediaForward() {
  clearInterval(intervalRwd);
  rwd.classList.remove('active');

  if (fwd.classList.contains('active')) {
    fwd.classList.remove('active');
    clearInterval(intervalFwd);
    media.play();
  } else {
    fwd.classList.add('active');
    media.pause();
    intervalFwd = setInterval(windForward, 200);
  }
}

function windBackward() {
  if (media.currentTime <= 3) {
    stopMedia();
  } else {
    media.currentTime -= 3;
  }
}

function windForward() {
  if (media.currentTime >= media.duration - 3) {
    stopMedia();
  } else {
    media.currentTime += 3;
  }
}

function setTime() {
  let hours = Math.floor(media.currentTime / 3600);
  let minutes = Math.floor((media.currentTime - hours * 3600) / 60);
  let seconds = Math.floor(media.currentTime - minutes * 60);
  let hourValue;
  let minuteValue;
  let secondValue;

  if (hours < 10) {
    hourValue = '0' + hours;
  } else {
    hourValue = hours;
  }

  if (minutes < 10) {
    minuteValue = '0' + minutes;
  } else {
    minuteValue = minutes;
  }

  if (seconds < 10) {
    secondValue = '0' + seconds;
  } else {
    secondValue = seconds;
  }

  let mediaTime = hourValue + ':' + minuteValue + ':' + secondValue;
  timer.textContent = mediaTime;

  let barLength = timeWrapper.clientWidth * (media.currentTime / media.duration);
  timerBar.style.width = barLength + 'px';
}

/* Event handler for timeWrapper. Calculates clicked 
   position as a ratio of full duration and sets the
   current play time. */
function modifyTime(e) {
  let clickXPos = e.x;
  let timeWrapperBoundRect = timeWrapper.getBoundingClientRect();
  let timeWrapperXStart = timeWrapperBoundRect.left;
  let timeWrapperXEnd = timeWrapperBoundRect.right;

  let playRatio = (clickXPos - timeWrapperXStart) /
    (timeWrapperXEnd - timeWrapperXStart);
  let setTime = Math.floor(playRatio * media.duration);

  media.currentTime = setTime;
}