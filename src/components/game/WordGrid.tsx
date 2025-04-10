
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface WordGridProps {
  gridLetters: string[][];
  targetWords: string[];
  onWordFound: (word: string) => void;
  foundWords: string[];
}

interface SelectedLetter {
  row: number;
  col: number;
  letter: string;
}

const WordGrid: React.FC<WordGridProps> = ({ 
  gridLetters, 
  targetWords, 
  onWordFound,
  foundWords
}) => {
  const [selectedLetters, setSelectedLetters] = useState<SelectedLetter[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [highlightedCells, setHighlightedCells] = useState<{[key: string]: string}>({});

  // Check if selected letters form a valid word
  useEffect(() => {
    if (selectedLetters.length === 0) return;
    
    const selectedWord = selectedLetters.map(item => item.letter).join('');
    
    const matchingWord = targetWords.find(word => 
      word === selectedWord && !foundWords.includes(word)
    );
    
    if (matchingWord) {
      // Word found
      onWordFound(matchingWord);
      
      // Add to highlighted cells
      const newHighlights = { ...highlightedCells };
      selectedLetters.forEach(({row, col}) => {
        newHighlights[`${row}-${col}`] = matchingWord;
      });
      setHighlightedCells(newHighlights);
    }
    
    // Clear selection after checking
    setSelectedLetters([]);
  }, [selectedLetters, targetWords, onWordFound, foundWords, highlightedCells]);

  const handleLetterMouseDown = (row: number, col: number, letter: string) => {
    // Start selection
    setIsSelecting(true);
    setSelectedLetters([{ row, col, letter }]);
  };

  const handleLetterMouseEnter = (row: number, col: number, letter: string) => {
    // Continue selection
    if (isSelecting) {
      // Check if this cell is adjacent to the last selected cell
      const lastLetter = selectedLetters[selectedLetters.length - 1];
      
      // Only add if it's a valid continuation (adjacent cell)
      const isAdjacent = 
        Math.abs(lastLetter.row - row) <= 1 && 
        Math.abs(lastLetter.col - col) <= 1;
      
      // Only add if it's in the same direction as the current selection
      const isSameDirection = selectedLetters.length < 2 || (() => {
        const [first, second] = selectedLetters;
        const rowDir = second.row - first.row;
        const colDir = second.col - first.col;
        
        // Current direction
        const currentRowDir = row - lastLetter.row;
        const currentColDir = col - lastLetter.col;
        
        return (rowDir === 0 && currentRowDir === 0) || 
               (colDir === 0 && currentColDir === 0) ||
               (rowDir !== 0 && colDir !== 0 && 
                currentRowDir / rowDir === currentColDir / colDir);
      })();
      
      // Check if not already in the selection
      const isNotSelected = !selectedLetters.some(
        item => item.row === row && item.col === col
      );
      
      if (isAdjacent && isSameDirection && isNotSelected) {
        setSelectedLetters([...selectedLetters, { row, col, letter }]);
      }
    }
  };

  const handleLetterMouseUp = () => {
    // End selection
    setIsSelecting(false);
  };

  const getCellColor = (row: number, col: number) => {
    const key = `${row}-${col}`;
    
    // If this cell is part of a found word, return its color
    if (key in highlightedCells) {
      // Use different colors for different words
      const wordIndex = targetWords.indexOf(highlightedCells[key]);
      const colors = ['bg-green-100', 'bg-blue-100', 'bg-purple-100', 'bg-amber-100'];
      return colors[wordIndex % colors.length];
    }
    
    // If this cell is currently selected
    if (selectedLetters.some(letter => letter.row === row && letter.col === col)) {
      return 'bg-orange-100';
    }
    
    return 'bg-amber-50';
  };
  
  // Handle touch events for mobile
  const handleTouchStart = (row: number, col: number, letter: string) => {
    handleLetterMouseDown(row, col, letter);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isSelecting) return;
    
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element && element.getAttribute('data-cell')) {
      const [row, col] = element.getAttribute('data-cell')!.split('-').map(Number);
      const letter = gridLetters[row][col];
      handleLetterMouseEnter(row, col, letter);
    }
  };
  
  const handleTouchEnd = () => {
    handleLetterMouseUp();
  };

  return (
    <div 
      className="grid border border-amber-200 rounded-md overflow-hidden"
      style={{ 
        gridTemplateColumns: `repeat(${gridLetters[0].length}, 1fr)`,
        userSelect: 'none', // Prevent text selection during dragging
        touchAction: 'none' // Prevent scrolling during touch
      }}
      onMouseUp={handleLetterMouseUp}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleLetterMouseUp}
      onMouseLeave={handleLetterMouseUp}
      onTouchMove={handleTouchMove}
    >
      {gridLetters.map((row, rowIndex) => (
        row.map((letter, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            data-cell={`${rowIndex}-${colIndex}`}
            className={cn(
              "aspect-square flex items-center justify-center text-xl font-bold border border-amber-100",
              getCellColor(rowIndex, colIndex)
            )}
            onMouseDown={() => handleLetterMouseDown(rowIndex, colIndex, letter)}
            onMouseEnter={() => handleLetterMouseEnter(rowIndex, colIndex, letter)}
            onTouchStart={() => handleTouchStart(rowIndex, colIndex, letter)}
          >
            {letter}
          </div>
        ))
      ))}
    </div>
  );
};

export default WordGrid;
