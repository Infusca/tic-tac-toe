"use client";
import next from "next";
import { useState } from "react";

// components
function Square({ value, onClick }){
  return <button className="square" onClick={onClick}>
    {value}
  </button>
} 

function Board({squares, xIsNext, onPlay}) {
  // const [squares, setSquares] = useState(Array(9).fill(null)); // CTRL-H to change 'squares' here to 'squares', and all below
  // // state to tell what turn so once x is placed, next time will be o
  // const [xIsNext, setxIsNext] = useState(true);

  function onSquareClick(idx){
    if (squares[idx] || calculateWinner(squares)) return; // if this evals as true, means something was already set (not null) so it wont allow to be reset
                          // makes so can't update anything if there's a winner
    const newSquares = squares.slice();
    newSquares[idx] = xIsNext ? 'X' : 'O';
    onPlay(newSquares);
    // setSquares(newSquares);
    // setxIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares); // the winner will constantly be checked and updated every time there's a new play / state is changed -> setState causes refresh every time

  return <> 
      {winner ? (
        <p>Winner is: {winner}</p>
      ) : (
        <p>Next Player: {xIsNext ? 'X' : 'O'}</p>
      )}
      <div className="board-row">
        {/* <Square value={'X'} onClick={ () => onSquareClick()} /> - initially set up with this, but need to replace 'X' with x or o depending who's turn, when clicked*/} 
        <Square value={squares[0]} onClick={ () => onSquareClick(0)} />
        <Square value={squares[1]} onClick={ () => onSquareClick(1)} />
        <Square value={squares[2]} onClick={ () => onSquareClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onClick={ () => onSquareClick(3)} />
        <Square value={squares[4]} onClick={ () => onSquareClick(4)} />
        <Square value={squares[5]} onClick={ () => onSquareClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onClick={ () => onSquareClick(6)} />
        <Square value={squares[7]} onClick={ () => onSquareClick(7)} />
        <Square value={squares[8]} onClick={ () => onSquareClick(8)} />
      </div> 
    </>
}

// calculate winner - need to check across each row, down each col, diagonally
function calculateWinner(squares){
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

  for (let i=0; i<lines.length; i++){
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) // this is checking if square[a] is not null and if all 3 are equal
      return squares[a];
  }

return null;
}

// entire game
export default function Game() {
  // history
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0; // calculates who's move - can remove setSquares and setxIsNext lines above
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares){
    const nextHistory = [...history.slice(0, currentMove+1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length-1);
  };

  // jump to different pieces of hx
  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if(move > 0){
      description = 'Go to move # ' + move;
    } else {
      description = "Go to game start"
    }
    return (
      /* need key because dynamically rendering this inside map */
      <li key={move + Math.random()}> 
        <button onClick={()=> jumpTo(move)}>{description}</button>
      </li>
    )
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquares} xIsNext={xIsNext} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>
          {moves}
        </ol>
      </div>
    </div>
  )
}