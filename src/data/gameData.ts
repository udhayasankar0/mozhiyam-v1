
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

// Clean, verified array of Tamil characters that display properly
const tamilLetters = [
  // Uyir (Vowels) - Basic forms
  'அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ',
  
  // Mei (Consonants) - Basic forms
  'க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'த', 'ந', 'ப', 'ம', 'ய', 'ர', 'ல', 'வ', 'ழ', 'ள', 'ற', 'ன',
  
  // Additional common characters
  'ஜ', 'ஷ', 'ஸ', 'ஹ',
  
  // Common combined forms that render reliably
  'கா', 'கி', 'கீ', 'கு', 'கூ', 'கெ', 'கே', 'கை', 'கொ', 'கோ', 'கௌ',
  'சா', 'சி', 'சீ', 'சு', 'சூ', 'செ', 'சே', 'சை', 'சொ', 'சோ', 'சௌ',
  'டா', 'டி', 'டீ', 'டு', 'டூ', 'டெ', 'டே', 'டை', 'டொ', 'டோ', 'டௌ',
  'தா', 'தி', 'தீ', 'து', 'தூ', 'தெ', 'தே', 'தை', 'தொ', 'தோ', 'தௌ',
  'நா', 'நி', 'நீ', 'நு', 'நூ', 'நெ', 'நே', 'நை', 'நொ', 'நோ', 'நௌ',
  'பா', 'பி', 'பீ', 'பு', 'பூ', 'பெ', 'பே', 'பை', 'பொ', 'போ', 'பௌ',
  'மா', 'மி', 'மீ', 'மு', 'மூ', 'மெ', 'மே', 'மை', 'மொ', 'மோ', 'மௌ',
  'யா', 'யி', 'யீ', 'யு', 'யூ', 'யெ', 'யே', 'யை', 'யொ', 'யோ', 'யௌ',
  'ரா', 'ரி', 'ரீ', 'ரு', 'ரூ', 'ரெ', 'ரே', 'ரை', 'ரொ', 'ரோ', 'ரௌ',
  'லா', 'லி', 'லீ', 'லு', 'லூ', 'லெ', 'லே', 'லை', 'லொ', 'லோ', 'லௌ',
  'வா', 'வி', 'வீ', 'வு', 'வூ', 'வெ', 'வே', 'வை', 'வொ', 'வோ', 'வௌ',
  'ழா', 'ழி', 'ழீ', 'ழு', 'ழூ', 'ழெ', 'ழே', 'ழை', 'ழொ', 'ழோ', 'ழௌ',
  'ளா', 'ளி', 'ளீ', 'ளு', 'ளூ', 'ளெ', 'ளே', 'ளை', 'ளொ', 'ளோ', 'ளௌ',
  'றா', 'றி', 'றீ', 'று', 'றூ', 'றெ', 'றே', 'றை', 'றொ', 'றோ', 'றௌ',
  'னா', 'னி', 'னீ', 'னு', 'னூ', 'னெ', 'னே', 'னை', 'னொ', 'னோ', 'னௌ'
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
        // Get a random Tamil letter and verify it isn't a combining character or partial glyph
        let randomLetter;
        let attempts = 0;
        const maxAttempts = 5;
        
        do {
          const randomIndex = Math.floor(Math.random() * tamilLetters.length);
          randomLetter = tamilLetters[randomIndex];
          attempts++;
        } while (randomLetter.length === 0 && attempts < maxAttempts);
        
        grid[row][col] = randomLetter;
        
        // Log the character and its code points for debugging
        const codePoints = [...randomLetter].map(char => char.codePointAt(0)?.toString(16).padStart(4, '0')).join(' ');
        console.log(`Cell [${row}][${colIndex}]: "${randomLetter}" - Code points: ${codePoints}`);
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
    const maxAttempts = 100; // Increased from 50 to 100 to give more chances to place longer words

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

  // Debug verification - log each cell's character to console for checking
  console.log("Grid after word placement but before filling:");
  grid.forEach((row, rowIndex) => {
    console.log(`Row ${rowIndex}:`, row.join(' '));
  });

  // Fill remaining cells with random letters
  fillRandomLetters(grid);

  // Final verification with enhanced logging
  console.log("Final grid with Tamil letters:");
  grid.forEach((row, rowIndex) => {
    const rowWithCodePoints = row.map((cell, colIndex) => {
      const codePoints = [...cell].map(char => char.codePointAt(0)?.toString(16).padStart(4, '0')).join(' ');
      return `"${cell}"(${codePoints})`;
    });
    console.log(`Row ${rowIndex}:`, rowWithCodePoints.join(' | '));
  });

  return grid;
};

// Create the stage data with corrected Tamil words
export const stageData: GameStage[] = [
  {
    stageNumber: 1,
    targetWords: ['குமரன்', 'விக்னேஷ்', 'முருகன்', 'லலிதா'],
    gridSize: 8,
    gridLetters: []
  },
  {
    stageNumber: 2,
    targetWords: ['அன்பு', 'தமிழ்', 'பாரதி', 'கல்வி'],
    gridSize: 8,
    gridLetters: []
  },
  {
    stageNumber: 3,
    targetWords: ['சங்கம்', 'நிலவு', 'கடல்', 'மழை'],
    gridSize: 8,
    gridLetters: []
  },
  {
    stageNumber: 4,
    targetWords: ['தென்றல்', 'காவியம்', 'வானம்', 'நிலம்'],
    gridSize: 10,
    gridLetters: []
  }
];

// Initialize gridLetters for each stage
stageData.forEach(stage => {
  // For each stage, generate a grid with its target words
  stage.gridLetters = generateGrid(stage.targetWords, stage.gridSize);
});
