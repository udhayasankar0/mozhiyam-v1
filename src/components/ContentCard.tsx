
import React, { useState } from 'react';
import { Heart, MessageSquare, Book, BookOpen, MessageSquare as Opinion, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  comments,
  date,
  userLiked: initialUserLiked,
  userDisliked: initialUserDisliked
}) => {
  const [liked, setLiked] = useState(initialUserLiked);
  const [disliked, setDisliked] = useState(initialUserDisliked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const { user } = useAuth();
  const { toast } = useToast();

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

  const handleLike = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to like posts',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (liked) {
        // Unlike
        await supabase.from('likes').delete().match({ user_id: user.id, post_id: id });
        setLikesCount(likesCount - 1);
        setLiked(false);
      } else {
        // If disliked, remove dislike first
        if (disliked) {
          await supabase.from('dislikes').delete().match({ user_id: user.id, post_id: id });
          setDisliked(false);
        }
        
        // Add like
        await supabase.from('likes').insert({ user_id: user.id, post_id: id });
        setLikesCount(likesCount + 1);
        setLiked(true);
      }
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
      toast({
        title: 'Sign in required',
        description: 'Please sign in to dislike posts',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (disliked) {
        // Remove dislike
        await supabase.from('dislikes').delete().match({ user_id: user.id, post_id: id });
        setDisliked(false);
      } else {
        // If liked, remove like first
        if (liked) {
          await supabase.from('likes').delete().match({ user_id: user.id, post_id: id });
          setLiked(false);
          setLikesCount(likesCount - 1);
        }
        
        // Add dislike
        await supabase.from('dislikes').insert({ user_id: user.id, post_id: id });
        setDisliked(true);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update dislike status',
        variant: 'destructive'
      });
      console.error('Dislike error:', error);
    }
  };

  const handleFollow = () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to follow authors',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Follow feature',
        description: 'This feature will be implemented soon',
      });
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
        
        <Link to={`/content/${type}/${id}`}>
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
            >
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
              <span className="text-xs">{likesCount}</span>
            </button>
            <button 
              className={`flex items-center gap-1 transition-colors ${disliked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
              onClick={handleDislike}
            >
              <Heart size={16} fill={disliked ? "currentColor" : "none"} className="rotate-180" />
            </button>
            <Link to={`/content/${type}/${id}`} className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
              <MessageSquare size={16} />
              <span className="text-xs">{comments}</span>
            </Link>
          </div>
          <button 
            className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded-full transition-colors"
            onClick={handleFollow}
          >
            <UserPlus size={14} />
            <span className="tamil">பின்தொடர</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
