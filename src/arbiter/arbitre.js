// So pieces dont move out of the board
const isValidPosition = (x, y) => x >= 0 && x < 8 && y >= 0 && y < 8;

const findKing = (positions, king) => {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (positions[i][j] === king) {
        return { x: i, y: j };
      }
    }
  }
  return null;
};

const isKingInCheck = (
  positions,
  isWhite,
  castling = { w: { king: true, queen: true }, b: { king: true, queen: true } }
) => {
  const kingPosition = findKing(positions, isWhite ? "wk" : "bk");
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = positions[i][j];
      if (piece && piece[0] !== (isWhite ? "w" : "b")) {
        const moves = arbiter(
          piece,
          positions,
          null,
          i,
          j,
          !isWhite,
          castling,
          true
        );
        if (
          moves.some(([x, y]) => x === kingPosition.x && y === kingPosition.y)
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

const isCheckmate = (positions, isWhite) => {
  if (!isKingInCheck(positions, isWhite)) return false;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = positions[i][j];
      if (piece && piece[0] === (isWhite ? "w" : "b")) {
        const moves = arbiter(piece, positions, null, i, j, isWhite);
        for (const [x, y] of moves) {
          const newPositions = JSON.parse(JSON.stringify(positions));
          newPositions[i][j] = "";
          newPositions[x][y] = piece;
          if (!isKingInCheck(newPositions, isWhite)) {
            return false;
          }
        }
      }
    }
  }
  return true;
};

const isStalemate = (positions, isWhite) => {
  if (isKingInCheck(positions, isWhite)) return false;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = positions[i][j];
      if (piece && piece[0] === (isWhite ? "w" : "b")) {
        const moves = arbiter(piece, positions, null, i, j, isWhite);
        for (const [x, y] of moves) {
          const newPositions = JSON.parse(JSON.stringify(positions));
          newPositions[i][j] = "";
          newPositions[x][y] = piece;
          if (!isKingInCheck(newPositions, isWhite)) {
            return false;
          }
        }
      }
    }
  }
  return true;
};

export const getPawnMoves = (positions, prevPositions, x, y, isWhite) => {
  const direction = isWhite ? -1 : 1;
  const moves = [];

  // single step forward
  //checks if its a valid position and if the position is empty
  if (isValidPosition(x + direction, y) && !positions[x + direction][y]) {
    moves.push([x + direction, y]);
  }

  // capture diagonally
  //checks if its a valid position and if the position is not empty and if the piece is not the same color
  if (
    isValidPosition(x + direction, y - 1) &&
    positions[x + direction][y - 1] &&
    positions[x + direction][y - 1][0] !== (isWhite ? "w" : "b")
  ) {
    moves.push([x + direction, y - 1]);
  }
  if (
    isValidPosition(x + direction, y + 1) &&
    positions[x + direction][y + 1] &&
    positions[x + direction][y + 1][0] !== (isWhite ? "w" : "b")
  ) {
    moves.push([x + direction, y + 1]);
  }

  // double step forward at the start
  //just checks if its ampty and if its at the starting square
  if ((isWhite && x === 6) || (!isWhite && x === 1)) {
    if (!positions[x + direction][y] && !positions[x + 2 * direction][y]) {
      moves.push([x + 2 * direction, y]);
    }
  }

  // en passant
  // Checks if the last move was a double step forward by the opponent
  const enemyPawn = isWhite ? "bp" : "wp";
  const adjacentFiles = [y - 1, y + 1];

  if (prevPositions) {
    if ((isWhite && x === 3) || (!isWhite && x === 4)) {
      adjacentFiles.forEach((f) => {
        if (isValidPosition(x, f) && positions[x][f] === enemyPawn) {
          // Check if the enemy pawn just moved two squares forward
          if (
            isValidPosition(x + 2 * direction, f) &&
            prevPositions[x + 2 * direction][f] === enemyPawn &&
            !prevPositions[x][f] &&
            !positions[x + direction][f]
          ) {
            moves.push([x + direction, f]);
          }
        }
      });
    }
  }

  return moves;
};

const getRookMoves = (positions, x, y, isWhite) => {
  const moves = [];

  // Check all directions: up, down, left, right
  const directions = [
    [-1, 0], // up
    [1, 0], // down
    [0, -1], // left
    [0, 1], // right
  ];

  for (const [dx, dy] of directions) {
    let nx = x + dx;
    let ny = y + dy;
    //if it in the board
    while (isValidPosition(nx, ny)) {
      //if there is a piece
      if (positions[nx][ny]) {
        //if the piece is not the same color
        if (positions[nx][ny][0] !== (isWhite ? "w" : "b")) {
          moves.push([nx, ny]); //capture
        }
        break; // blocked by another piece of the same color
      }
      moves.push([nx, ny]); //empty square
      nx += dx;
      ny += dy;
    }
  }

  return moves;
};

const getKnightMoves = (positions, x, y, isWhite) => {
  const moves = [];

  // 8 L shaped moves
  const potentialMoves = [
    [x - 2, y - 1],
    [x - 2, y + 1],
    [x - 1, y - 2],
    [x - 1, y + 2],
    [x + 1, y - 2],
    [x + 1, y + 2],
    [x + 2, y - 1],
    [x + 2, y + 1],
  ];

  for (const [nx, ny] of potentialMoves) {
    if (isValidPosition(nx, ny)) {
      if (
        !positions[nx][ny] ||
        positions[nx][ny][0] !== (isWhite ? "w" : "b")
      ) {
        moves.push([nx, ny]);
      }
    }
  }

  return moves;
};

const getBishopMoves = (positions, x, y, isWhite) => {
  const moves = [];

  // Check all diagonal directions
  const directions = [
    [-1, -1], // up-left
    [-1, 1], // up-right
    [1, -1], // down-left
    [1, 1], // down-right
  ];

  for (const [dx, dy] of directions) {
    let nx = x + dx;
    let ny = y + dy;

    while (isValidPosition(nx, ny)) {
      if (positions[nx][ny]) {
        if (positions[nx][ny][0] !== (isWhite ? "w" : "b")) {
          moves.push([nx, ny]); // capture
        }
        break; // blocked by another piece
      }
      moves.push([nx, ny]);
      nx += dx;
      ny += dy;
    }
  }

  return moves;
};

const getQueenMoves = (positions, x, y, isWhite) => {
  // Queen moves are a combination of rook and bishop moves , ezz
  return [
    ...getRookMoves(positions, x, y, isWhite),
    ...getBishopMoves(positions, x, y, isWhite),
  ];
};

const getKingMoves = (positions, x, y, isWhite, castling) => {
  const moves = [];

  const potentialMoves = [
    [x - 1, y - 1],
    [x - 1, y],
    [x - 1, y + 1],
    [x, y - 1],
    [x, y + 1],
    [x + 1, y - 1],
    [x + 1, y],
    [x + 1, y + 1],
  ];

  for (const [nx, ny] of potentialMoves) {
    if (isValidPosition(nx, ny)) {
      if (
        !positions[nx][ny] ||
        positions[nx][ny][0] !== (isWhite ? "w" : "b")
      ) {
        moves.push([nx, ny]);
      }
    }
  }

  // // Castling
  const king = isWhite ? "w" : "b";
  const backRank = isWhite ? 7 : 0;

  // King-side castling
  if (
    castling[king].king &&
    !positions[backRank][5] &&
    !positions[backRank][6]
  ) {
    if (
      !isKingInCheck(positions, isWhite) &&
      !isKingInCheckAfterMove(positions, [x, y], [backRank, 5], isWhite)
    ) {
      moves.push([backRank, 6]);
    }
  }

  // Queen-side castling
  if (
    castling[king].queen &&
    !positions[backRank][1] &&
    !positions[backRank][2] &&
    !positions[backRank][3]
  ) {
    if (
      !isKingInCheck(positions, isWhite) &&
      !isKingInCheckAfterMove(positions, [x, y], [backRank, 2], isWhite)
    ) {
      moves.push([backRank, 2]);
    }
  }

  return moves;
};

const isKingInCheckAfterMove = (positions, from, to, isWhite) => {
  const [fx, fy] = from;
  const [tx, ty] = to;

  const tempPositions = JSON.parse(JSON.stringify(positions));
  tempPositions[tx][ty] = tempPositions[fx][fy];
  tempPositions[fx][fy] = "";

  return isKingInCheck(tempPositions, isWhite);
};

export default function arbiter(
  piece,
  positions,
  prevPositions,
  x,
  y,
  isWhite,
  castling = { w: { king: true, queen: true }, b: { king: true, queen: true } },
  isCheckingKing = false
) {
  if (!piece) return [];

  const pieceType = piece[1];
  let moves = [];

  switch (pieceType) {
    case "p":
      moves = getPawnMoves(positions, prevPositions, x, y, isWhite);
      break;
    case "r":
      moves = getRookMoves(positions, x, y, isWhite);
      break;
    case "n":
      moves = getKnightMoves(positions, x, y, isWhite);
      break;
    case "b":
      moves = getBishopMoves(positions, x, y, isWhite);
      break;
    case "q":
      moves = getQueenMoves(positions, x, y, isWhite);
      break;
    case "k":
      moves = getKingMoves(positions, x, y, isWhite, castling);
      break;
    default:
      return [];
  }

  // Filter out moves that would result in the king being in check
  if (!isCheckingKing) {
    moves = moves.filter(([nx, ny]) => {
      const newPositions = JSON.parse(JSON.stringify(positions));
      newPositions[x][y] = "";
      newPositions[nx][ny] = piece;
      return !isKingInCheck(newPositions, isWhite);
    });
  }

  return moves;
}

// Use this function to determine the state of the game after each move
// remains to add repetition and 50 moves rule
export function checkGameState(positions, isWhite) {
  if (isCheckmate(positions, isWhite)) {
    return "checkmate";
  } else if (isStalemate(positions, isWhite)) {
    return "stalemate";
  } else {
    return "ongoing";
  }
}
