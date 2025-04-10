
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface TargetWordsListProps {
  targetWords: string[];
  foundWords: string[];
}

const TargetWordsList: React.FC<TargetWordsListProps> = ({ targetWords, foundWords }) => {
  return (
    <div className="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-3">தேடவேண்டிய சொற்கள்</h3>
      <ul className="space-y-2">
        {targetWords.map((word, index) => {
          const isFound = foundWords.includes(word);
          
          return (
            <li 
              key={index}
              className={cn(
                "flex items-center p-2 rounded-md transition-all duration-300",
                isFound ? "bg-green-50 text-green-800" : "bg-gray-50"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center mr-3 transition-all duration-300",
                isFound ? "bg-green-600 text-white" : "bg-gray-300"
              )}>
                {isFound ? <Check size={14} /> : index + 1}
              </div>
              <span className={cn(
                "flex-1 text-lg transition-all duration-300", 
                isFound && "line-through decoration-2"
              )}>
                {word}
              </span>
            </li>
          );
        })}
      </ul>
      
      <div className="mt-4 text-sm text-gray-600 flex items-center justify-between">
        <span>
          <span className="font-medium">{foundWords.length}</span> / {targetWords.length} கண்டுபிடிக்கப்பட்டது
        </span>
        {foundWords.length === targetWords.length && (
          <span className="text-green-600 font-medium animate-pulse">நிறைவு!</span>
        )}
      </div>
    </div>
  );
};

export default TargetWordsList;
