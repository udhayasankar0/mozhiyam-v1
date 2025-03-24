
import React, { useState, useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Award, TrendingUp, Star, BookOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample leaderboard data
const writers = [
  { id: 1, name: 'கமலா', followers: 215, works: 48, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/4.jpg', likes: 890 },
  { id: 2, name: 'ரவிக்குமார்', followers: 128, works: 36, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/1.jpg', likes: 645 },
  { id: 3, name: 'அனிதா', followers: 93, works: 24, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/2.jpg', likes: 482 },
  { id: 4, name: 'சுரேஷ்', followers: 76, works: 18, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/3.jpg', likes: 320 },
  { id: 5, name: 'விஜய்', followers: 64, works: 15, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/5.jpg', likes: 289 },
  { id: 6, name: 'மாலதி', followers: 43, works: 12, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/6.jpg', likes: 176 },
  { id: 7, name: 'அரவிந்த்', followers: 39, works: 10, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/7.jpg', likes: 154 },
  { id: 8, name: 'கீர்த்தி', followers: 27, works: 8, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/8.jpg', likes: 108 },
  { id: 9, name: 'தினேஷ்', followers: 18, works: 6, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/9.jpg', likes: 82 },
  { id: 10, name: 'ஜனனி', followers: 15, works: 4, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/10.jpg', likes: 64 },
];

const Leaderboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("followers");
  const [sortedWriters, setSortedWriters] = useState(writers);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let sorted = [...writers];
    
    switch (activeTab) {
      case "followers":
        sorted.sort((a, b) => b.followers - a.followers);
        break;
      case "works":
        sorted.sort((a, b) => b.works - a.works);
        break;
      case "likes":
        sorted.sort((a, b) => b.likes - a.likes);
        break;
      default:
        break;
    }
    
    setSortedWriters(sorted);
  }, [activeTab]);

  return (
    <MainLayout>
      <div className="container mx-auto pb-20 md:pb-0">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Award size={24} className="text-amber-500" />
            <h1 className="text-2xl font-bold tamil">தரவரிசை</h1>
          </div>
          <p className="text-gray-600">
            இங்கு சிறந்த எழுத்தாளர்களின் தரவரிசையைக் காணலாம்.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <Tabs defaultValue="followers" value={activeTab} onValueChange={setActiveTab}>
            <div className="p-4 border-b border-gray-100">
              <TabsList className="grid grid-cols-3 bg-gray-100">
                <TabsTrigger value="followers" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} />
                    <span className="tamil">பின்தொடர்பவர்கள்</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="works" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} />
                    <span className="tamil">படைப்புகள்</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="likes" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <div className="flex items-center gap-2">
                    <Star size={16} />
                    <span className="tamil">விருப்பங்கள்</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="followers" className="m-0">
              <LeaderboardContent writers={sortedWriters} isLoading={isLoading} sortType="followers" />
            </TabsContent>
            <TabsContent value="works" className="m-0">
              <LeaderboardContent writers={sortedWriters} isLoading={isLoading} sortType="works" />
            </TabsContent>
            <TabsContent value="likes" className="m-0">
              <LeaderboardContent writers={sortedWriters} isLoading={isLoading} sortType="likes" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

interface LeaderboardContentProps {
  writers: typeof writers;
  isLoading: boolean;
  sortType: 'followers' | 'works' | 'likes';
}

const LeaderboardContent: React.FC<LeaderboardContentProps> = ({ writers, isLoading, sortType }) => {
  if (isLoading) {
    return (
      <div className="p-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3 animate-pulse">
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            <div className="flex-1 flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="w-16 h-6 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4">
      {writers.map((writer, index) => (
        <div key={writer.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
          <div className={`font-bold text-lg w-6 text-center ${index < 3 ? 'text-amber-500' : 'text-gray-500'}`}>
            {index + 1}
          </div>
          <div className="flex-1 flex items-center gap-3">
            <img 
              src={writer.avatar} 
              alt={writer.name} 
              className="w-12 h-12 rounded-full border border-gray-200"
            />
            <div>
              <p className="font-medium tamil">{writer.name}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{writer.followers} பின்தொடர்பவர்கள்</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>{writer.works} படைப்புகள்</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold">
              {sortType === 'followers' && <span>{writer.followers}</span>}
              {sortType === 'works' && <span>{writer.works}</span>}
              {sortType === 'likes' && <span>{writer.likes}</span>}
            </div>
            <div className="text-xs text-gray-500 tamil">
              {sortType === 'followers' && <span>பின்தொடர்பவர்கள்</span>}
              {sortType === 'works' && <span>படைப்புகள்</span>}
              {sortType === 'likes' && <span>விருப்பங்கள்</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
