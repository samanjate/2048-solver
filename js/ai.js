function AI(grid) {
  this.grid = grid;
  maxDepth = 6;
  losePenalty = -1000.0;
  monoWeight = 5.0;
  smoothWeight = 0.1;
  emptyWeight = 1.0;
  maxWeight    = 1.5;
  cornerWeight = 15.0;
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
    bestMove = Math.floor(Math.random() * 4);
  } 
  best = {move: bestMove, score: bScore};
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
  var gridScore =  evaluateGrid(grid);
  if(depth > this.maxDepth) {
    return gridScore;
  }
  successors = getSuccessors(grid);
  for(var i = 0; i < successors.length; i++) {
    maxScore = Math.max(maxScore, getScore(successors[i], depth+1, maxScore));
  }
  return maxScore + gridScore;
}

function evaluateGrid(grid) {
  var openSquares = grid.availableCells().length;
  var eval = openSquares * this.emptyWeight 
            + grid.monotonicity() * this.monoWeight 
            //+ grid.smoothness() * this.smoothWeight
            + maxTilesAtCorners(grid) * this.cornerWeight; 
            + grid.maxValue() * this.maxWeight;;
  if(!grid.movesAvailable()) {
    eval + this.losePenalty;
  }
  return eval;
}

function maxTilesAtCorners(grid) {
  var maxVal = Math.pow(2, grid.maxValue());
  if(grid.cells[0][0] || grid.cells[3][0] || grid.cells[0][3] || grid.cells[3][3]) return 1.0;
  else return 0.0;
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
        successors.push(newGrid2, newGrid4);
      }
    }
  }
  return successors;
}
