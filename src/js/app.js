var totalTime = 0
var timerInterval
var highScore = []

if (window.localStorage.getItem('score') === null) {
  console.log('initializing array')
  highScore = [0, 0, 0, 0, 0]
} else {
  highScore = JSON.parse(window.localStorage.getItem('score'))
}

// highScore[0] = window.prompt('New member name?')
window.localStorage.setItem('score', JSON.stringify(highScore))

// ...
var storedScores = JSON.parse(window.localStorage.getItem('score'))

console.log(storedScores)
var buttonGetName = document.querySelector('#getName')

buttonGetName.addEventListener('click', jsGetName)

var buttonReset = document.querySelector('#reset')

buttonReset.addEventListener('click', jsReset)

function jsReset () {
  highScore = [0, 0, 0, 0, 0]
  window.localStorage.setItem('score', JSON.stringify(highScore))
}

function jsGetName () {
  if (totalTime === 0) {
    highScore = [0, 0, 0, 0, 0]
  }
  var name = document.getElementById('input1').value
  var currentName = document.querySelector('#currentName')
  currentName.innerHTML = 'current name: ' + name
  console.log(name)
  console.log(totalTime)
  console.log('jsGetName = ' + totalTime)
  addToWebStorage(totalTime)
  clearInterval(timerInterval)

  // document.location.href = 'game.html'
}
// function that increments totalTime so we can keep track on total the total time a user
// have used on the game.
function totalTimeFunc () {
  timerInterval = setInterval(function () {
    totalTime++
    document.querySelector('#totalTime').innerHTML = 'total time = ' + totalTime
  }, 1000)
}

function addToWebStorage (number) {
  for (var i = 0; i <= 4; i++) {
    /** if (window.localStorage[i] > number) {
      console.log('number = ' + number.toString())
    } else {
      window.localStorage[i] = number
    } */
    var tmp
    if (highScore[i] < number) {
      tmp = highScore[i]
      highScore[i] = number
      number = tmp
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

totalTimeFunc()
addToWebStorage()
