
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, Lightbulb } from 'lucide-react';
import { stageData } from '@/data/gameData';
import WordGrid from '@/components/game/WordGrid';
import StageSelector from '@/components/game/StageSelector';
import TargetWordsList from '@/components/game/TargetWordsList';
import ScoreDisplay from '@/components/game/ScoreDisplay';
import { useAuth } from '@/context/AuthContext';

const Vilaiyattu = () => {
  const [currentStage, setCurrentStage] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Login Required",
        description: "Please log in or register to access the game.",
        variant: "destructive",
      });
      navigate('/auth');
    }
  }, [user, isLoading, navigate, toast]);

  // Reset found words when stage changes
  useEffect(() => {
    setFoundWords([]);
  }, [currentStage]);

  const handleWordFound = (word: string) => {
    if (!foundWords.includes(word)) {
      const newFoundWords = [...foundWords, word];
      setFoundWords(newFoundWords);
      setScore(prevScore => prevScore + 10);
      
      toast({
        title: "சரியான சொல்!",
        description: `"${word}" கண்டுபிடிக்கப்பட்டது. (+10 புள்ளிகள்)`,
        variant: "default",
      });

      // Check if stage is complete
      if (currentStage !== null && newFoundWords.length === stageData[currentStage - 1].targetWords.length) {
        toast({
          title: "நிலை முடிந்தது!",
          description: `நிலை ${currentStage} முடிந்தது! மொத்த மதிப்பெண்: ${score + 10}`,
          variant: "default",
        });
      }
    }
  };

  // If user is not authenticated, show loading while redirecting
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6 flex items-center justify-center min-h-[50vh]">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  // If user is not authenticated, we'll redirect in the useEffect
  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6 flex items-center justify-center min-h-[50vh]">
          <div className="text-center p-8 bg-amber-50 rounded-lg border border-amber-200">
            <h2 className="text-xl font-bold mb-4">Access Restricted</h2>
            <p className="mb-4">Please log in or register to play the விளையாட்டு game.</p>
            <Button onClick={() => navigate('/auth')}>
              Go to Login
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const renderGameContent = () => {
    if (currentStage === null) {
      return <StageSelector onSelectStage={setCurrentStage} />;
    }

    const stageInfo = stageData[currentStage - 1];
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentStage(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>பின் செல்க</span>
          </Button>
          <div className="text-center">
            <h2 className="text-xl font-bold mb-1">நிலை {currentStage}</h2>
            <p className="text-sm text-muted-foreground">4 சொற்களைக் கண்டுபிடிக்கவும்</p>
          </div>
          <ScoreDisplay score={score} />
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 order-2 md:order-1">
            <WordGrid 
              gridLetters={stageInfo.gridLetters} 
              targetWords={stageInfo.targetWords}
              onWordFound={handleWordFound}
              foundWords={foundWords}
            />
          </div>
          <div className="md:w-64 order-1 md:order-2">
            <TargetWordsList 
              targetWords={stageInfo.targetWords} 
              foundWords={foundWords} 
            />
            <div className="mt-4 p-4 bg-amber-50 rounded-md border border-amber-200">
              <div className="flex items-center gap-2 text-amber-700 mb-2">
                <Lightbulb size={18} />
                <h3 className="font-medium">குறிப்பு</h3>
              </div>
              <p className="text-sm text-amber-800">
                சொற்கள் கிடைமட்டமாக, செங்குத்தாக அல்லது சாய்வாக அமைந்திருக்கும். அவற்றைக் கண்டுபிடிக்க எழுத்துக்களைத் தேர்ந்தெடுக்கவும்.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">விளையாட்டு</h1>
          <p className="text-gray-600">தமிழ் சொற்களைக் கண்டுபிடிக்கும் விளையாட்டு</p>
        </div>
        
        {renderGameContent()}
      </div>
    </MainLayout>
  );
};

export default Vilaiyattu;
