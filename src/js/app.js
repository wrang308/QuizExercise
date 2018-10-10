let totalTime = 0
let timerInterval
let questionInterval
let highScore = []
let highScoreNames = []
let name
let responseURL
let url = 'http://vhost3.lnu.se:20080/question/1'
let multipleAnswer = false
let questionTime = 0
let newQuestion

if (window.localStorage.getItem('score') === null) {
  console.log('initializing array')
  highScore = [9999, 9999, 9999, 9999, 9999]
  highScoreNames = ['empty', 'empty', 'empty', 'empty', 'empty']
} else {
  highScore = JSON.parse(window.localStorage.getItem('score'))
}

// highScore[0] = window.prompt('New member name?')
// window.localStorage.setItem('score', JSON.stringify(highScore))

highScoreNames = JSON.parse(window.localStorage.getItem('highScoreNames'))

// ...
var storedScores = JSON.parse(window.localStorage.getItem('score'))
var storedNames = JSON.parse(window.localStorage.getItem('highScoreNames'))

console.log(storedScores)
console.log(storedNames)
var buttonGetName = document.querySelector('#getName')

buttonGetName.addEventListener('click', jsGetName)

var buttonReset = document.querySelector('#reset')

buttonReset.addEventListener('click', jsReset)

function jsReset () {
  highScore = [9999, 9999, 9999, 9999, 9999]
  highScoreNames = ['empty', 'empty', 'empty', 'empty', 'empty']
  window.localStorage.setItem('score', JSON.stringify(highScore))
  window.localStorage.setItem('highScoreNames', JSON.stringify(highScoreNames))
}

function jsGetName () {
  name = document.getElementById('input1').value
  var currentName = document.querySelector('#currentName')
  currentName.innerHTML = 'current name: ' + name
  console.log(name)
  console.log(totalTime)
  console.log('jsGetName = ' + totalTime)
  // addToWebStorage(totalTime, name)
  // clearInterval(timerInterval)

  // document.location.href = 'game.html'
}
// function that increments totalTime so we can keep track on total the total time a user
// have used on the game.

function addToWebStorage (number, fncName) {
  for (var i = 0; i <= 4; i++) {
    /** if (window.localStorage[i] > number) {
      console.log('number = ' + number.toString())
    } else {
      window.localStorage[i] = number
    } */
    var tmp
    var tmpName
    if (highScore[i] > number) {
      tmpName = highScoreNames[i]
      highScoreNames[i] = fncName
      fncName = tmpName
      // s
      tmp = highScore[i]
      highScore[i] = number
      number = tmp
      window.localStorage.setItem('highScoreNames', JSON.stringify(highScoreNames))
      window.localStorage.setItem('score', JSON.stringify(highScore))
    }
  }
}

/** function timer (var time) {
  setInterval(function (time) {
    if(time === 0){
      return false
    }
    else {
      time = time - 1
    }
  },1000);

}
 **/

function initQuestion () {
  // questionTime = 0
  window.fetch(url)
    .then(res => res.json())
    .then(data => {
      responseURL = data.nextURL
      let output = '<div id="questionContainer"><h2>Question</h2>'
      console.log(data)
      output += data.question
      output += '<div><input id="answer" type="text"></div>'
      output += '<button id="submitAnswer">Submit Answer</button></div>'
      document.getElementById('output').innerHTML = output
      document.getElementById('submitAnswer').addEventListener('click', postAnswer)
    })
}

function postAnswer () {
  let answerUser
  if (multipleAnswer) {
    answerUser = document.querySelector('input[name="answer"]:checked').value
  } else {
    answerUser = document.getElementById('answer').value
  }
  console.log('posting answer')
  console.log(responseURL)
  // console.log(document.getElementById('answer').value)
  console.log(answerUser)
  window.fetch(responseURL, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ answer: answerUser })
  })
    .then(result => result.json())
    .then(data => {
      console.log(data)
      clearTimeout(questionInterval)
      if (data.message === 'Correct answer!' && data.nextURL === undefined) {
        addToWebStorage(totalTime, name)
        console.log('finished game')
        // clearInterval(timerInterval)
        finishGame()
      } else if (data.message === 'Correct answer!') {
        nextQuestion(data.nextURL)
      } else {
        // clearInterval(timerInterval)
        finishGame()
      }
    })
}

function nextQuestion (startURL) {
  newQuestion = true
  questionTime = 0
  window.fetch(startURL)
    .then(res => res.json())
    .then(data => {
      responseURL = data.nextURL
      let output = '<div id="questionContainer"><h2>Question</h2>'
      console.log(data)
      output += data.question
      if (data.alternatives !== undefined) {
        multipleAnswer = true
        for (var alt in data.alternatives) {
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

function finishGame () {
  clearInterval(timerInterval)
  let output = '<div id="questionContainer"><h2>Game over</h2>'
  output += '<h3>High score</h3>'
  for (var i = 0; i <= 4; i++) {
    output += '<p>' + highScoreNames[i] + ':' + highScore[i] + '</p>'
  }
  // output += '<button id="playAgain">Play again</button>'
  document.getElementById('output').innerHTML = output
  // document.getElementById('playAgain').addEventListener('click', initQuestion)
}

// function questionTimeFunc () {
//  questionInterval = setInterval(function () {
//  }, 1000)
// }

function tst () {
  if (newQuestion === true) {
    questionTime = 0
    newQuestion = false
  }
  totalTime++
  // questionTime++
  questionTime++
  document.querySelector('#totalTime').innerHTML = 'total time = ' + totalTime
  document.querySelector('#questionTime').innerHTML = 'remaining time = ' + (20 - questionTime)
  console.log('questionTime = ' + questionTime)
  if (questionTime === 20) {
    finishGame()
  }
}

function totalTimeFunc () {
  timerInterval = setInterval(tst, 1000)
}

initQuestion()
totalTimeFunc()
// questionTimeFunc()
addToWebStorage()
