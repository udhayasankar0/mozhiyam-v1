
import React from 'react';
import { stageData } from '@/data/gameData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Lock, Trophy } from 'lucide-react';

interface StageSelectorProps {
  onSelectStage: (stageNumber: number) => void;
}

const StageSelector: React.FC<StageSelectorProps> = ({ onSelectStage }) => {
  // In a real application, we would get this from user data in the database
  const getHighestCompletedStage = () => {
    const savedProgress = localStorage.getItem('gameProgress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        return progress.highestStage || 0;
      } catch (e) {
        return 0;
      }
    }
    return 0;
  };

  const highestCompletedStage = getHighestCompletedStage();

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">நிலைகளைத் தேர்ந்தெடுக்கவும்</h1>
        <p className="text-gray-600">ஒவ்வொரு நிலையிலும் நான்கு தமிழ் சொற்களைக் கண்டுபிடிக்கவும்</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stageData.map((stage) => {
          const isLocked = stage.stageNumber > highestCompletedStage + 1;
          const isCompleted = stage.stageNumber <= highestCompletedStage;
          
          return (
            <Card 
              key={stage.stageNumber}
              className={`${isLocked ? 'opacity-70' : ''} hover:shadow-md transition-shadow`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <CheckCircle2 className="text-green-600" size={24} />
                    ) : isLocked ? (
                      <Lock className="text-gray-400" size={24} />
                    ) : (
                      <Trophy className="text-amber-500" size={24} />
                    )}
                    <h3 className="text-xl font-semibold">நிலை {stage.stageNumber}</h3>
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {stage.targetWords.length} சொற்கள்
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    {isLocked ? (
                      'இந்த நிலையைத் திறக்க முந்தைய நிலைகளை முடிக்கவும்.'
                    ) : (
                      'இந்த நிலையில் 4 தமிழ் சொற்களைக் கண்டுபிடிக்கவும்.'
                    )}
                  </p>
                </div>
                
                <Button 
                  className="w-full" 
                  disabled={isLocked}
                  onClick={() => onSelectStage(stage.stageNumber)}
                  variant={isCompleted ? "outline" : "default"}
                >
                  {isCompleted ? "மீண்டும் விளையாடு" : isLocked ? "பூட்டப்பட்டுள்ளது" : "விளையாடு"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="bg-green-50 p-4 rounded-md border border-green-200">
        <h3 className="font-semibold text-green-800 mb-2">விளையாட்டு வழிமுறைகள்</h3>
        <ul className="text-sm text-green-700 space-y-2">
          <li>• எழுத்துக்கட்டத்தில் தமிழ் சொற்களைக் கண்டுபிடிக்கவும்</li>
          <li>• சொற்கள் கிடைமட்டம், செங்குத்து அல்லது சாய்வாக இருக்கலாம்</li>
          <li>• சரியான சொல் தேர்ந்தெடுக்கப்பட்டால் 10 புள்ளிகள் கிடைக்கும்</li>
          <li>• நிலையை முடிக்க அனைத்து 4 சொற்களையும் கண்டுபிடிக்கவும்</li>
        </ul>
      </div>
    </div>
  );
};

export default StageSelector;
