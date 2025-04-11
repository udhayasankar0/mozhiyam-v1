
import { GameStage } from './types/gameTypes';
import { generateGrid } from './utils/gridUtils';
import { hardcodedTamilGrid } from './tamil/tamilGridData';

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
  },
  {
    stageNumber: 5,
    targetWords: ['நிலா', 'வானம்', 'மழை', 'கடல்'],
    gridSize: 7,
    gridLetters: hardcodedTamilGrid
  }
];

// Initialize gridLetters for the first 4 stages with randomly generated grids
stageData.slice(0, 4).forEach(stage => {
  // For each stage, generate a grid with its target words
  stage.gridLetters = generateGrid(stage.targetWords, stage.gridSize);
});

// Stage 5 already has its hardcoded grid assigned
