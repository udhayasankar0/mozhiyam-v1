
import React from 'react';
import { Coins } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
    <div className="bg-amber-50 rounded-full border border-amber-200 py-2 px-4 flex items-center">
      <Coins className="text-amber-500 mr-2" size={18} />
      <span className="font-bold text-xl">{score}</span>
    </div>
  );
};

export default ScoreDisplay;
