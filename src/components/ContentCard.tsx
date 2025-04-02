
import React, { useState } from 'react';
import { Heart, MessageSquare, Book, BookOpen, MessageSquare as Opinion, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ContentCardProps {
  type: 'poem' | 'story' | 'opinion';
  title: string;
  excerpt: string;
  author: string;
  authorAvatar: string;
  likes: number;
  comments: number;
  date: string;
  followers: number;
}

const ContentCard: React.FC<ContentCardProps> = ({
  type,
  title,
  excerpt,
  author,
  authorAvatar,
  likes: initialLikes,
  comments,
  date,
  followers
}) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

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

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="content-card bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-100 shadow-sm">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <Link to={`/profile/${author}`} className="flex items-center gap-3">
            <img 
              src={authorAvatar} 
              alt={author} 
              className="w-10 h-10 rounded-full border border-gray-200"
            />
            <div>
              <p className="text-sm font-medium">{author}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>{date}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="flex items-center gap-1">
                  {followers} <span className="tamil">பின்தொடர்பவர்கள்</span>
                </span>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <span className="text-xs font-medium tamil">{getTypeLabel()}</span>
          </div>
        </div>
        
        <Link to={`/content/${type}/${title}`}>
          <h3 className="text-lg font-semibold mb-2 tamil hover:text-primary transition-colors">{title}</h3>
        </Link>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 tamil">
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              className={`flex items-center gap-1 transition-colors ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
              onClick={handleLike}
            >
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
              <span className="text-xs">{likes}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
              <MessageSquare size={16} />
              <span className="text-xs">{comments}</span>
            </button>
          </div>
          <button className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded-full transition-colors">
            <UserPlus size={14} />
            <span className="tamil">பின்தொடர</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
