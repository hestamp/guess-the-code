let guessWord,
  corrects = [],
  incorrects = [],
  maxGuesses,
  tipLetterArray,
  winScore = 0,
  streakScore = 0,
  diffucultySet = 1,
  chooseMode,
  wordObj,
  someArray = wordList,
  guessedArray = [],
  leftLetter,
  timer = 3,
  interval,
  timerSet = 60,
  timer30,
  timerGuessed = 0,
  timerStreak = 0,
  timerLose = 0

const inputs = document.querySelector('.inputs'),
  resetBtn = document.querySelector('.resetButton'),
  closeButton = document.querySelector('.closeButton'),
  timerButton = document.querySelector('.timerButton'),
  tipBtn = document.querySelector('.tipButton'),
  resetScoreBtn = document.querySelector('.resetScore'),
  wrappMe = document.querySelector('.wrapper'),
  timerScore = document.querySelector('.timerScore'),
  infoBlock = document.querySelector('.infoBlock'),
  linkBlock = document.querySelector('.link'),
  hintPhrase = document.querySelector('.hintPhrase span'),
  winTimer = document.querySelector('.winTimer span'),
  streakTimer = document.querySelector('.streakTimer span'),
  loseTimer = document.querySelector('.loseTimer span'),
  linkHelper = document.getElementById('showLink'),
  wrongLetters = document.querySelector('.wrongLetters span'),
  taskBlock = document.querySelector('.taskText'),
  winStat = document.querySelector('.winGames span'),
  streakStat = document.querySelector('.winStrick span'),
  guessesLeft = document.querySelector('.leftTries span'),
  typeInput = document.querySelector('.typingInput'),
  levels = document.querySelectorAll('.levels button')

levels[0].classList.add('active')
//timer func
function goTimer() {
  taskBlock.innerText = 'Timer is started. You have 60 seconds. Hurry up!'
  hintPhrase.innerText = `Ready?`
  timerButton.innerText = `⧓`
  timerButton.classList.add('not')
  timerButton.disabled = true
  timerGuessed = 0
  timerStreak = 0
  timerLose = 0
  wordList.concat(guessedArray)
  someArray.concat(guessedArray)

  interval = setInterval(() => {
    if (timer > 0) {
      hintPhrase.innerText = timer--
    } else {
      clearInterval(interval)
      randomWord()
      timer = 3
      timer30 = setInterval(() => {
        if (timerSet > 10) {
          timerButton.innerText = timerSet--
        } else if (timerSet > 0) {
          timerButton.classList.add('active')
          timerButton.innerText = timerSet--
        } else {
          clearInterval(timer30)
          timerButton.classList.remove('active', 'not')
          timerButton.innerText = `0`
          timerSet = 60
          timerScore.classList.add('active')
          winTimer.innerText = timerGuessed
          streakTimer.innerText = timerStreak
          loseTimer.innerText = timerLose
        }
      }, 1000)
    }
  }, 1000)
}

function levelSelect() {
  for (let i = 0; i < levels.length; i++) {
    levels[i].classList.remove('active')
  }
  diffucultySet = parseInt(this.dataset.lvl)
  this.classList.toggle('active')
  wrappMe.classList.remove('active', 'wrong')
  randomWord()
}

// getting word from array from words.js
function randomWord() {
  if (localStorage) {
    winScore = localStorage.getItem('wins')
    streakScore = localStorage.getItem('streak')
    winStat.innerText = winScore || 0
    streakStat.innerText = streakScore || 0
  }
  wrappMe.classList.remove('active', 'wrong')
  linkBlock.classList.remove('active')
  //filtration and map new array based on choosen lvl
  chooseMode = someArray
    .filter((level) => level.hard === diffucultySet
    )
  if (chooseMode.length > 0) {
    //getting random from choosen array lvl
    wordObj = chooseMode[
      Math.floor(Math.random() * chooseMode.length)
    ]
    console.log(
      `Word - ${wordObj.word}. Difficult level is: ${diffucultySet}. Array have ${chooseMode.length} positions `
    )
    guessWord = wordObj.word
    maxGuesses = 5
    incorrects = []
    corrects = []
    tipLetterArray = guessWord.split('')
    //based on a length ow words generates input blocks
    let html = ''
    for (let i = 0; i < guessWord.length; i++) {
      html += '<input class="input"type="text" disabled />'
    }
    linkHelper.href = wordObj.helper
    hintPhrase.innerText = wordObj.hint
    guessesLeft.innerText = maxGuesses
    wrongLetters.innerText = incorrects
    taskBlock.innerText = wordObj.task
    inputs.innerHTML = html

    if (guessWord.length < 3) {
      tipBtn.classList.add('active')
      tipBtn.disabled = true
    } else {
      tipBtn.classList.remove('active')
      tipBtn.disabled = false
    }
  } else {
    //restart page after all guessed
    hintPhrase.innerText = `Thats all. Realoading...`
    wrappMe.classList.add('active')
    setTimeout(function () {
      location.reload(true)
    }, 3000)
  }
}

randomWord()
//new code button
function newCodeButt() {
  randomWord()
  streakScore = 0
  streakStat.innerText = streakScore
  localStorage.setItem('streak', '0')
}
//all guessed function
function ifAllGuessed() {
  setTimeout(() => {
    if (corrects.length === guessWord.length) {
      wrappMe.classList.add('active')
      hintPhrase.innerText = wordObj.guessed
      someArray.splice(someArray.indexOf(wordObj), 1)

      setTimeout(function () {
        randomWord()
        clearTimeout
      }, 1000)
      timerGuessed++
      winScore++
      streakScore++
      timerStreak++
      localStorage.setItem('wins', `${winScore}`)
      localStorage.setItem('streak', `${streakScore}`)
      winStat.innerText = winScore
      streakStat.innerText = streakScore
    } else if (maxGuesses < 1 && timerSet > 59) {
      //if no tries left
      streakScore = 0
      streakStat.innerText = streakScore
      wrappMe.classList.add('wrong')
      linkBlock.classList.add('active')
      hintPhrase.innerText = wordObj.guessed
      localStorage.setItem('streak', '0')
      for (let i = 0; i < guessWord.length; i++) {
        inputs.querySelectorAll('input')[i].value = guessWord[i]
      }
    } else if (timerSet < 59 && maxGuesses < 1) {
      //if timer ticking
      timerStreak = 0
      timerLose++
      hintPhrase.innerText = wordObj.guessed
      for (let i = 0; i < guessWord.length; i++) {
        inputs.querySelectorAll('input')[i].value = guessWord[i]
      }
      wrappMe.classList.add('wrong')
      setTimeout(function () {
        randomWord()
        clearTimeout
      }, 1000)
    }
  })
}
//pushing guessed to the inputs
function initGame(e) {
  let key = e.target.value.toLowerCase()
  if (
    key.match(/^[A-Za-z]+$/) &&
    !incorrects.includes(` ${key}`) &&
    !corrects.includes(key) &&
    maxGuesses > 0
  ) {
    if (guessWord.includes(key)) {
      for (let i = 0; i < guessWord.length; i++) {
        if (guessWord[i] === key) {
          corrects.push(key)
          inputs.querySelectorAll('input')[i].value = key
        }
      }
    } else {
      maxGuesses-- //decrement by 1
      guessesLeft.innerText = maxGuesses
      incorrects.push(` ${key}`)
    }
    wrongLetters.innerText = incorrects
  }
  typeInput.value = ''
  ifAllGuessed()
}

function tipPlease() {
  if (maxGuesses > 3 && guessWord.length > 2) {
    //Hints filtration from corrects
    leftLetter = tipLetterArray.filter((x) => corrects.indexOf(x) == -1)
    //Getting random letter from word array exept guessed
    let tipLetterPick =
      leftLetter[Math.floor(Math.random() * leftLetter.length)]
    maxGuesses = maxGuesses - 2
    tipBtn.classList.add('active')
    //pushing hint to the inputs
    if (guessWord.includes(tipLetterPick)) {
      for (let i = 0; i < guessWord.length; i++) {
        if (guessWord[i] === tipLetterPick) {
          corrects.push(tipLetterPick)
          inputs.querySelectorAll('input')[i].value = tipLetterPick
        }
      }
    }
  } else {
    tipBtn.classList.add('active')
  }
  if (corrects.length === guessWord.length) {
    ifAllGuessed()
  }
}
// reset score func
function clearData() {
  localStorage.clear()
  winScore = 0
  streakScore = 0
  winStat.innerText = winScore
  streakStat.innerText = streakScore
}

function closeScore() {
  timerButton.disabled = false
  timerScore.classList.remove('active')
  timerButton.innerText = `⧗`
}
//all clickers and input with focusing typing
resetBtn.addEventListener('click', newCodeButt)
closeButton.addEventListener('click', closeScore)
timerButton.addEventListener('click', goTimer)
resetScoreBtn.addEventListener('click', clearData)
tipBtn.addEventListener('click', tipPlease)
typeInput.addEventListener('input', initGame)
inputs.addEventListener('click', () => typeInput.focus())
document.addEventListener('keydown', () => typeInput.focus())
for (let i = 0; i < levels.length; i++) {
  levels[i].addEventListener('click', levelSelect)
}
