
document.addEventListener('DOMContentLoaded', () => {
let total = 0;
const maxScore = 501;
const playerLastTurn = {};
let activePlayer = '';
const progressBar = document.getElementById('progress');
const playerContainer = document.getElementById('players');

function addMilestones() {
  const bar = document.getElementById('bar');
  [100, 200, 300, 400, 500].forEach(value => {
    const div = document.createElement('div');
    div.className = 'milestone';
    div.style.left = `${value / maxScore * 100}%`;
    bar.appendChild(div);
  });
}

function updateUI() {
  progressBar.style.width = `${Math.min(total / maxScore * 100, 100)}%`;
  document.getElementById('scoreTotal').textContent = `${total} / ${maxScore}`;

  playerContainer.innerHTML = '';
  Object.entries(playerLastTurn).forEach(([name, scores]) => {
    const div = document.createElement('div');
    div.className = 'player-entry';
    div.innerHTML = `<strong>${name}</strong>`;
    scores.forEach(score => {
      const pill = document.createElement('span');
      pill.className = 'score-pill';
      pill.textContent = score;
      div.appendChild(pill);
    });
    playerContainer.appendChild(div);
  });
}

function showVictory() {
  const victory = document.createElement('div');
  victory.id = 'victory';
  victory.innerHTML = `<div>🎯 Victoire !</div>`;

  const restartBtn = document.createElement('button');
  restartBtn.textContent = 'Recommencer';
  restartBtn.addEventListener('click', restart);

  const quitBtn = document.createElement('button');
  quitBtn.textContent = 'Quitter';
  quitBtn.addEventListener('click', () => {
    window.close();
    setTimeout(() => alert("Fermez l'onglet manuellement si nécessaire."), 500);
  });

  victory.appendChild(restartBtn);
  victory.appendChild(quitBtn);
  document.body.appendChild(victory);
}

function restart() {
  total = 0;
  Object.keys(playerLastTurn).forEach(p => playerLastTurn[p] = []);
  document.getElementById('victory')?.remove();
  updateUI();
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'infernal_bar_score') {
    const { player, scores } = msg;
    const sum = scores.reduce((a, b) => a + b, 0);

    total += sum;
    activePlayer = player;

    // Écrase les anciens scores du joueur pour ce nouveau tour
    playerLastTurn[player] = [...scores];

    updateUI();

    if (total >= maxScore && !document.getElementById('victory')) {
      showVictory();
    }
  }
});

addMilestones();
});
