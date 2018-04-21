function AI(grid) {
  this.grid = grid;
  maxDepth = 4;
  SCORE_LOST_PENALTY = -200000.0;
  SCORE_MONOTONICITY_WEIGHT = 47.0;
  SCORE_SUM_WEIGHT = 11.0;
  SCORE_MERGES_WEIGHT = 700.0;
  SCORE_EMPTY_WEIGHT = 270.0;
}

// performs a search and returns the best move
AI.prototype.getBest = function() {
  bScore = Number.NEGATIVE_INFINITY;
  bestMove = -1;
  for(var m = 0; m < 4; m++) {
    var nGrid = this.grid.clone();
    if(nGrid.move(m).moved) {
      var grids = add2And4Tiles(nGrid);
      for(var i = 0; i < grids.length; i++) {
        score = getScore(grids[i], 0, Number.NEGATIVE_INFINITY);
        if(score > bScore) {
          bScore = score;
          bestMove = m;
        }
      }
    }
  }
  if(bestMove == -1) {
    //console.log('Random');
    bestMove = Math.floor(Math.random() * 4);
  } 
  best = {move: bestMove, score: bScore}
  console.log(best);
  return best;
}

function moveName(move) {
 return {
    0: 'up',
    1: 'right',
    2: 'down',
    3: 'left'
  }[move];
}

function getScore(grid, depth, maxScore) {
  if(!grid.movesAvailable()) {
    //console.log('Penalty');
    return this.SCORE_LOST_PENALTY;
  }
  if(depth > this.maxDepth) {
    //console.log('MaxDepth');
    return evaluateGrid(grid);
  }
  successors = getSuccessors(grid);
  for(var i = 0; i < successors.length; i++) {
    maxScore = Math.max(maxScore, getScore(successors[i], depth+1, maxScore));
    //console.log(maxScore);
  }
  return maxScore;
}

function evaluateGrid(grid) {
  var openSquares = 0;
  var monotonicity = grid.monotonicity();
  for(var i = 0; i < 4; i++) {
    for(var j = 0; j < 4; j++) {
      if(grid.cells[i][j] == null) {
        openSquares++;
      }
    }
  }
  var eval = openSquares * SCORE_EMPTY_WEIGHT + monotonicity * SCORE_MONOTONICITY_WEIGHT;
  return eval;
}

function getSuccessors(grid) {
  return addSuccessors(grid, 0).concat(addSuccessors(grid, 1)).concat(addSuccessors(grid, 2)).concat(addSuccessors(grid, 3));
}

function addSuccessors(grid, direction) {
  var newGrid = grid.clone();
  newGrid.move(direction);
  return add2And4Tiles(newGrid);
}

function add2And4Tiles(grid) {
  var successors = [];
  for(var i = 0; i < 4; i++) {
    for(var j = 0; j < 4; j++) {
      if(grid.cells[i][j] == null) {
        var newGrid2 = grid.clone();
        var newGrid4 = grid.clone();
        newGrid2.cells[i][j] = new Tile({x: i, y: j},2);
        newGrid4.cells[i][j] = new Tile({x: i, y: j},4);
        if(newGrid2 == null || newGrid4 == null) console.log('Null');
        successors.push(newGrid2, newGrid4);
      }
    }
  }
  return successors;
}
