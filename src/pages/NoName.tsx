
import React, { useEffect, useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { MessageSquare, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Content type definition for posts
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
  commentsList?: Comment[];
}

interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  text: string;
  date: string;
}

const NoName = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

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

          // Get comments for this post
          const { data: commentsData } = await supabase
            .from('comments')
            .select('id, content, created_at, user_id')
            .eq('post_id', post.id)
            .order('created_at', { ascending: true });

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

          // Process comments to include author information
          const commentsWithAuthors = commentsData ? await Promise.all(
            commentsData.map(async (comment) => {
              const { data: commentUser } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', comment.user_id)
                .single();
                
              return {
                id: comment.id,
                author: commentUser?.username || 'Unknown User',
                authorAvatar: '/lovable-uploads/d8ec8cb6-fb3f-4663-bffd-f8c7748b84c9.png',
                text: comment.content,
                date: new Date(comment.created_at).toLocaleDateString()
              };
            })
          ) : [];

          // Cast the type to the allowed union type
          const postType = post.type as 'poem' | 'story' | 'opinion';

          return {
            ...post,
            type: postType,
            author_name: profileData?.username || 'Unknown Author',
            author_avatar: '/lovable-uploads/d8ec8cb6-fb3f-4663-bffd-f8c7748b84c9.png', // Default avatar
            likes: likesCount || 0,
            comments: commentsCount || 0,
            userLiked,
            userDisliked,
            commentsList: commentsWithAuthors
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

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const toggleComments = (contentId: string) => {
    setShowComments(showComments === contentId ? null : contentId);
  };

  const handleAddComment = async (contentId: string) => {
    if (!newComment.trim() || !user) return;
    
    try {
      // Add the comment to database
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: contentId,
          user_id: user.id,
          content: newComment
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Comment added successfully',
      });
      
      // Clear comment input and refresh data
      setNewComment('');
      fetchPosts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add comment',
        variant: 'destructive',
      });
    }
  };

  const handleLikeDislike = async (contentId: string, action: 'like' | 'dislike') => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to like or dislike posts',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Check if user already liked or disliked
      const { data: existingLike } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', contentId)
        .eq('user_id', user.id);

      const { data: existingDislike } = await supabase
        .from('dislikes')
        .select('*')
        .eq('post_id', contentId)
        .eq('user_id', user.id);

      const hasLiked = existingLike && existingLike.length > 0;
      const hasDisliked = existingDislike && existingDislike.length > 0;

      // Handle like action
      if (action === 'like') {
        if (hasLiked) {
          // Remove like if already liked
          await supabase
            .from('likes')
            .delete()
            .eq('post_id', contentId)
            .eq('user_id', user.id);
        } else {
          // Add like and remove dislike if exists
          await supabase
            .from('likes')
            .insert({ post_id: contentId, user_id: user.id });
          
          if (hasDisliked) {
            await supabase
              .from('dislikes')
              .delete()
              .eq('post_id', contentId)
              .eq('user_id', user.id);
          }
        }
      } 
      // Handle dislike action
      else if (action === 'dislike') {
        if (hasDisliked) {
          // Remove dislike if already disliked
          await supabase
            .from('dislikes')
            .delete()
            .eq('post_id', contentId)
            .eq('user_id', user.id);
        } else {
          // Add dislike and remove like if exists
          await supabase
            .from('dislikes')
            .insert({ post_id: contentId, user_id: user.id });
          
          if (hasLiked) {
            await supabase
              .from('likes')
              .delete()
              .eq('post_id', contentId)
              .eq('user_id', user.id);
          }
        }
      }

      // Refresh data
      fetchPosts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${action} post`,
        variant: 'destructive',
      });
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto pb-20 md:pb-0">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1 tamil">படைப்புகள்</h2>
          <p className="text-gray-600">Discover trending content from all authors</p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="content-card bg-white h-[75vh] w-full max-w-[640px] mx-auto animate-pulse-soft border border-gray-100 shadow-sm rounded-xl">
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
          <div className="text-center p-10 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-medium mb-2">No posts yet</h3>
            <p className="text-gray-500 mb-6">
              Be the first to create a post!
            </p>
            {user ? (
              <p>Click the "புதிய படைப்பு" button to create your first post.</p>
            ) : (
              <p>Sign in to create a post and get started!</p>
            )}
          </div>
        ) : (
          <Carousel className="w-full max-w-[640px] mx-auto" orientation="vertical">
            <CarouselContent className="-mt-1 h-[75vh]">
              {contents.map((content) => (
                <CarouselItem key={content.id} className="pt-1 md:basis-full h-full">
                  <div className="p-1 h-full">
                    <AspectRatio ratio={4/3} className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 h-full">
                      <div className="h-full flex flex-col">
                        <div className="p-4 border-b flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img 
                              src={content.author_avatar} 
                              alt={content.author_name} 
                              className="w-10 h-10 rounded-full border border-gray-200"
                            />
                            <div>
                              <p className="text-sm font-medium">{content.author_name}</p>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <span>{new Date(content.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-medium">
                            <span className={`tamil px-2 py-1 rounded-full ${
                              content.type === 'poem' ? 'bg-blue-100 text-blue-700' : 
                              content.type === 'story' ? 'bg-green-100 text-green-700' : 
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {content.type === 'poem' ? 'கவிதை' : 
                              content.type === 'story' ? 'சிறுகதை' : 'கருத்து'}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 flex-grow overflow-y-auto">
                          <h3 className="text-xl font-semibold mb-3 tamil">{content.title}</h3>
                          <p className="text-gray-700 mb-4 tamil whitespace-pre-line">
                            {content.content}
                          </p>
                        </div>

                        <div className="p-4 border-t">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <button 
                                className={`flex items-center gap-1 ${content.userLiked ? 'text-green-500' : 'text-gray-600 hover:text-green-500'} transition-colors`}
                                onClick={() => handleLikeDislike(content.id, 'like')}
                              >
                                <ThumbsUp className="h-6 w-6" />
                                <span>{content.likes}</span>
                              </button>

                              <button 
                                className={`flex items-center gap-1 ${content.userDisliked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'} transition-colors`}
                                onClick={() => handleLikeDislike(content.id, 'dislike')}
                              >
                                <ThumbsDown className="h-6 w-6" />
                                <span>{content.userDisliked ? "Disliked" : ""}</span>
                              </button>

                              <button 
                                className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors"
                                onClick={() => toggleComments(content.id)}
                              >
                                <MessageSquare className="h-6 w-6" />
                                <span>{content.comments}</span>
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <button className="text-gray-600 hover:text-green-500 transition-colors">
                                <Share2 className="h-6 w-6" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {showComments === content.id && (
                          <div className="p-4 bg-gray-50 border-t max-h-64 overflow-y-auto">
                            <h4 className="font-medium mb-3">Comments</h4>
                            
                            <div className="space-y-3 mb-4">
                              {content.commentsList && content.commentsList.length > 0 ? (
                                content.commentsList.map((comment) => (
                                  <div key={comment.id} className="flex gap-2">
                                    <img 
                                      src={comment.authorAvatar} 
                                      alt={comment.author} 
                                      className="w-8 h-8 rounded-full"
                                    />
                                    <div className="bg-white p-2 rounded-lg flex-1 shadow-sm">
                                      <div className="flex justify-between items-center">
                                        <p className="text-sm font-medium">{comment.author}</p>
                                        <span className="text-xs text-gray-500">{comment.date}</span>
                                      </div>
                                      <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
                              )}
                            </div>
                            
                            {user ? (
                              <div className="flex gap-2 items-center">
                                <img 
                                  src="/lovable-uploads/d8ec8cb6-fb3f-4663-bffd-f8c7748b84c9.png" 
                                  alt="Your avatar" 
                                  className="w-8 h-8 rounded-full"
                                />
                                <input
                                  type="text"
                                  placeholder="Add a comment..."
                                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment(content.id)}
                                />
                                <button
                                  className="text-sm bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors"
                                  onClick={() => handleAddComment(content.id)}
                                >
                                  Post
                                </button>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">Sign in to add a comment</p>
                            )}
                          </div>
                        )}
                      </div>
                    </AspectRatio>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1/2 -translate-x-1/2 top-4" />
            <CarouselNext className="left-1/2 -translate-x-1/2 bottom-4" />
          </Carousel>
        )}
      </div>
    </MainLayout>
  );
};

export default NoName;
