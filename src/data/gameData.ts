
// Re-export all components from their respective files
export { GameStage } from './types/gameTypes';
export { stageData } from './stageData';
export { 
  generateGrid, 
  createEmptyGrid, 
  isValidPosition, 
  placeWord, 
  fillRandomLetters 
} from './utils/gridUtils';
export { hardcodedTamilGrid } from './tamil/tamilGridData';
