// Juego Concurso de Moda
// Autor: Generado por IA

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const scoreScreen = document.getElementById('score-screen');
const playBtn = document.getElementById('play-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const photoBtn = document.getElementById('photo-btn');

// Paleta de tonos de piel
const skinColors = ['#fdd5b4', '#f8c8b0', '#c98f6a', '#8d5524'];

// Escenarios del concurso
const scenarios = [
  {
    name: 'Gala',
    background: 'linear-gradient(#ffe0f0,#fff)',
    palette: {
      outfit: ['#c62828', '#ad1457', '#6a1b9a'],
      accessory: ['#fbc02d', '#ef5350', '#ab47bc'],
      hair: ['#4e342e', '#6d4c41', '#000000']
    }
  },
  {
    name: 'Playa',
    background: 'linear-gradient(#80d8ff,#fff)',
    palette: {
      outfit: ['#ffeb3b', '#ff9800', '#4dd0e1'],
      accessory: ['#ff5722', '#fff176', '#26a69a'],
      hair: ['#ffcc80', '#a1887f', '#3e2723']
    }
  },
  {
    name: 'Fiesta',
    background: 'linear-gradient(#fce4ec,#fff)',
    palette: {
      outfit: ['#e91e63', '#f44336', '#9c27b0'],
      accessory: ['#ffeb3b', '#ff5722', '#ab47bc'],
      hair: ['#000000', '#ce93d8', '#ff80ab']
    }
  }
];

const categories = ['outfit', 'accessory', 'hair'];
let stage = 'skin';
let currentScenario = 0;
let currentCategory = 0;
let selections = []; // selección por escenario

playBtn.addEventListener('click', () => {
  stage = 'skin';
  startScreen.classList.remove('active');
  gameScreen.classList.add('active');
  loadSkin();
});

nextBtn.addEventListener('click', () => {
  if (stage === 'skin') {
    stage = 'scenario';
    startScenario();
    return;
  }
  if (currentCategory < categories.length - 1) {
    currentCategory++;
    loadCategory();
  } else {
    currentScenario++;
    if (currentScenario < scenarios.length) {
      currentCategory = 0;
      startScenario();
    } else {
      endGame();
    }
  }
});

restartBtn.addEventListener('click', () => {
  scoreScreen.classList.remove('active');
  startScreen.classList.add('active');
  selections = [];
  currentScenario = 0;
  currentCategory = 0;
});

photoBtn.addEventListener('click', () => {
  // Método sencillo para capturar pantalla
  window.print();
});

function loadSkin() {
  document.getElementById('scenario-title').textContent = 'Personaliza tu avatar';
  document.getElementById('category-title').textContent = 'Elige tu tono de piel';
  const list = document.getElementById('item-list');
  list.innerHTML = '';
  skinColors.forEach(color => {
    const div = document.createElement('div');
    div.className = 'item';
    div.style.background = color;
    div.addEventListener('click', () => {
      document.querySelector('#avatar .body').style.background = color;
      playSelectSound();
    });
    list.appendChild(div);
  });
}

function startScenario() {
  const sc = scenarios[currentScenario];
  document.getElementById('scenario-title').textContent = sc.name;
  document.body.style.background = sc.background;
  selections[currentScenario] = {};
  loadCategory();
}

function loadCategory() {
  const category = categories[currentCategory];
  document.getElementById('category-title').textContent = 'Elige ' + category;
  const list = document.getElementById('item-list');
  list.innerHTML = '';
  const pal = scenarios[currentScenario].palette[category];
  pal.forEach(color => {
    const div = document.createElement('div');
    div.className = 'item';
    div.style.background = color;
    div.addEventListener('click', () => {
      applyItem(category, color);
      selections[currentScenario][category] = color;
      playSelectSound();
    });
    list.appendChild(div);
  });
}

function applyItem(category, color) {
  const avatar = document.getElementById('avatar');
  if (category === 'outfit') {
    const el = avatar.querySelector('.outfit');
    el.style.background = color;
    el.style.opacity = 1;
  }
  if (category === 'hair') {
    avatar.querySelector('.hair').style.background = color;
  }
  if (category === 'accessory') {
    const acc = avatar.querySelector('.accessory');
    acc.style.background = color;
    acc.style.opacity = 1;
  }
}

function endGame() {
  gameScreen.classList.remove('active');
  scoreScreen.classList.add('active');
  const scores = [];
  for (let j = 0; j < 3; j++) {
    const base = calculateScore();
    const judgeScore = Math.max(0, Math.min(100, base + (Math.random() * 20 - 10)));
    scores.push(judgeScore);
    const judgeEl = document.getElementById('judge' + (j + 1));
    judgeEl.querySelector('.judge-score').textContent = judgeScore.toFixed(0);
    judgeEl.querySelector('.face').textContent =
      judgeScore > 80 ? '😄' : judgeScore > 60 ? '😊' : judgeScore > 40 ? '😐' : '😞';
  }
  const total = scores.reduce((a, b) => a + b, 0) / scores.length;
  document.getElementById('total-score').textContent = 'Puntuación total: ' + total.toFixed(0);
}

function calculateScore() {
  let score = 60;
  selections.forEach((sel, idx) => {
    const pal = scenarios[idx].palette;
    categories.forEach(cat => {
      if (sel[cat]) {
        score += 5;
        if (sel[cat] === pal[cat][0]) score += 5; // mejor elección
      }
    });
  });
  return score;
}

// efecto sonoro simple
function playSelectSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 660;
  gain.gain.value = 0.05;
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}
