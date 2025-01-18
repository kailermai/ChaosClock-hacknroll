let realTime = 0;
let remainingTime = 0;
let imTime = 0;
let interval = null;
const timerEnd = document.getElementById("alert");

// Define constants and utility functions
var display = document.getElementById("c"),
  context = display.getContext("2d"),
  canvasWidth,
  canvasHeight,
  centerX,
  centerY,
  percentWidth = (value) => value * (canvasWidth * 0.01),
  percentHeight = (value) => value * (canvasHeight * 0.01),
  square = (num) => num * num,
  mapValue = (val, min1, max1, max2) => ((val - min1) / (max1 - min1)) * max2,
  PI = Math.PI,
  TWO_PI = PI * 2;

// Collision detection functions
var isLineIntersecting = (start, end) => {
  var gamma,
    lambda,
    lineStartX = 20,
    lineStartY = 70,
    lineEndX = 80,
    lineEndY = 70,
    pX = start.x,
    pY = start.y,
    qX = end.x,
    qY = end.y,
    determinant =
      (lineEndX - lineStartX) * (qY - pY) - (qX - pX) * (lineEndY - lineStartY);

  if (determinant === 0) return false;

  lambda =
    ((qY - pY) * (qX - lineStartX) + (pX - qX) * (qY - lineStartY)) /
    determinant;
  gamma =
    ((lineStartY - lineEndY) * (qX - lineStartX) +
      (lineEndX - lineStartX) * (qY - lineStartY)) /
    determinant;

  return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
};

var isCircleIntersecting = (circle) => {
  var deltaX = circle.position.x - 20,
    deltaY = circle.position.y - 70,
    lineVector = new Vector(60, 0),
    lineVecX = lineVector.x,
    lineVecY = lineVector.y,
    t =
      (deltaX * lineVecX + deltaY * lineVecY) /
      (lineVecX * lineVecX + lineVecY * lineVecY),
    intersectionX = 20 + lineVecX * t,
    intersectionY = 70 + lineVecY * t;

  if (t < 0) {
    intersectionX = 20;
    intersectionY = 70;
  } else if (t > 1) {
    intersectionX = 80;
    intersectionY = 70;
  }

  var distX = circle.position.x - intersectionX,
    distY = circle.position.y - intersectionY;

  return distX * distX + distY * distY < square(circle.radius);
};

// Canvas resizing
(function resizeCanvas() {
  display.width = 300;
  display.height = 300;
  canvasWidth = display.width;
  canvasHeight = display.height;
  centerX = Math.floor(canvasWidth / 2);
  centerY = Math.floor(canvasHeight / 2);
})();

// Vector class
class Vector {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  add(vector, doNotMutate) {
    if (doNotMutate) return new Vector(this.x + vector.x, this.y + vector.y);
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  copy() {
    return new Vector(this.x, this.y);
  }
}

// Ball class
class Ball {
  constructor() {
    this.acceleration = new Vector(0, 0.05);
    this.velocity = new Vector();
    this.position = new Vector(50, 70);
    this.bounceFactor = -0.7;
    this.radius = 2.5;
    this.isOnLine = true;
    this.isImmune = true;
  }

  intersectsPoint(x, y) {
    return (
      square(x - percentWidth(this.position.x)) +
        square(y - percentHeight(this.position.y)) <
      square(percentWidth(this.radius))
    );
  }

  update() {
    this.previousPosition = this.position.copy();

    if (!this.isOnLine && !dragHandler.isDragging) {
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);

      if (this.position.y > 100 - this.radius) {
        this.velocity.y *= this.bounceFactor;
        this.velocity.x *= this.bounceFactor * -1;
        this.position.y = 100 - this.radius;
      }

      if (this.position.x > 100 - this.radius) {
        this.velocity.x *= this.bounceFactor;
        this.position.x = 100 - this.radius;
      }

      if (this.position.x < this.radius) {
        this.velocity.x *= this.bounceFactor;
        this.position.x = this.radius;
      }

      if (
        !this.isImmune &&
        (isLineIntersecting(this.previousPosition, this.position) ||
          isCircleIntersecting(this))
      ) {
        this.isOnLine = true;
        this.position = new Vector(this.position.x, 70);
        this.isImmune = true;
      }
    }
  }

  render() {
    context.beginPath();
    context.arc(
      percentWidth(this.position.x),
      percentHeight(this.position.y),
      percentWidth(this.radius),
      0,
      TWO_PI
    );
    context.closePath();

    context.fillStyle = "#000";
    context.fill();
  }
}

// Drag handler
class DragHandler {
  constructor() {
    this.isDragging = false;
    this.previousMousePosition = new Vector();
    this.mouseVelocity = new Vector();

    window.addEventListener("mousemove", this.handleMouseMove.bind(this));
    window.addEventListener("mousedown", this.handleMouseDown.bind(this));
    window.addEventListener("mouseup", this.handleMouseUp.bind(this));

    window.addEventListener("touchmove", (e) =>
      this.handleMouseMove(convertTouch(e))
    );
    window.addEventListener("touchstart", (e) =>
      this.handleMouseDown(convertTouch(e))
    );
    window.addEventListener("touchend", (e) =>
      this.handleMouseUp(convertTouch(e))
    );
  }

  getMousePos(event) {
    const rect = display.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  handleMouseMove(event) {
    const { x, y } = this.getMousePos(event);

    // console.log(`Mouse position: ${x}, ${y}`); // Debugging logs for mouse position

    if (this.isDragging) {
      display.style.cursor = "grabbing";

      if (ball.isOnLine) {
        ball.position.x = (x / canvasWidth) * 100;

        if (ball.position.x > 80 || ball.position.x < 20) {
          ball.isOnLine = false;
          ball.velocity.x = this.mouseVelocity.x;
          this.stopDragging();
          setTimeout(() => (ball.isImmune = false), 100);
        }
      } else {
        ball.position.x = (x / canvasWidth) * 100;
        ball.position.y = (y / canvasHeight) * 100;

        if (
          !ball.isImmune &&
          (isLineIntersecting(ball.previousPosition, ball.position) ||
            isCircleIntersecting(ball))
        ) {
          this.stopDragging();
          ball.isOnLine = true;
          ball.position = new Vector(ball.position.x, 70);
        }
      }
    } else {
      if (ball.intersectsPoint(x, y)) {
        display.style.cursor = "grab";
      } else {
        display.style.cursor = "auto";
      }
    }

    this.mouseVelocity = new Vector(
      x - this.previousMousePosition.x,
      y - this.previousMousePosition.y
    );
    this.previousMousePosition = new Vector(x, y);
  }

  stopDragging() {
    if (this.isDragging) ball.velocity = this.mouseVelocity.copy();
    this.isDragging = false;
    display.style.cursor = "auto";
  }

  handleMouseDown(event) {
    this.stopDragging();
    const { x, y } = this.getMousePos(event);

    console.log(`Mouse Down: ${x}, ${y}`); // Debugging logs for mouse down

    if (ball.intersectsPoint(x, y)) {
      this.isDragging = true;
    }
  }

  handleMouseUp() {
    this.stopDragging();
  }
}

// Initialize components
const ball = new Ball();
const dragHandler = new DragHandler();

// Render loop
(function renderLoop() {
  requestAnimationFrame(renderLoop);
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  context.beginPath();
  context.moveTo(percentWidth(20), percentHeight(70));
  context.lineTo(percentWidth(80), percentHeight(70));
  context.closePath();

  context.strokeStyle = "#555555";
  context.stroke();

  ball.update();
  ball.render();

  realTime = ~~mapValue(ball.position.x, 20, 80, 60);
  imTime = ~~(100 - ball.position.y - 30);

  context.font = "20px Arial";
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.fillText(
    realTime + (imTime ? " + " + imTime + "i " : "") + "min",
    centerX,
    centerY
  );
})();

// Functions for displaying countdown and start button
window.onload = () => {
  document.querySelector("#start").onclick = calculate;
  document.querySelector("#reset").onclick = reset;
  document.querySelector("#stop").onclick = pauseTimer;
};

function calculate() {
  if (imTime != 0) {
    timerEnd.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
    window.alert("Put the ball back!");
  }
  if (remainingTime === 0) {
    remainingTime = realTime * 60; // Convert minutes to seconds
  }
  const endTime = new Date(new Date().getTime() + remainingTime * 1000);
  interval = setInterval(() => calculateTime(endTime), 1000);
}

function pauseTimer() {
  if (interval) {
    clearInterval(interval); // Stop the timer
    interval = null;

    // Calculate remaining time
    const currentTime = new Date();
    const endTime = new Date(new Date().getTime() + remainingTime * 1000);
    remainingTime = Math.max((endTime - currentTime) / 1000, 0);
  }
}

function calculateTime(endTime) {
  const currentTime = new Date();
  const minutes = document.querySelector("#countdown-min");
  const seconds = document.querySelector("#countdown-sec");

  // if endtime is greater than currenttime then update countdown else stop it
  if (endTime > currentTime) {
    const timeLeft = (endTime - currentTime) / 1000;
    remainingTime = timeLeft;
    minutes.innerText = Math.floor((remainingTime / 60) % 60);
    seconds.innerText = Math.floor(remainingTime % 60);
    if (seconds.innerText % 10 == 0) {
      timerEnd.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
      window.alert(
        "You have " +
          minutes.innerText +
          "minutes and " +
          seconds.innerText +
          " seconds left."
      );
    }

    if (seconds.innerText == 15) {
      window.location.replace("snooze.html");
    }
  } else {
    minutes.innerText = 0;
    seconds.innerText = 0;
    clearInterval(interval);
  }
}

function reset() {
  document.querySelector("#countdown-min").innerText = 0;
  document.querySelector("#countdown-sec").innerText = 0;
  remainingTime = 0;
  clearInterval(interval);
}
