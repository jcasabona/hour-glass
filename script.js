const canvas = document.getElementById("hourglass");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startButton");

canvas.width = 300;
canvas.height = 600;

let particles = [];
let started = false;
let startTime = null;
let duration = 60000; // 1 minute
let lastTimestamp = null;

// Positions
const topSandStartHeight = 100;
let topSandHeight = topSandStartHeight;
let bottomSandHeight = 0;

function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGlass();
  drawSand();
  updateParticles();
  drawParticles();

  if (started) {
    const elapsed = Date.now() - startTime;
    if (elapsed < duration) {
      const progress = elapsed / duration;
      topSandHeight = topSandStartHeight * (1 - progress);
      bottomSandHeight = 80 * progress; // triangle height
      if (Math.random() < 0.7) createParticles(2);
      requestAnimationFrame(drawFrame);
    }
  }
}

function drawGlass() {
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(50, 50);
  ctx.lineTo(150, 300);
  ctx.lineTo(250, 50);
  ctx.moveTo(50, 550);
  ctx.lineTo(150, 300);
  ctx.lineTo(250, 550);
  ctx.stroke();
}

function drawSand() {
  // Top sand (rectangle that shrinks)
  ctx.fillStyle = "goldenrod";
  ctx.fillRect(100, 100, 100, topSandHeight);

  // Bottom sand (triangle that grows)
  ctx.beginPath();
  ctx.moveTo(120, 500);
  ctx.lineTo(180, 500);
  ctx.lineTo(150, 500 - bottomSandHeight);
  ctx.closePath();
  ctx.fill();
}

function createParticles(count) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: 150 + Math.random() * 4 - 2,
      y: 290 + Math.random() * 10,
      vx: Math.random() * 0.5 - 0.25,
      vy: 1 + Math.random() * 1,
      life: 50
    });
  }
}

function updateParticles() {
  particles.forEach(p => {
    p.vy += 0.1; // gravity
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;

    // Stop at top of pile
    if (p.y > 500 - bottomSandHeight) {
      p.vx = 0;
      p.vy = 0;
    }
  });
  particles = particles.filter(p => p.life > 0);
}

function drawParticles() {
  ctx.fillStyle = "goldenrod";
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function startTimer() {
  if (started) return;
  started = true;
  startTime = Date.now();
  topSandHeight = topSandStartHeight;
  bottomSandHeight = 0;
  particles = [];
  drawFrame();
}

function setupOrientationListener() {
  window.addEventListener("deviceorientation", (event) => {
    if (event.beta < -150 || event.beta > 150) {
      startTimer();
    } else if (event.beta > -30 && event.beta < 30) {
      started = false;
      particles = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGlass();
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

drawGlass();
drawSand();
