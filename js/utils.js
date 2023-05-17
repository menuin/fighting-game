// these are assistant functions

function detectCollision({ attacker, victim }) {
  return (
    attacker.attackBox.position.x + attacker.attackBox.width >=
      victim.position.x &&
    attacker.attackBox.position.x <= victim.position.x + victim.width &&
    attacker.attackBox.position.y + attacker.attackBox.height >=
      victim.position.y &&
    attacker.attackBox.position.y <= victim.position.y + victim.height
  );
}

function determineWinner({ player1, player2, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#displayText").style.display = "flex";

  if (player1.health === player2.health) {
    document.querySelector("#displayText").innerHTML = "Tie";
  } else if (player1.health >= player2.health) {
    document.querySelector("#displayText").innerHTML = "Player 1 Wins";
  } else if (player1.health <= player2.health) {
    document.querySelector("#displayText").innerHTML = "Player 2 Wins";
  }
}
let timer = 60;
let timerId;
function decreaseTimer() {
  timerId = setTimeout(decreaseTimer, 1000);
  if (timer > 0) {
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }
  if (timer === 0) {
    determineWinner({ player1, player2, timerId });
  }
}
