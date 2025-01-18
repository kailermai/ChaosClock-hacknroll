window.onload = () => {
  document.querySelector("#start").onclick = calculate;
};

function calculate() {
  const time = document.querySelector("#time").value;
  const endTime = new Date(date + " " + time);
  const interval = setInterval(() => calculateTime(endTime), 1000);
}

function calculateTime(endTime) {
  const currentTime = new Date();

  const minutes = document.querySelector("#countdown-min");
  const seconds = document.querySelector("#countdown-sec");

  // if endtime is greater than currenttime then update countdown else stop it
  if (endTime > currentTime) {
    const timeLeft = (endTime - currentTime) / 1000;

    // console.log(timeLeft);
    minutes.innerText = Math.floor((timeLeft / 60) % 60);
    seconds.innerText = Math.floor(timeLeft % 60);
  } else {
    minutes.innerText = 0;
    seconds.innerText = 0;
  }
}
