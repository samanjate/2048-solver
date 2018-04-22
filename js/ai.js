function AI(grid) {
  this.grid = grid;
}

function moveName(move) {
 return {
    0: 'up',
    1: 'right',
    2: 'down',
    3: 'left'
  }[move];
}

// performs a search and returns the best move
AI.prototype.getBest = function() {
  return {move: Math.floor(Math.random() * 4), score: 0};
}