
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import ContentCard from '@/components/ContentCard';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Content type definition
interface Content {
  id: string;
  type: 'poem' | 'story' | 'opinion';
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  author_name?: string;
  author_avatar?: string;
  likes: number;
  comments: number;
  userLiked?: boolean;
  userDisliked?: boolean;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contents, setContents] = useState<Content[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch posts from Supabase
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      
      // Get all posts ordered by creation date (newest first)
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!posts || posts.length === 0) {
        setContents([]);
        setIsLoading(false);
        return;
      }

      // For each post, get author info, likes count, dislikes count, comments count
      const postsWithDetails = await Promise.all(
        posts.map(async (post) => {
          // Get author info
          const { data: profileData } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', post.user_id)
            .single();

          // Get likes count
          const { count: likesCount } = await supabase
            .from('likes')
            .select('*', { count: 'exact' })
            .eq('post_id', post.id);

          // Get comments count
          const { count: commentsCount } = await supabase
            .from('comments')
            .select('*', { count: 'exact' })
            .eq('post_id', post.id);

          // Check if current user has liked or disliked
          let userLiked = false;
          let userDisliked = false;

          if (user) {
            const { data: likeData } = await supabase
              .from('likes')
              .select('*')
              .eq('post_id', post.id)
              .eq('user_id', user.id);

            const { data: dislikeData } = await supabase
              .from('dislikes')
              .select('*')
              .eq('post_id', post.id)
              .eq('user_id', user.id);

            userLiked = likeData && likeData.length > 0;
            userDisliked = dislikeData && dislikeData.length > 0;
          }

          return {
            ...post,
            author_name: profileData?.username || 'Unknown Author',
            author_avatar: '/lovable-uploads/d8ec8cb6-fb3f-4663-bffd-f8c7748b84c9.png', // Default avatar
            likes: likesCount || 0,
            comments: commentsCount || 0,
            userLiked,
            userDisliked
          };
        })
      );

      setContents(postsWithDetails);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load posts',
        variant: 'destructive',
      });
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch posts on load and when new post is created
  useEffect(() => {
    fetchPosts();
  }, [user]);

  // Navigate to NoName page
  const handleNoNameClick = () => {
    navigate('/noname');
  };

  return (
    <MainLayout onRefresh={fetchPosts}>
      <div className="container mx-auto pb-20 md:pb-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Welcome to <span className="tamil">நூலகம்</span></h2>
            <p className="text-gray-600">Explore content from our community</p>
          </div>
          <Button 
            onClick={handleNoNameClick}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Star className="mr-2 h-4 w-4" />
            <span className="tamil">NoName</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="content-card bg-white h-[75vh] w-full max-w-[640px] mx-auto animate-pulse-soft border border-gray-100 shadow-sm">
                <div className="p-5 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="flex-grow bg-gray-100 rounded"></div>
                  <div className="mt-4 flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : contents.length === 0 ? (
          <div className="text-center p-10">
            <h3 className="text-xl font-medium mb-2">No posts yet</h3>
            <p className="text-gray-500 mb-6">Be the first to create a post!</p>
            {user ? (
              <p>Click the "புதிய படைப்பு" button at the top right to create your first post.</p>
            ) : (
              <p>Sign in to create a post and get started!</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((content) => (
              <ContentCard
                key={content.id}
                id={content.id}
                type={content.type as 'poem' | 'story' | 'opinion'}
                title={content.title}
                excerpt={content.content.substring(0, 150) + (content.content.length > 150 ? '...' : '')}
                authorId={content.user_id}
                authorName={content.author_name || 'Unknown Author'}
                authorAvatar={content.author_avatar || '/lovable-uploads/d8ec8cb6-fb3f-4663-bffd-f8c7748b84c9.png'}
                likes={content.likes}
                comments={content.comments}
                date={new Date(content.created_at).toLocaleDateString()}
                userLiked={content.userLiked || false}
                userDisliked={content.userDisliked || false}
                onUpdate={fetchPosts}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Index;
