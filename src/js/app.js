var totalTime = 0
var timerInterval

var buttonGetName = document.querySelector('#getName')

buttonGetName.addEventListener('click', jsGetName)

function jsGetName () {
  var name = document.getElementById('input1').value
  var currentName = document.querySelector('#currentName')
  currentName.innerHTML = 'current name: ' + name
  console.log(name)
  console.log(totalTime)
  clearInterval(timerInterval)
  // document.location.href = 'game.html'
}
// function that increments totalTime so we can keep track on total the total time a user
// have used on the game.
function totaltime () {
  timerInterval = setInterval(function () {
    totalTime++
    document.querySelector('#totalTime').innerHTML = 'total time = ' + totalTime
  }, 1000)
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

totaltime()
