
import React, { useState } from 'react';
import { Heart, MessageSquare, Book, BookOpen, MessageSquare as Opinion, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from "@/components/ui/textarea";

interface ContentCardProps {
  id: string;
  type: 'poem' | 'story' | 'opinion';
  title: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  likes: number;
  comments: number;
  date: string;
  userLiked: boolean;
  userDisliked: boolean;
  onUpdate: () => void;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  author_name?: string;
  author_avatar?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({
  id,
  type,
  title,
  excerpt,
  authorId,
  authorName,
  authorAvatar,
  likes: initialLikes,
  comments: initialComments,
  date,
  userLiked: initialUserLiked,
  userDisliked: initialUserDisliked,
  onUpdate
}) => {
  const [liked, setLiked] = useState(initialUserLiked);
  const [disliked, setDisliked] = useState(initialUserDisliked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [commentsCount, setCommentsCount] = useState(initialComments);
  const [showComments, setShowComments] = useState(false);
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const getTypeIcon = () => {
    switch (type) {
      case 'poem':
        return <Book size={16} className="text-blue-500" />;
      case 'story':
        return <BookOpen size={16} className="text-emerald-500" />;
      case 'opinion':
        return <Opinion size={16} className="text-amber-500" />;
      default:
        return null;
    }
  };
  
  const getTypeLabel = () => {
    switch (type) {
      case 'poem':
        return 'கவிதை';
      case 'story':
        return 'சிறுகதை';
      case 'opinion':
        return 'கருத்து';
      default:
        return '';
    }
  };

  const fetchComments = async () => {
    if (!showComments) return;
    
    try {
      setIsLoadingComments(true);
      
      // Fetch comments from the database
      const { data: commentsData, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (!commentsData) {
        setCommentsList([]);
        return;
      }
      
      // Get author information for each comment
      const commentsWithAuthor = await Promise.all(
        commentsData.map(async (comment) => {
          const { data: authorData } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', comment.user_id)
            .single();
            
          return {
            ...comment,
            author_name: authorData?.username || 'Unknown User',
            author_avatar: '/lovable-uploads/d8ec8cb6-fb3f-4663-bffd-f8c7748b84c9.png', // Default avatar
          };
        })
      );
      
      setCommentsList(commentsWithAuthor);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      });
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Fetch comments when the dialog is opened
  React.useEffect(() => {
    fetchComments();
  }, [showComments]);

  const handleLike = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      if (liked) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', id);
        setLikesCount(likesCount - 1);
        setLiked(false);
      } else {
        // If disliked, remove dislike first
        if (disliked) {
          await supabase
            .from('dislikes')
            .delete()
            .eq('user_id', user.id)
            .eq('post_id', id);
          setDisliked(false);
        }
        
        // Add like
        await supabase
          .from('likes')
          .insert({ user_id: user.id, post_id: id });
        setLikesCount(likesCount + 1);
        setLiked(true);
      }
      
      // Notify parent to update the data
      onUpdate();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update like status',
        variant: 'destructive'
      });
      console.error('Like error:', error);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      if (disliked) {
        // Remove dislike
        await supabase
          .from('dislikes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', id);
        setDisliked(false);
      } else {
        // If liked, remove like first
        if (liked) {
          await supabase
            .from('likes')
            .delete()
            .eq('user_id', user.id)
            .eq('post_id', id);
          setLiked(false);
          setLikesCount(likesCount - 1);
        }
        
        // Add dislike
        await supabase
          .from('dislikes')
          .insert({ user_id: user.id, post_id: id });
        setDisliked(true);
      }
      
      // Notify parent to update the data
      onUpdate();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update dislike status',
        variant: 'destructive'
      });
      console.error('Dislike error:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!newComment.trim()) return;
    
    try {
      setIsPostingComment(true);
      
      // Add comment to database
      const { error } = await supabase
        .from('comments')
        .insert({
          content: newComment.trim(),
          post_id: id,
          user_id: user.id
        });
        
      if (error) throw error;
      
      // Update comment count
      setCommentsCount(count => count + 1);
      setNewComment('');
      
      // Fetch updated comments list
      fetchComments();
      
      // Notify parent to update data
      onUpdate();
      
      toast({
        title: 'Success',
        description: 'Your comment has been posted',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to post comment',
        variant: 'destructive'
      });
      console.error('Comment error:', error);
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleShowComments = () => {
    if (!showComments) {
      setShowComments(true);
    } else {
      setShowComments(false);
    }
  };

  return (
    <div className="content-card bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-100 shadow-sm">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <Link to={`/profile/${authorId}`} className="flex items-center gap-3">
            <img 
              src={authorAvatar} 
              alt={authorName} 
              className="w-10 h-10 rounded-full border border-gray-200"
            />
            <div>
              <p className="text-sm font-medium">{authorName}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>{date}</span>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <span className="text-xs font-medium tamil">{getTypeLabel()}</span>
          </div>
        </div>
        
        <Link to={`/content/${id}`}>
          <h3 className="text-lg font-semibold mb-2 tamil hover:text-primary transition-colors">{title}</h3>
        </Link>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 tamil">
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              className={`flex items-center gap-1 transition-colors ${liked ? 'text-green-500' : 'text-gray-500 hover:text-green-500'}`}
              onClick={handleLike}
              aria-label={liked ? "Unlike" : "Like"}
            >
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
              <span className="text-xs">{likesCount}</span>
            </button>
            <button 
              className={`flex items-center gap-1 transition-colors ${disliked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
              onClick={handleDislike}
              aria-label={disliked ? "Remove dislike" : "Dislike"}
            >
              <Heart size={16} fill={disliked ? "currentColor" : "none"} className="rotate-180" />
            </button>
            <button
              className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
              onClick={handleShowComments}
              aria-label="Show comments"
            >
              <MessageSquare size={16} />
              <span className="text-xs">{commentsCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments Dialog */}
      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comments on "{title}"</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Add comment form */}
            {user && (
              <div className="flex flex-col gap-2">
                <Textarea 
                  placeholder="Add your comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px]"
                  disabled={isPostingComment}
                />
                <Button 
                  onClick={handleCommentSubmit} 
                  disabled={!newComment.trim() || isPostingComment}
                  className="self-end"
                >
                  {isPostingComment ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            )}
            
            {/* Comments list */}
            <div className="space-y-4 mt-4">
              {isLoadingComments ? (
                <div className="py-4 text-center">Loading comments...</div>
              ) : commentsList.length === 0 ? (
                <div className="py-4 text-center text-gray-500">No comments yet. Be the first to comment!</div>
              ) : (
                commentsList.map((comment) => (
                  <div key={comment.id} className="border-b pb-4">
                    <div className="flex items-start gap-3">
                      <img 
                        src={comment.author_avatar} 
                        alt={comment.author_name} 
                        className="w-8 h-8 rounded-full mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm">{comment.author_name}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentCard;
