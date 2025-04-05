const canvas = document.getElementById('hourglass');
const ctx = canvas.getContext('2d');

canvas.width = 300;
canvas.height = 600;

let particles = [];
let started = false;
let startTime;

function drawHourglass() {
  ctx.strokeStyle = '#333';
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

function createParticles(count) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: 150 + Math.random() * 20 - 10,
      y: 150 + Math.random() * 20 - 10,
      vx: Math.random() * 1 - 0.5,
      vy: 0,
      life: Math.random() * 60
    });
  }
}

function updateParticles() {
  particles.forEach(p => {
    p.vy += 0.1; // gravity
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
  });
  particles = particles.filter(p => p.life > 0 && p.y < 450);
}

function drawParticles() {
  ctx.fillStyle = 'goldenrod';
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawHourglass();
  updateParticles();
  drawParticles();

  if (Date.now() - startTime < 60000) {
    requestAnimationFrame(animate);
    if (Math.random() < 0.8) createParticles(2);
  }
}

function startTimer() {
  if (started) return;
  started = true;
  startTime = Date.now();
  animate();
}

window.addEventListener('deviceorientation', (event) => {
  if (event.beta < -150 || event.beta > 150) {
    startTimer();
  } else if (event.beta > -30 && event.beta < 30) {
    started = false;
    particles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHourglass();
  }
});

drawHourglass();
