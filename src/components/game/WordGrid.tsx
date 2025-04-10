
import React, { useState, useEffect, useRef } from 'react';
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
  const gridRef = useRef<HTMLDivElement>(null);

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
      
      // Add to highlighted cells with animation
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
      const colors = ['bg-green-100 border-green-300', 'bg-blue-100 border-blue-300', 
                      'bg-purple-100 border-purple-300', 'bg-amber-100 border-amber-300'];
      return colors[wordIndex % colors.length];
    }
    
    // If this cell is currently selected
    if (selectedLetters.some(letter => letter.row === row && letter.col === col)) {
      return 'bg-orange-100 border-orange-300';
    }
    
    return 'bg-amber-50 hover:bg-amber-100 border-amber-100';
  };
  
  // Handle touch events for mobile
  const handleTouchStart = (row: number, col: number, letter: string, e: React.TouchEvent) => {
    e.preventDefault(); // Prevent default touch behavior
    handleLetterMouseDown(row, col, letter);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling while selecting
    
    if (!isSelecting || !gridRef.current) return;
    
    const touch = e.touches[0];
    const gridRect = gridRef.current.getBoundingClientRect();
    
    // Calculate the touch position relative to the grid
    const relativeX = touch.clientX - gridRect.left;
    const relativeY = touch.clientY - gridRect.top;
    
    // Get the element at this position
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
      ref={gridRef}
      className="grid border border-amber-200 rounded-md overflow-hidden shadow-md select-none"
      style={{ 
        gridTemplateColumns: `repeat(${gridLetters[0].length}, 1fr)`,
        touchAction: 'none' // Prevent scrolling during touch
      }}
      onMouseUp={handleLetterMouseUp}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleLetterMouseUp}
      onMouseLeave={handleLetterMouseUp}
      onTouchMove={handleTouchMove}
    >
      {gridLetters.map((row, rowIndex) => (
        row.map((letter, colIndex) => {
          // For debugging: log the character code points to check for partial characters
          const codePoints = [...letter].map(char => char.codePointAt(0)?.toString(16).padStart(4, '0')).join(' ');
          // console.log(`Cell [${rowIndex}][${colIndex}]: "${letter}" - Code points: ${codePoints}`);
          
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              data-cell={`${rowIndex}-${colIndex}`}
              className={cn(
                "aspect-square flex items-center justify-center text-xl font-bold border",
                "transition-all duration-200 font-tamil", // Added Tamil font class
                getCellColor(rowIndex, colIndex),
                isSelecting && "cursor-pointer"
              )}
              onMouseDown={() => handleLetterMouseDown(rowIndex, colIndex, letter)}
              onMouseEnter={() => handleLetterMouseEnter(rowIndex, colIndex, letter)}
              onTouchStart={(e) => handleTouchStart(rowIndex, colIndex, letter, e)}
            >
              {letter}
            </div>
          );
        })
      ))}
    </div>
  );
};

export default WordGrid;
