const message = document.getElementById('message');
const startBtn = document.getElementById('startBtn');
const slashBtn = document.getElementById('slashBtn');

let canDraw = false;
let playerReacted = false;
let level = 0;
let drawTime = 0;
let isGameOver = false;

const bosses = [
  { name: "Boss 1", tapTime: 800 },
  { name: "Boss 2", tapTime: 600 },
  { name: "Boss 3", tapTime: 300 },
  { name: "Boss 4", tapTime: 250 },
  { name: "Boss 5", tapTime: 150 },
  { name: "Final Boss", tapTime: 50 }
];

const gifsContainer = document.createElement('div');
document.body.appendChild(gifsContainer);

startBtn.onclick = () => {
  if (level >= bosses.length) {
    level = 0;
  }

  const currentBoss = bosses[level];
  message.textContent = `${currentBoss.name} - Get Ready...`;
  startBtn.disabled = true;
  canDraw = false;
  playerReacted = false;
  isGameOver = false;

  const delayBeforeDraw = Math.random() * 3000 + 2000;

  setTimeout(() => {
    message.textContent = 'DRAW!';
    canDraw = true;
    drawTime = performance.now();

    setTimeout(() => {
      if (!playerReacted && !isGameOver) {
        const bossTapTime = performance.now() - drawTime;
        message.textContent = `${currentBoss.name} Wins! Boss tapped in ${bossTapTime.toFixed(0)} ms.`;
        showGif('assets/kirbylose.gif');
      }
    }, currentBoss.tapTime);
  }, delayBeforeDraw);
};

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !canDraw) {
    loseGame();
  } else if (e.code === 'Space') {
    handlePlayerReact();
  }
});

slashBtn.addEventListener('click', () => {
  if (!canDraw) {
    loseGame();
  } else {
    handlePlayerReact();
  }
});

function handlePlayerReact() {
  if (canDraw) {
    const now = performance.now();
    const reactionTime = now - drawTime;
    const bossTapTime = bosses[level].tapTime;

    if (reactionTime < bossTapTime) {
      message.textContent = `You Win! You tapped in ${reactionTime.toFixed(0)} ms.`;
      showGif('assets/kirbywin.gif');
      level++;
    } else {
      message.textContent = `Too Slow! You tapped in ${reactionTime.toFixed(0)} ms, boss tapped in ${bossTapTime} ms.`;
      showGif('assets/kirbylose.gif');
    }

    playerReacted = true;
    canDraw = false;
  }
}

function loseGame() {
  message.textContent = 'Too Soon! You Lose. Try Again.';
  showGif('assets/kirbylose.gif');
  isGameOver = true;
  setTimeout(() => {
    startBtn.disabled = false;
  }, 1000);
}

function showGif(gifPath) {
  const gifElement = document.createElement('img');
  gifElement.src = gifPath;
  gifElement.style.width = '20%';
  gifsContainer.innerHTML = '';
  gifsContainer.appendChild(gifElement);

  startBtn.disabled = false;
}
