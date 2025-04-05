const canvas = document.getElementById("hourglass");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startButton");

canvas.width = 300;
canvas.height = 600;

let started = false;
let startTime = null;
let duration = 60000;

let topProgress = 1;
let bottomProgress = 0;

function drawSand() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "goldenrod";

  // Top sand (inverted triangle)
  if (topProgress > 0) {
    ctx.beginPath();
    ctx.moveTo(100, 120);
    ctx.lineTo(200, 120);
    ctx.lineTo(150, 120 + 100 * topProgress);
    ctx.closePath();
    ctx.fill();
  }

  // Bottom sand (triangle growing up)
  if (bottomProgress > 0) {
    ctx.beginPath();
    ctx.moveTo(120, 500);
    ctx.lineTo(180, 500);
    ctx.lineTo(150, 500 - 80 * bottomProgress);
    ctx.closePath();
    ctx.fill();
  }

  // Sand stream connecting top and bottom
  if (started && topProgress > 0) {
    ctx.fillRect(148.5, 220, 3, 280);
  }
}

function drawFrame() {
  drawSand();

  if (started) {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    topProgress = 1 - progress;
    bottomProgress = progress;

    if (progress < 1) {
      requestAnimationFrame(drawFrame);
    }
  }
}

function startTimer() {
  if (started) return;
  started = true;
  startTime = Date.now();
  topProgress = 1;
  bottomProgress = 0;
  drawFrame();
}

function setupOrientationListener() {
  window.addEventListener("deviceorientation", (event) => {
    if (event.beta < -150 || event.beta > 150) {
      startTimer();
    } else if (event.beta > -30 && event.beta < 30) {
      started = false;
      drawSand();
    }
  });
}

startBtn.addEventListener("click", async () => {
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    try {
      const response = await DeviceMotionEvent.requestPermission();
      if (response === "granted") {
        setupOrientationListener();
        startBtn.style.display = "none";
      }
    } catch (e) {
      alert("Motion permission denied");
    }
  } else {
    setupOrientationListener();
    startBtn.style.display = "none";
  }
});

drawSand();
