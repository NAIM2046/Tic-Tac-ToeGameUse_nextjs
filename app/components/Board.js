"use client"

import React, { useState, useEffect } from 'react';
import { FaTimes, FaRegCircle, FaRedo } from 'react-icons/fa';
import { GiTrophy } from 'react-icons/gi';

const winningPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], 
  [0, 3, 6], [1, 4, 7], [2, 5, 8], 
  [0, 4, 8], [2, 4, 6]             
];

export default function Board() {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });

  useEffect(() => {
    const result = checkWinner(board);
    if (result && result !== "Draw") {
      setWinner(result);
      setScore(prev => ({ ...prev, [result]: prev[result] + 1 }));
    } else if (result === "Draw") {
      setWinner("Draw");
      setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
    }
  }, [board]);

  function checkWinner(currentBoard) {
    for (let pattern of winningPatterns) {
      const [a, b, c] = pattern;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        setWinningCells(pattern);
        return currentBoard[a];
      }
    }
    if (currentBoard.every(cell => cell !== "")) return "Draw";
    return null;
  }

  function handleClick(index) {
    if (board[index] || winner) return;
    
    const newBoard = [...board];
    newBoard[index] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  }

  function reset() {
    setBoard(Array(9).fill(""));
    setXIsNext(true);
    setWinner(null);
    setWinningCells([]);
  }

  function getCellClass(index) {
    let classes = "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-2 text-3xl sm:text-4xl flex items-center justify-center transition-all duration-300 rounded-sm ";
    
    if (index % 3 === 0) {
      classes += " border-blue-100 ";
    } else if (index % 3 === 1) {
      classes += " border-purple-100 ";
    } else {
      classes += "border-pink-100 ";
    }
    
   
    if (winningCells.includes(index)) {
      classes += "bg-yellow-100 border-yellow-300 shadow-inner scale-105 ";
    }
    
   
    if (!board[index] && !winner) {
      classes += "hover:bg-white hover:shadow-md cursor-pointer ";
    }
    
    return classes;
  }

  let status;
  if (winner === "Draw") {
    status = "Game ended in a draw";
  } else if (winner) {
    status = `Player ${winner} wins!🎉`;
  } else {
    status = `Next: Player ${xIsNext ? "X" : "O"}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md">
        {/* Header with title and scores */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center justify-center sm:justify-start">
            <GiTrophy className="text-yellow-500 mr-2" />
            Tic-Tac-Toe
          </h1>
          
          <div className="flex justify-center sm:justify-end gap-2">
            <div className="text-center px-2 sm:px-3 py-1 bg-blue-100 rounded-lg">
              <p className="text-xs text-blue-800">Player X</p>
              <p className="font-bold text-blue-900 text-sm sm:text-base">{score.X}</p>
            </div>
            <div className="text-center px-2 sm:px-3 py-1 bg-gray-100 rounded-lg">
              <p className="text-xs text-gray-800">Draws</p>
              <p className="font-bold text-gray-900 text-sm sm:text-base">{score.draws}</p>
            </div>
            <div className="text-center px-2 sm:px-3 py-1 bg-pink-100 rounded-lg">
              <p className="text-xs text-pink-800">Player O</p>
              <p className="font-bold text-pink-900 text-sm sm:text-base">{score.O}</p>
            </div>
          </div>
        </div>
        
        {/* Game board */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
          {board.map((value, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className={getCellClass(i)}
              disabled={!!winner || !!board[i]}
            >
              {value === "X" ? (
                <FaTimes className="text-blue-600 animate-pop" />
              ) : value === "O" ? (
                <FaRegCircle className="text-pink-500 animate-pop" />
              ) : null}
            </button>
          ))}
        </div>
        
        {/* Game status and controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          <p className={`text-sm sm:text-base font-medium ${
            winner === "X" ? "text-blue-600" : 
            winner === "O" ? "text-pink-600" : 
            "text-gray-600"
          }`}>
            {status}
          </p>
          <button
            onClick={reset}
            className={`
              px-4 py-2 sm:px-5 sm:py-3
              bg-gradient-to-r from-blue-500 to-purple-600
              text-white font-semibold text-sm sm:text-base
              rounded-lg sm:rounded-xl
              shadow-md sm:shadow-lg
              hover:from-blue-600 hover:to-purple-700
              active:scale-95
              transition-all duration-300
              flex items-center gap-2
              w-full sm:w-auto justify-center cursor-pointer
            `}
          >
            <FaRedo className="text-sm sm:text-base" />
            New Game
          </button>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes pop {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop {
          animation: pop 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}