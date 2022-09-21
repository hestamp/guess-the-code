let guessWord,
  corrects = [],
  incorrects = [],
  maxGuesses,
  tipLetterArray,
  winScore = 0,
  streakScore = 0,
  diffuculty,
  diffucultySet = 1,
  chooseMode,
  wordObj,
  someArray = wordList,
  indexWord,
  hintPhraser,
  guessed,
  leftLetter

const inputs = document.querySelector('.inputs'),
  resetBtn = document.querySelector('.resetButton'),
  easyBtn = document.querySelector('.easyButton'),
  infoButton = document.querySelector('.infoButton'),
  medBtn = document.querySelector('.medButton'),
  hardBtn = document.querySelector('.hardButton'),
  tipBtn = document.querySelector('.tipButton'),
  resetScoreBtn = document.querySelector('.resetScore'),
  wrappMe = document.querySelector('.wrapper'),
  infoBlock = document.querySelector('.infoBlock'),
  linkBlock = document.querySelector('.link'),
  hintPhrase = document.querySelector('.hintPhrase span'),
  linkHelper = document.getElementById('showLink'),
  wrongLetters = document.querySelector('.wrongLetters span'),
  taskBlock = document.querySelector('.taskText'),
  winStat = document.querySelector('.winGames span'),
  streakStat = document.querySelector('.winStrick span'),
  guessesLeft = document.querySelector('.leftTries span'),
  typeInput = document.querySelector('.typingInput')

winStat.innerText = winScore
streakStat.innerText = streakScore
easyBtn.classList.add('active')
//functions for levels
function levelPickEasy() {
  if (easyBtn.classList.length < 2) {
    easyBtn.classList.add('active')
    medBtn.classList.remove('active')
    hardBtn.classList.remove('active')
    wrappMe.classList.remove('active', 'wrong')
    diffucultySet = 1
    randomWord()
  }
}
function levelPickMed() {
  if (medBtn.classList.length < 2) {
    easyBtn.classList.remove('active')
    medBtn.classList.add('active')
    hardBtn.classList.remove('active')
    wrappMe.classList.remove('active', 'wrong')
    diffucultySet = 2
    randomWord()
  }
}
function levelPickHard() {
  if (hardBtn.classList.length < 2) {
    easyBtn.classList.remove('active')
    medBtn.classList.remove('active')
    hardBtn.classList.add('active')
    wrappMe.classList.remove('active', 'wrong')
    diffucultySet = 3
    randomWord()
  }
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
  //filtration and map new array based on choosed lvl
  chooseMode = someArray
    .filter(function (level) {
      let dif = diffucultySet

      return level.hard === dif
    })
    .map(function (level) {
      return level
    })
  if (chooseMode.length > 0) {
    //getting random from choosen array lvl
    wordObj = chooseMode[Math.floor(Math.random() * chooseMode.length)]
    console.log(
      `Word - ${wordObj.word}. Difficult level is: ${diffucultySet}. Array have ${chooseMode.length} positions `
    )
    indexWord = someArray.indexOf(wordObj)
    guessWord = wordObj.word
    guessed = wordObj.guessed
    maxGuesses = 5
    incorrects = []
    corrects = []
    hintPhraser = wordObj.hint
    tipLetterArray = guessWord.split('')
    //based on a length ow words generates input blocks
    let html = ''
    for (let i = 0; i < guessWord.length; i++) {
      html += '<input class="input"type="text" disabled />'
    }
    linkHelper.href = wordObj.helper
    hintPhrase.innerText = hintPhraser
    guessesLeft.innerText = maxGuesses
    wrongLetters.innerText = incorrects
    taskBlock.innerText = wordObj.task
    inputs.innerHTML = html
    tipBtn.classList.remove('active')
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
function resetButtonFun() {
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
      hintPhrase.innerText = guessed
      someArray.splice(indexWord, 1)

      setTimeout(function () {
        randomWord()
        clearTimeout
      }, 1000)

      winScore++
      streakScore++
      localStorage.setItem('wins', `${winScore}`)
      localStorage.setItem('streak', `${streakScore}`)
      winStat.innerText = winScore
      streakStat.innerText = streakScore
    } else if (maxGuesses < 1) {
      wrappMe.classList.add('wrong')
      linkBlock.classList.add('active')
      hintPhrase.innerText = guessed
      streakScore = 0
      streakStat.innerText = streakScore
      localStorage.setItem('streak', '0')
      for (let i = 0; i < guessWord.length; i++) {
        inputs.querySelectorAll('input')[i].value = guessWord[i]
      }
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
  if (maxGuesses > 3 && !corrects.includes(tipLetterArray)) {
    //Hints filtration from corrects
    leftLetter = tipLetterArray.filter((x) => corrects.indexOf(x) == -1)
    //Getting random letter from word array exept guessed
    let tipLetterPick =
      leftLetter[Math.floor(Math.random() * leftLetter.length)]
    maxGuesses = maxGuesses - 2
    tipBtn.classList.add('active')
    guessesLeft.innerText = `${maxGuesses} (no hints)`
    //pushing hint to the inputs
    if (guessWord.includes(tipLetterPick)) {
      for (let i = 0; i < guessWord.length; i++) {
        if (guessWord[i] === tipLetterPick) {
          corrects.push(tipLetterPick)
          inputs.querySelectorAll('input')[i].value = tipLetterPick
          if (corrects.length === guessWord.length) {
            ifAllGuessed()
          }
        }
      }
    }
  } else {
    tipBtn.classList.add('active')
    guessesLeft.innerText = `${maxGuesses} (no tips)`
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
//open info button
function openInfo() {
  if ((infoButton.id = 1)) {
    infoBlock.classList.add('active')
    infoButton.classList.add('active')
    infoButton.innerText = 'x'
    infoButton.id = 2
  } else if ((infoButton.id = 2)) {
    infoBlock.classList.remove('active')
    infoButton.classList.remove('active')
    infoButton.innerText = 'i'
    infoButton.id = 1
  }
}
//all clickers and input with focusing typing
resetBtn.addEventListener('click', resetButtonFun)
infoButton.addEventListener('click', openInfo)
easyBtn.addEventListener('click', levelPickEasy)
medBtn.addEventListener('click', levelPickMed)
hardBtn.addEventListener('click', levelPickHard)
resetScoreBtn.addEventListener('click', clearData)
tipBtn.addEventListener('click', tipPlease)
typeInput.addEventListener('input', initGame)
inputs.addEventListener('click', () => typeInput.focus())
document.addEventListener('keydown', () => typeInput.focus())
