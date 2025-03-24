
import React, { useEffect, useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import ContentCard from '@/components/ContentCard';

// Sample data for demonstration
const sampleContent = [
  {
    id: 1,
    type: 'poem',
    title: 'காலத்தின் கோலம்',
    excerpt: 'வாழ்வின் சுழற்சியில் காலம் வரையும் கோலங்கள் எத்தனை அழகானவை. நாம் கடந்து செல்லும் பாதையில் விதைக்கப்படும் நினைவுகள் பூக்களாக மலர்கின்றன.',
    author: 'ரவிக்குமார்',
    likes: 24,
    comments: 5,
    date: '2 days ago'
  },
  {
    id: 2,
    type: 'story',
    title: 'மழைத்துளிகள்',
    excerpt: 'அந்த சிறிய கிராமத்தில் பெய்த மழை அனைவரின் வாழ்க்கையையும் மாற்றியது. குளத்தில் நிரம்பிய நீர் விவசாயிகளின் முகத்தில் புன்னகையை வரவழைத்தது.',
    author: 'அனிதா',
    likes: 42,
    comments: 8,
    date: '1 week ago'
  },
  {
    id: 3,
    type: 'opinion',
    title: 'மொழியின் முக்கியத்துவம்',
    excerpt: 'தமிழ் மொழியின் வளர்ச்சி இளைய தலைமுறையினரால் தொடர வேண்டும். நம் பாரம்பரியத்தை நாம் போற்றி பாதுகாக்க வேண்டிய நேரம் இது.',
    author: 'சுரேஷ்',
    likes: 37,
    comments: 15,
    date: '3 days ago'
  },
  {
    id: 4,
    type: 'poem',
    title: 'நிலவின் நினைவுகள்',
    excerpt: 'இரவில் ஒளிரும் நிலவு போல் நீ என் வாழ்வில் வந்து சென்றாய். உன் நினைவுகள் மட்டும் என்னுடன் நிலைத்து நிற்கின்றன.',
    author: 'கமலா',
    likes: 56,
    comments: 7,
    date: '4 days ago'
  },
  {
    id: 5,
    type: 'story',
    title: 'காற்றின் சுவடுகள்',
    excerpt: 'அந்த வீட்டில் வசிக்கும் அனைவரும் ஒரு மர்மத்தை சுமந்து கொண்டிருந்தனர். நான் அங்கு சென்றபோது அந்த மர்மம் கொஞ்சம் கொஞ்சமாக வெளிப்பட ஆரம்பித்தது.',
    author: 'விஜய்',
    likes: 29,
    comments: 10,
    date: '1 day ago'
  },
  {
    id: 6,
    type: 'opinion',
    title: 'கலை மற்றும் பண்பாடு',
    excerpt: 'தமிழ் கலை மற்றும் பண்பாடு உலகின் மிகப் பழமையான மற்றும் செழுமையான பாரம்பரியங்களில் ஒன்றாகும். நாம் அதை போற்றி பாதுகாக்க வேண்டியது நமது கடமை.',
    author: 'மாலதி',
    likes: 18,
    comments: 4,
    date: '5 days ago'
  },
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
      <div className="container mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1">Welcome to <span className="tamil">நூலகம்</span></h2>
          <p className="text-muted-foreground">Discover and share Tamil literature with our community</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="content-card glass-card h-64 animate-pulse-soft">
                <div className="p-5 h-full flex flex-col">
                  <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
                  <div className="mt-auto flex justify-between">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((content) => (
              <div key={content.id} className="animate-scale-in">
                <ContentCard 
                  type={content.type}
                  title={content.title}
                  excerpt={content.excerpt}
                  author={content.author}
                  likes={content.likes}
                  comments={content.comments}
                  date={content.date}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Index;
