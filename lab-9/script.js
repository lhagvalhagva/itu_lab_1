var questions = [
  { question: "Хамгийн том хөхтөн амьтан?", answer: "ХАЛИМ" },
  { question: "Хамгийн хурдан гүйдэг амьтан?", answer: "ИРВЭС" },
  { question: "Хамгийн урт хүзүүтэй амьтан?", answer: "АНААШ" },
  { question: "Хамгийн том шувуу?", answer: "ТАС" },
  { question: "Хамгийн том мөлхөгч?", answer: "АНАКОНДА" },
];

var MAX_LIVES = 5;
var ALPHABET = "АБВГДЕЁЖЗИЙКЛМНОӨПРСТУҮФХЦЧШЩЪЫЬЭЮЯ";

var currentQuestion = null;
var word = "";
var guessedLetters = [];
var remainingLives = MAX_LIVES;
var score = 0;

var canvas = document.createElement("canvas");
canvas.width = 300;
canvas.height = 300;
document.getElementById("hangman").appendChild(canvas);
var ctx = canvas.getContext("2d");

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawCircle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawHangman(stage) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 3;

  drawLine(50, 250, 250, 250);
  drawLine(100, 250, 100, 50);
  drawLine(100, 50, 200, 50);
  drawLine(200, 50, 200, 80);

  if (stage > 0) drawCircle(200, 100, 20);
  if (stage > 1) drawLine(200, 120, 200, 170);
  if (stage > 2) {
    drawLine(200, 130, 170, 150);
    drawLine(200, 130, 230, 150);
  }
  if (stage > 3) {
    drawLine(200, 170, 170, 200);
    drawLine(200, 170, 230, 200);
  }
  if (stage > 4) {
    drawLine(190, 95, 195, 100);
    drawLine(195, 95, 190, 100);
    drawLine(205, 95, 210, 100);
    drawLine(210, 95, 205, 100);
  }
}

function isLetterInWord(letter) {
  for (var i = 0; i < word.length; i++) {
    if (word[i] === letter) return true;
  }
  return false;
}

function isLetterGuessed(letter) {
  for (var i = 0; i < guessedLetters.length; i++) {
    if (guessedLetters[i] === letter) return true;
  }
  return false;
}

function getDisplayWord() {
  var display = "";
  for (var i = 0; i < word.length; i++) {
    if (isLetterGuessed(word[i])) {
      display += word[i];
    } else {
      display += "_";
    }
    display += " ";
  }
  return display;
}

function updateDisplay() {
  document.getElementById("word").textContent = getDisplayWord();
  document.getElementById("lives").textContent = "Lives: " + remainingLives;
  document.getElementById("score").textContent = "Score: " + score;
}

function createKeyboard() {
  var keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";

  for (var i = 0; i < ALPHABET.length; i++) {
    var button = document.createElement("button");
    button.textContent = ALPHABET[i];
    button.onclick = (function (letter) {
      return function () {
        handleGuess(letter);
      };
    })(ALPHABET[i]);
    keyboard.appendChild(button);
  }
}

function handleGuess(letter) {
  if (isLetterGuessed(letter)) return;

  guessedLetters.push(letter);
  disableLetterButton(letter);

  if (!isLetterInWord(letter)) {
    remainingLives--;
    drawHangman(MAX_LIVES - remainingLives);

    if (remainingLives <= 0) {
      endGame(false);
      return;
    }
  } else {
    score += 10;
  }

  updateDisplay();

  if (!getDisplayWord().includes("_")) {
    score += 50;
    endGame(true);
  }
}

function disableLetterButton(letter) {
  var buttons = document
    .getElementById("keyboard")
    .getElementsByTagName("button");
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].textContent === letter) {
      buttons[i].disabled = true;
      break;
    }
  }
}

function endGame(isWin) {
  var message = document.getElementById("message");
  var finalScore = score;

  if (isWin) {
    message.textContent = "Баяр хүргье! Та яллаа! 🎉\nТаны оноо: " + finalScore;
    message.className = "alert alert-success fs-5";
  } else {
    message.textContent = "Тоглоом дууслаа 😢\nТаны оноо: " + finalScore;
    message.className = "alert alert-danger fs-5";
  }

  disableAllButtons();
  showRestartButton();
}

function disableAllButtons() {
  var buttons = document
    .getElementById("keyboard")
    .getElementsByTagName("button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
  }
}

function showRestartButton() {
  var restartButton = document.getElementById("restart");
  restartButton.style.display = "inline-block";
}

function initializeGame() {
  currentQuestion = questions[Math.floor(Math.random() * questions.length)];
  word = currentQuestion.answer;
  guessedLetters = [];
  remainingLives = MAX_LIVES;
  score = 0;

  document.getElementById("question").textContent = currentQuestion.question;
  document.getElementById("message").textContent = "";
  document.getElementById("message").className = "alert";
  document.getElementById("restart").style.display = "none";

  drawHangman(0);
  createKeyboard();
  updateDisplay();
}

document.getElementById("restart").onclick = initializeGame;

initializeGame();
