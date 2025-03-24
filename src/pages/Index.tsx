
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import ContentCard from '@/components/ContentCard';
import { Award, Users, TrendingUp } from 'lucide-react';
import LeaderboardCard from '@/components/LeaderboardCard';

// Sample data for demonstration
const sampleContent = [
  {
    id: 1,
    type: 'poem',
    title: 'காலத்தின் கோலம்',
    excerpt: 'வாழ்வின் சுழற்சியில் காலம் வரையும் கோலங்கள் எத்தனை அழகானவை. நாம் கடந்து செல்லும் பாதையில் விதைக்கப்படும் நினைவுகள் பூக்களாக மலர்கின்றன.',
    author: 'ரவிக்குமார்',
    authorAvatar: 'https://xsgames.co/randomusers/assets/avatars/male/1.jpg',
    likes: 24,
    comments: 5,
    date: '2 days ago',
    followers: 128
  },
  {
    id: 2,
    type: 'story',
    title: 'மழைத்துளிகள்',
    excerpt: 'அந்த சிறிய கிராமத்தில் பெய்த மழை அனைவரின் வாழ்க்கையையும் மாற்றியது. குளத்தில் நிரம்பிய நீர் விவசாயிகளின் முகத்தில் புன்னகையை வரவழைத்தது.',
    author: 'அனிதா',
    authorAvatar: 'https://xsgames.co/randomusers/assets/avatars/female/2.jpg',
    likes: 42,
    comments: 8,
    date: '1 week ago',
    followers: 93
  },
  {
    id: 3,
    type: 'opinion',
    title: 'மொழியின் முக்கியத்துவம்',
    excerpt: 'தமிழ் மொழியின் வளர்ச்சி இளைய தலைமுறையினரால் தொடர வேண்டும். நம் பாரம்பரியத்தை நாம் போற்றி பாதுகாக்க வேண்டிய நேரம் இது.',
    author: 'சுரேஷ்',
    authorAvatar: 'https://xsgames.co/randomusers/assets/avatars/male/3.jpg',
    likes: 37,
    comments: 15,
    date: '3 days ago',
    followers: 76
  },
  {
    id: 4,
    type: 'poem',
    title: 'நிலவின் நினைவுகள்',
    excerpt: 'இரவில் ஒளிரும் நிலவு போல் நீ என் வாழ்வில் வந்து சென்றாய். உன் நினைவுகள் மட்டும் என்னுடன் நிலைத்து நிற்கின்றன.',
    author: 'கமலா',
    authorAvatar: 'https://xsgames.co/randomusers/assets/avatars/female/4.jpg',
    likes: 56,
    comments: 7,
    date: '4 days ago',
    followers: 215
  },
  {
    id: 5,
    type: 'story',
    title: 'காற்றின் சுவடுகள்',
    excerpt: 'அந்த வீட்டில் வசிக்கும் அனைவரும் ஒரு மர்மத்தை சுமந்து கொண்டிருந்தனர். நான் அங்கு சென்றபோது அந்த மர்மம் கொஞ்சம் கொஞ்சமாக வெளிப்பட ஆரம்பித்தது.',
    author: 'விஜய்',
    authorAvatar: 'https://xsgames.co/randomusers/assets/avatars/male/5.jpg',
    likes: 29,
    comments: 10,
    date: '1 day ago',
    followers: 64
  },
  {
    id: 6,
    type: 'opinion',
    title: 'கலை மற்றும் பண்பாடு',
    excerpt: 'தமிழ் கலை மற்றும் பண்பாடு உலகின் மிகப் பழமையான மற்றும் செழுமையான பாரம்பரியங்களில் ஒன்றாகும். நாம் அதை போற்றி பாதுகாக்க வேண்டியது நமது கடமை.',
    author: 'மாலதி',
    authorAvatar: 'https://xsgames.co/randomusers/assets/avatars/female/6.jpg',
    likes: 18,
    comments: 4,
    date: '5 days ago',
    followers: 43
  },
];

// Top writers data
const topWriters = [
  { id: 1, name: 'கமலா', followers: 215, works: 48, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/4.jpg' },
  { id: 2, name: 'ரவிக்குமார்', followers: 128, works: 36, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/1.jpg' },
  { id: 3, name: 'அனிதா', followers: 93, works: 24, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/2.jpg' }
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contents, setContents] = useState<any[]>([]);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setContents(sampleContent);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto pb-20 md:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-1">Welcome to <span className="tamil">நூலகம்</span></h2>
              <p className="text-gray-600">Discover and share Tamil literature with our community</p>
            </div>

            {isLoading ? (
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="content-card bg-white h-64 animate-pulse-soft border border-gray-100 shadow-sm">
                    <div className="p-5 h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                        <div>
                          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                      <div className="mt-auto flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {contents.map((content) => (
                  <div key={content.id} className="animate-scale-in">
                    <ContentCard 
                      type={content.type}
                      title={content.title}
                      excerpt={content.excerpt}
                      author={content.author}
                      authorAvatar={content.authorAvatar}
                      likes={content.likes}
                      comments={content.comments}
                      date={content.date}
                      followers={content.followers}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar content - Leaderboard and trending */}
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award size={18} className="text-amber-500" />
                  <h3 className="font-semibold">சிறந்த எழுத்தாளர்கள்</h3>
                </div>
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
                </div>
                <div className="mt-4">
                  <Link to="/leaderboard" className="text-primary text-sm font-medium flex items-center justify-center gap-1 hover:underline">
                    <span className="tamil">முழு தரவரிசையைப் பார்க்க</span>
                    <TrendingUp size={14} />
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Users size={18} className="text-blue-500" />
                  <h3 className="font-semibold">பின்தொடர தகுந்தவர்கள்</h3>
                </div>
                <div className="space-y-3">
                  {topWriters.slice(0, 2).map((writer) => (
                    <div key={writer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={writer.avatar} alt={writer.name} className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="text-sm font-medium tamil">{writer.name}</p>
                          <p className="text-xs text-gray-500">{writer.works} படைப்புகள்</p>
                        </div>
                      </div>
                      <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded-full transition-colors">
                        பின்தொடர்
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
