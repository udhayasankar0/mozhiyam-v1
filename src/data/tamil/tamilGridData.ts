
// Parse the hardcoded Tamil letter grid from JSON
const tamilGridRows = [
  "யு ர இ க வி ல வ",
  "இ ற் யா ஞ் ர ல ரு",
  "ங் ல ஞா தி யா ங் க",
  "ர னி இ தை ங் இ ச்",
  "இ தி மு ழு நி லா க",
  "வ ல் ப ப் க இ ச்",
  "ரு ம் ர க ந மா வி"
];

// Convert the text rows into a 2D array of individual letters
export const hardcodedTamilGrid: string[][] = tamilGridRows.map(row => 
  row.split(' ').map(letter => letter.trim())
);
