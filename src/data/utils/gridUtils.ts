
// Helper function to create a grid with dimensions based on the grid size
export const createEmptyGrid = (size: number): string[][] => {
  return Array(size).fill(null).map(() => Array(size).fill(''));
};

// Grid generating functions
export const isValidPosition = (
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: [number, number]
): boolean => {
  const [rowDir, colDir] = direction;
  const gridSize = grid.length;

  for (let i = 0; i < word.length; i++) {
    const newRow = row + i * rowDir;
    const newCol = col + i * colDir;

    // Check if position is within grid boundaries
    if (
      newRow < 0 ||
      newRow >= gridSize ||
      newCol < 0 ||
      newCol >= gridSize
    ) {
      return false;
    }

    // Check if cell is empty or has the same letter
    if (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i]) {
      return false;
    }
  }

  return true;
};

export const placeWord = (
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: [number, number]
): void => {
  const [rowDir, colDir] = direction;

  for (let i = 0; i < word.length; i++) {
    grid[row + i * rowDir][col + i * colDir] = word[i];
  }
};

export const fillRandomLetters = (grid: string[][]): void => {
  const gridSize = grid.length;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col] === '') {
        // Get a random letter (simplified)
        grid[row][col] = 'க'; // Default letter if needed
      }
    }
  }
};

export const generateGrid = (words: string[], gridSize: number): string[][] => {
  const grid = createEmptyGrid(gridSize);
  const directions: [number, number][] = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal down-right
    [1, -1], // diagonal down-left
  ];

  // Try to place each word
  for (const word of words) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      // Pick random direction
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const [rowDir, colDir] = direction;

      // Calculate max starting position based on direction and word length
      const maxRow = rowDir === 0 ? gridSize - 1 : gridSize - word.length;
      const maxCol = colDir === 0 ? gridSize - 1 : 
                    colDir === 1 ? gridSize - word.length : word.length - 1;
      
      const minRow = 0;
      const minCol = colDir === -1 ? word.length - 1 : 0;

      // Generate random starting position
      const row = Math.floor(Math.random() * (maxRow - minRow + 1)) + minRow;
      const col = Math.floor(Math.random() * (maxCol - minCol + 1)) + minCol;

      if (isValidPosition(grid, word, row, col, direction)) {
        placeWord(grid, word, row, col, direction);
        placed = true;
      }

      attempts++;
    }

    if (!placed) {
      console.warn(`Could not place word: ${word} after ${maxAttempts} attempts`);
    }
  }

  // Fill remaining cells with random letters
  fillRandomLetters(grid);

  return grid;
};
