
import React, { useState, useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, Heart, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContentCard from '@/components/ContentCard';

const userProfile = {
  id: 1,
  name: 'ரவிக்குமார்',
  bio: 'எழுத்து என் ஆன்மாவின் மொழி. தமிழ் இலக்கியத்தில் ஆர்வம் கொண்டவர். கவிதைகள் மற்றும் சிறுகதைகள் எழுதுவதில் விருப்பம் கொண்டவர்.',
  avatar: 'https://xsgames.co/randomusers/assets/avatars/male/1.jpg',
  followers: 128,
  following: 45,
  posts: 36,
  joined: 'ஜனவரி 2022'
};

// Sample content data
const userContent = [
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
    id: 7,
    type: 'poem',
    title: 'காற்றின் இசை',
    excerpt: 'காற்று தன் இசையை பாடும்போது, இயற்கையின் நடனம் தொடங்குகிறது. மரங்கள் தலையசைக்கின்றன, மலர்கள் புன்னகைக்கின்றன, நாமும் இதயத்தில் இசையை உணர்கிறோம்.',
    author: 'ரவிக்குமார்',
    authorAvatar: 'https://xsgames.co/randomusers/assets/avatars/male/1.jpg',
    likes: 17,
    comments: 3,
    date: '1 week ago',
    followers: 128
  },
  {
    id: 9,
    type: 'story',
    title: 'ஓவியனின் கனவு',
    excerpt: 'சிறு வயதில் ஓவியம் வரைவதில் ஆர்வம் கொண்ட ராமு, தன் கிராமத்தை விட்டு ஓவிய பயிற்சிக்காக நகரத்துக்கு வந்தான். அவன் சந்தித்த சவால்கள், அவன் கனவை நிஜமாக்கிய கதை.',
    author: 'ரவிக்குமார்',
    authorAvatar: 'https://xsgames.co/randomusers/assets/avatars/male/1.jpg',
    likes: 31,
    comments: 7,
    date: '3 weeks ago',
    followers: 128
  }
];

// Sample follower data
const followers = [
  { id: 1, name: 'கமலா', avatar: 'https://xsgames.co/randomusers/assets/avatars/female/4.jpg', works: 48 },
  { id: 2, name: 'அனிதா', avatar: 'https://xsgames.co/randomusers/assets/avatars/female/2.jpg', works: 24 },
  { id: 3, name: 'சுரேஷ்', avatar: 'https://xsgames.co/randomusers/assets/avatars/male/3.jpg', works: 18 },
  { id: 4, name: 'விஜய்', avatar: 'https://xsgames.co/randomusers/assets/avatars/male/5.jpg', works: 15 },
];

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("works");

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm mb-6">
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name} 
                  className="w-24 h-24 rounded-full border-4 border-white shadow"
                />
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl font-bold tamil mb-2">{userProfile.name}</h1>
                  <p className="text-gray-600 mb-4 tamil">{userProfile.bio}</p>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold">{userProfile.posts}</div>
                      <div className="text-xs text-gray-500 tamil">படைப்புகள்</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{userProfile.followers}</div>
                      <div className="text-xs text-gray-500 tamil">பின்தொடர்பவர்கள்</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{userProfile.following}</div>
                      <div className="text-xs text-gray-500 tamil">பின்தொடர்பவைi</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit size={16} />
                      <span className="tamil">தொகு</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs Content */}
          <Tabs defaultValue="works" value={activeTab} onValueChange={setActiveTab}>
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <TabsList className="grid grid-cols-2 bg-gray-100">
                  <TabsTrigger value="works" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} />
                      <span className="tamil">படைப்புகள்</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="followers" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span className="tamil">பின்தொடர்பவர்கள்</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="works" className="m-0 p-4">
                {isLoading ? (
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
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
                    {userContent.map((content) => (
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
              </TabsContent>
              
              <TabsContent value="followers" className="m-0 p-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 animate-pulse">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                        <div className="w-20 h-8 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {followers.map((follower) => (
                      <div key={follower.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <img 
                            src={follower.avatar} 
                            alt={follower.name} 
                            className="w-12 h-12 rounded-full border border-gray-200"
                          />
                          <div>
                            <p className="font-medium tamil">{follower.name}</p>
                            <p className="text-xs text-gray-500 tamil">{follower.works} படைப்புகள்</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Users size={14} className="mr-1" />
                          <span className="tamil">பின்தொடர்கிறது</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
