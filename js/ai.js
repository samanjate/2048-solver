function AI(grid) {
  this.grid = grid;
  this.maxDepth = 6;
  this.probOf2Spawn = 0.9;
  this.probOf4Spawn = 0.1;
}

function moveName(move) {
 return {
    0: 'up',
    1: 'right',
    2: 'down',
    3: 'left'
  }[move];
}

AI.prototype.getBest = function(algo) {
  bestScore = Number.NEGATIVE_INFINITY;
  bestMove = -1;
  var depth = this.maxDepth-1;
  for(var move = 0; move < 4; move++) {
    var newGrid = this.grid.clone();
    if(newGrid.move(move).moved) {
        var score = algo === 0 ? this.expectimax(newGrid, depth, false) 
                               : this.minimax(newGrid, depth, false);
        if(score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
    }
  if(bestMove == -1) {
    bestMove = Math.floor(Math.random() * 4);
  } 
  best = {move: bestMove, score: bestScore};
  //console.log(best);
  return best;
}

AI.prototype.expectimax = function(grid, depth, playerTurn) {
  if(depth == 0) {
    return grid.getScore();
  } else if(playerTurn) {
    var score = Number.NEGATIVE_INFINITY;
    for (var move = 0; move < 4; move++) {
      var newGrid = grid.clone();
      if (newGrid.move(move).moved) {
        var newScore = this.expectimax(newGrid, depth-1, false);
        if(newScore > score) {
          score = newScore;
        }
      }
    }
    return score;
  } else if(!playerTurn) {
    var score = 0.0;
    for(var i = 0; i < 4; i++) {
      for(var j = 0; j < 4; j++) {
        if(grid.cells[i][j] == null) {
          var newGrid2 = grid.clone();
          newGrid2.cells[i][j] = new Tile({x: i, y: j},2);
          var newScore = this.expectimax(newGrid2, depth-1, true);
          if (newScore != Number.NEGATIVE_INFINITY) {
            score += (this.probOf2Spawn * newScore);
          }
          var newGrid4 = grid.clone();
          newGrid4.cells[i][j] = new Tile({x: i, y: j},4);
          newScore =  this.expectimax(newGrid4, depth-1, true);
          if (newScore != Number.NEGATIVE_INFINITY) {
            score += (this.probOf4Spawn * newScore);
          }
        }
      }
    }
    return score/(grid.availableCells().length);
  }
}

AI.prototype.minimax = function(grid, depth, playerTurn) {
  if(depth == 0) {
    return grid.getScore();
  } else if(playerTurn) {
    var score = Number.NEGATIVE_INFINITY;
    for (var move = 0; move < 4; move++) {
      var newGrid = grid.clone();
      if (newGrid.move(move).moved) {
        var newScore = this.minimax(newGrid, depth-1, false);
        if(newScore > score) {
          score = newScore;
        }
      }
    }
    return score;
  } else if(!playerTurn) {
    var score = 0.0;
    for(var i = 0; i < 4; i++) {
      for(var j = 0; j < 4; j++) {
        if(grid.cells[i][j] == null) {
          var newGrid2 = grid.clone();
          newGrid2.cells[i][j] = new Tile({x: i, y: j},2);
          var newScore2 = this.minimax(newGrid2, depth-1, true);
          var newGrid4 = grid.clone();
          newGrid4.cells[i][j] = new Tile({x: i, y: j},4);
          var newScore4 =  this.minimax(newGrid4, depth-1, true);
          var newScore = Math.max(newScore2, newScore4);
          if (newScore != Number.NEGATIVE_INFINITY) {
            score += newScore;
          }
        }
      }
    }
    return score/(grid.availableCells().length);
  }
}