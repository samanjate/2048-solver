function AI(grid) {
  this.grid = grid;
  this.maxDepth = 4;
}

// performs a search and returns the best move
AI.prototype.getBest = function() {
  return getBestMove(this.grid, 100);  
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
  if(depth > this.maxDepth) return evaluateGrid(grid);
  successors = getSuccessors(grid);
  for(var i = 0; successors.length; i++) {
    maxScore = Math.max(maxScore, getScore(successors[i], depth+1, score));
  }
  return maxScore;
}

function evaluateGrid(grid) {
  return 0;
}

function getSuccessors(grid) {
  return [];
}

function getBestMove(grid, runs, debug) {
    var bestScore = 0; 
    var bestMove = -1;

    for (var i=0;i<4;i++) {
      // score move position
      var res = multiRandomRun(grid, i, runs);
      var score = res.score;
      
      if (score >= bestScore) {
        bestScore = score;
        bestMove = i;
        bestAvgMoves = res.avg_moves;
      }
    }
    if(!grid.movesAvailable()) console.log('bug2');   
    // assert move found    
    if (bestMove == -1) {
      console.log('ERROR...'); 
      errorGrid = grid.clone();
    }  
    
    return {move: bestMove, score: bestScore};
}

function multiRandomRun(grid, move, runs) {
  var total = 0.0;
  var min = 1000000;
  var max = 0;
  var total_moves = 0;
  
  for (var i=0 ; i < runs ; i++) {
    var res = randomRun(grid, move);
    var s = res.score;
    if (s == -1) return -1;
      
    total += s;
    total_moves += res.moves;
    if (s < min) min = s;
    if (s > max) max = s;
  }
  
  var avg = total / runs;
  var avg_moves = total_moves / runs;

//  return max;
//  return min;
//  return avg+max;
  return {score: avg, avg_moves:avg_moves};
}

function randomRun(grid, move) {  
  var g = grid.clone();
  var score = 0;
  var res = moveAndAddRandomTiles(g, move);
  if (!res.moved) {
    return -1; // can't start
  } 
  score += res.score;

  // run til we can't
  var moves=1;
  while (true) {
    if (!g.movesAvailable()) break;
    
    var res = g.move(Math.floor(Math.random() * 4));
    if (!res.moved) continue;
    
    score += res.score;
    g.addRandomTile();
    moves++;
  }
  // grid done.
  return {score:score, moves:moves};
}

function moveAndAddRandomTiles(grid, direction) {
  var res = grid.move(direction);
  if (res.moved) grid.addRandomTile();
  return res;
}
