let totalTime = 0
let timerInterval
let questionInterval = 10
let highScore = []
let highScoreNames = []
let name
let responseURL
let url = 'http://vhost3.lnu.se:20080/question/1'
let multipleAnswer = false
let questionTime
let playing = false

if (window.localStorage.getItem('score') === null) {
  highScore = ['empty', 'empty', 'empty', 'empty', 'empty']
  highScoreNames = ['empty', 'empty', 'empty', 'empty', 'empty']
  window.localStorage.setItem('highScoreNames', JSON.stringify(highScoreNames))
  window.localStorage.setItem('score', JSON.stringify(highScore))
  // addToWebStorage()
} else {
  highScore = JSON.parse(window.localStorage.getItem('score'))
  highScoreNames = JSON.parse(window.localStorage.getItem('highScoreNames'))
}

let buttonGetName = document.querySelector('#getName')

buttonGetName.addEventListener('click', jsGetName)

function jsGetName () {
  initQuestion()
  name = document.getElementById('input1').value
  let currentName = document.querySelector('#currentName')
  currentName.innerHTML = 'current name: ' + name
}

// function that increments totalTime so we can keep track on total the total time a user
// have used on the game.

function addToWebStorage (number, fncName) {
  let emptyList = true
  for (let i = 0; i <= 4; i++) {
    let tmp
    let tmpName
    if (highScore[i] > number || (highScore[i] === 'empty' && emptyList)) {
      if (highScore[i] === 'empty') {
        emptyList = false
      }
      tmpName = highScoreNames[i]
      highScoreNames[i] = fncName
      fncName = tmpName
      tmp = highScore[i]
      highScore[i] = number
      number = tmp
      window.localStorage.setItem('highScoreNames', JSON.stringify(highScoreNames))
      window.localStorage.setItem('score', JSON.stringify(highScore))
    }
  }
}

// function that initiate the game
function initQuestion () {
  if (!playing) {
    playing = true
    multipleAnswer = false
    questionTime = 0
    totalTime = 0
    totalTimeFunc()
    window.fetch(url)
      .then(res => res.json())
      .then(data => {
        responseURL = data.nextURL
        let output = '<div id="questionContainer"><h2>Question</h2>'
        output += data.question
        output += '<div><input id="answer" type="text"></div>'
        output += '<button id="submitAnswer">Submit Answer</button></div>'
        document.getElementById('output').innerHTML = output
        document.getElementById('submitAnswer').addEventListener('click', postAnswer)
      })
  } else {
    // do nothing, game in progress
  }
}

// function that takes the answer from the user and decides what what to do with the answer
function postAnswer () {
  let answerUser
  if (multipleAnswer) {
    answerUser = document.querySelector('input[name="answer"]:checked').value
  } else {
    answerUser = document.getElementById('answer').value
  }
  window.fetch(responseURL, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ answer: answerUser })
  })
    .then(result => result.json())
    .then(data => {
      clearTimeout(questionInterval)
      if (data.message === 'Correct answer!' && data.nextURL === undefined) {
        addToWebStorage(totalTime, name)
        console.log('finished game')
        finishGame()
      } else if (data.message === 'Correct answer!') {
        nextQuestion(data.nextURL)
      } else {
        lostGame()
      }
    })
}

// function that loads the next question and outputs it for the player
function nextQuestion (startURL) {
  clearInterval(timerInterval)
  totalTimeFunc()
  questionTime = 0
  window.fetch(startURL)
    .then(res => res.json())
    .then(data => {
      responseURL = data.nextURL
      let output = '<div id="questionContainer"><h2>Question</h2>'
      output += data.question
      if (data.alternatives !== undefined) {
        multipleAnswer = true
        for (let alt in data.alternatives) {
          let radioQuestion = data.alternatives[alt]
          output += '<p>' + radioQuestion + '</p>'
          output += '<input type="radio" name="answer" value=' + alt + '>'
        }
      } else {
        multipleAnswer = false
        output += '<div><input id="answer" type="text"></div>'
      }
      output += '<button id="submitAnswer">Submit Answer</button></div>'
      document.getElementById('output').innerHTML = output
      document.getElementById('submitAnswer').addEventListener('click', postAnswer)
    })
}

// function that sets the lost game output for the player
function lostGame () {
  clearInterval(timerInterval)
  playing = false
  let output = '<div id="questionContainer"><h2>You lost!</h2>'
  // output += '<button id="playAgain">Play again</button>'
  document.getElementById('output').innerHTML = output
  // document.getElementById('playAgain').addEventListener('click', initQuestion)
}

// function that shows the highscore and finishes the game
function finishGame () {
  clearInterval(timerInterval)
  playing = false
  let output = '<div id="questionContainer"><h2>You won!</h2>'
  output += '<h3>High score</h3>'
  for (let i = 0; i <= 4; i++) {
    output += '<p>' + highScoreNames[i] + ':' + highScore[i] + '</p>'
  }
  document.getElementById('output').innerHTML = output
}

// Timer function that checks totaltime and the amount for every question
function totalTimeFunc () {
  timerInterval = setInterval(function () {
    totalTime++
    questionTime++
    document.querySelector('#totalTime').innerHTML = 'total time = ' + totalTime
    document.querySelector('#questionTime').innerHTML = 'remaining time = ' + (20 - questionTime)
    if (questionTime === 20) {
      lostGame()
    }
  }, 1000)
}
