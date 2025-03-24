
import React, { useEffect, useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Award, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import LeaderboardCard from '@/components/LeaderboardCard';

// Top writers data
const topWriters = [
  { id: 1, name: 'கமலா', followers: 215, works: 48, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/4.jpg' },
  { id: 2, name: 'ரவிக்குமார்', followers: 128, works: 36, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/1.jpg' },
  { id: 3, name: 'அனிதா', followers: 93, works: 24, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/2.jpg' },
  { id: 4, name: 'சுரேஷ்', followers: 76, works: 18, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/3.jpg' },
  { id: 5, name: 'விஜய்', followers: 64, works: 15, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/5.jpg' },
  { id: 6, name: 'மாலதி', followers: 43, works: 9, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/6.jpg' },
];

// Featured poems and stories
const featuredContent = {
  poemOfTheDay: {
    id: 1,
    type: 'poem',
    title: 'நிலவின் நினைவுகள்',
    excerpt: 'இரவில் ஒளிரும் நிலவு போல் நீ என் வாழ்வில் வந்து சென்றாய். உன் நினைவுகள் மட்டும் என்னுடன் நிலைத்து நிற்கின்றன.',
    content: 'இரவில் ஒளிரும் நிலவு போல் நீ என் வாழ்வில் வந்து சென்றாய். உன் நினைவுகள் மட்டும் என்னுடன் நிலைத்து நிற்கின்றன. வானில் தெரியும் நட்சத்திரங்கள் போல் உன் கண்கள் என் மனதில் மின்னுகின்றன. நீ இல்லாத வாழ்க்கை இருளாகத் தெரிகிறது. உன் புன்னகை மட்டும் என் நினைவில் சூரியனாக ஒளிர்கிறது. மீண்டும் ஒருமுறை உன்னைச் சந்திக்கும் நாளுக்காக காத்திருக்கிறேன்.',
    author: 'கமலா',
    authorAvatar: 'https://xsgames.co/randomusers/assets/avatars/female/4.jpg',
    likes: 56,
    comments: 7,
    date: '4 days ago',
    followers: 215,
  },
  storyOfTheDay: {
    id: 2,
    type: 'story',
    title: 'மழைத்துளிகள்',
    excerpt: 'அந்த சிறிய கிராமத்தில் பெய்த மழை அனைவரின் வாழ்க்கையையும் மாற்றியது. குளத்தில் நிரம்பிய நீர் விவசாயிகளின் முகத்தில் புன்னகையை வரவழைத்தது.',
    content: 'அந்த சிறிய கிராமத்தில் பெய்த மழை அனைவரின் வாழ்க்கையையும் மாற்றியது. குளத்தில் நிரம்பிய நீர் விவசாயிகளின் முகத்தில் புன்னகையை வரவழைத்தது. ஏரிக்கரையில் அமர்ந்து அந்த அழகைப் பார்க்கும் குழந்தைகள் கைதட்டி மகிழ்ந்தனர். பசுமை படர்ந்த வயல்களில் பறவைகள் கூட்டம் வந்து அமர்ந்தது. மழைக்குப் பின் வானவில் தோன்றியது போல் அந்த கிராமத்தில் புது வாழ்வு பிறந்தது.',
    author: 'அனிதா',
    authorAvatar: 'https://xsgames.co/randomusers/assets/avatars/female/2.jpg',
    likes: 42,
    comments: 8,
    date: '1 week ago',
    followers: 93,
  }
};

const WritersSpotlight = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <MainLayout>
      <div className="container mx-auto pb-20 md:pb-0">
        <div className="mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
            <Award size={24} className="text-amber-500" />
            <span className="tamil">சிறந்த எழுத்தாளர்கள்</span>
          </h2>
          <p className="text-gray-600">Today's top Tamil writers based on followers and engagement</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Leaderboard Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4 tamil">தரவரிசை</h3>
            
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="font-bold text-lg w-6 text-center text-gray-200">
                      {i + 1}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {topWriters.map((writer, index) => (
                  <LeaderboardCard
                    key={writer.id}
                    rank={index + 1}
                    name={writer.name}
                    followers={writer.followers}
                    works={writer.works}
                    avatar={writer.avatar}
                  />
                ))}
                
                <div className="mt-6">
                  <Link to="/leaderboard" className="text-green-600 text-sm font-medium flex items-center justify-center gap-1 hover:underline">
                    <span className="tamil">முழு தரவரிசையைப் பார்க்க</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Featured Content Section */}
          <div className="space-y-6">
            {/* Poem of the Day */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bookmark size={20} className="text-blue-500" />
                  <span className="tamil">கவிதை OF THE DAY</span>
                </h3>
              </div>
              
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <img src={featuredContent.poemOfTheDay.authorAvatar} alt={featuredContent.poemOfTheDay.author} className="w-8 h-8 rounded-full border border-gray-200" />
                    <span className="text-sm font-medium">{featuredContent.poemOfTheDay.author}</span>
                  </div>
                  <h4 className="text-xl font-semibold mb-2 tamil">{featuredContent.poemOfTheDay.title}</h4>
                  <p className="text-gray-700 mb-4 tamil line-clamp-4">
                    {featuredContent.poemOfTheDay.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{featuredContent.poemOfTheDay.likes} likes</span>
                      <span>{featuredContent.poemOfTheDay.comments} comments</span>
                    </div>
                    <Link to={`/content/poem/${featuredContent.poemOfTheDay.id}`} className="text-green-600 text-sm font-medium hover:underline">
                      <span className="tamil">முழுவதையும் படிக்க</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Story of the Day */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bookmark size={20} className="text-green-500" />
                  <span className="tamil">சிறுகதை OF THE DAY</span>
                </h3>
              </div>
              
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <img src={featuredContent.storyOfTheDay.authorAvatar} alt={featuredContent.storyOfTheDay.author} className="w-8 h-8 rounded-full border border-gray-200" />
                    <span className="text-sm font-medium">{featuredContent.storyOfTheDay.author}</span>
                  </div>
                  <h4 className="text-xl font-semibold mb-2 tamil">{featuredContent.storyOfTheDay.title}</h4>
                  <p className="text-gray-700 mb-4 tamil line-clamp-4">
                    {featuredContent.storyOfTheDay.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{featuredContent.storyOfTheDay.likes} likes</span>
                      <span>{featuredContent.storyOfTheDay.comments} comments</span>
                    </div>
                    <Link to={`/content/story/${featuredContent.storyOfTheDay.id}`} className="text-green-600 text-sm font-medium hover:underline">
                      <span className="tamil">முழுவதையும் படிக்க</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default WritersSpotlight;
