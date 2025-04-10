
export interface GameStage {
  stageNumber: number;
  targetWords: string[];
  gridSize: number;
  gridLetters: string[][];
}

// Helper function to create a grid with dimensions based on the grid size
const createEmptyGrid = (size: number): string[][] => {
  return Array(size).fill(null).map(() => Array(size).fill(''));
};

// Tamil letters for random filling
const tamilLetters = [
  'அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ',
  'க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'த', 'ந', 'ப', 'ம', 'ய', 'ர', 'ல', 'வ', 'ழ', 'ள', 'ற', 'ன',
  'ஜ', 'ஷ', 'ஸ', 'ஹ',
  'ி', 'ீ', 'ு', 'ூ', 'ெ', 'ே', 'ை', 'ொ', 'ோ', 'ௌ'
];

// Grid generating functions
const isValidPosition = (
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

const placeWord = (
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

const fillRandomLetters = (grid: string[][]): void => {
  const gridSize = grid.length;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col] === '') {
        const randomIndex = Math.floor(Math.random() * tamilLetters.length);
        grid[row][col] = tamilLetters[randomIndex];
      }
    }
  }
};

const generateGrid = (words: string[], gridSize: number): string[][] => {
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
    const maxAttempts = 50;

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

// Create the stage data
export const stageData: GameStage[] = [
  {
    stageNumber: 1,
    targetWords: ['குமரன்', 'விக்னேஷ்', 'முருகன்', 'லலிதா'],
    gridSize: 8,
    gridLetters: generateGrid(['கு', 'ம', 'ர', 'ன்', 'வி', 'க்', 'னே', 'ஷ்', 'மு', 'ரு', 'க', 'ன்', 'ல', 'லி', 'தா'], 8)
  },
  {
    stageNumber: 2,
    targetWords: ['அன்பு', 'தமிழ்', 'பாரதி', 'கல்வி'],
    gridSize: 8,
    gridLetters: generateGrid(['அ', 'ன்', 'பு', 'த', 'மி', 'ழ்', 'பா', 'ர', 'தி', 'க', 'ல்', 'வி'], 8)
  },
  {
    stageNumber: 3,
    targetWords: ['சங்கம்', 'நிலவு', 'கடல்', 'மழை'],
    gridSize: 8,
    gridLetters: generateGrid(['ச', 'ங்', 'க', 'ம்', 'நி', 'ல', 'வு', 'க', 'ட', 'ல்', 'ம', 'ழை'], 8)
  },
  {
    stageNumber: 4,
    targetWords: ['தென்றல்', 'திருக்குறள்', 'தொல்காப்பியம்', 'சிலப்பதிகாரம்'],
    gridSize: 10, // Using larger grid for longer words
    gridLetters: generateGrid(['தெ', 'ன்', 'ற', 'ல்', 'தி', 'ரு', 'க்', 'கு', 'ற', 'ள்', 'தொ', 'ல்', 'கா', 'ப்', 'பி', 'ய', 'ம்', 'சி', 'ல', 'ப்', 'ப', 'தி', 'கா', 'ர', 'ம்'], 10)
  }
];

// Regenerate the grid letters at runtime to ensure they are different each time
stageData.forEach(stage => {
  stage.gridLetters = generateGrid(stage.targetWords, stage.gridSize);
});
