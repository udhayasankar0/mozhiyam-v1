
import React from 'react';
import { Heart, MessageSquare, Book, BookOpen, MessageSquare as Opinion } from 'lucide-react';

interface ContentCardProps {
  type: 'poem' | 'story' | 'opinion';
  title: string;
  excerpt: string;
  author: string;
  likes: number;
  comments: number;
  date: string;
}

const ContentCard: React.FC<ContentCardProps> = ({
  type,
  title,
  excerpt,
  author,
  likes,
  comments,
  date
}) => {
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

  return (
    <div className="content-card glass-card h-full">
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <span className="text-xs font-medium tamil">{getTypeLabel()}</span>
          </div>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 tamil">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 tamil">
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{author}</span>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <Heart size={16} />
              <span className="text-xs">{likes}</span>
            </button>
            <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <MessageSquare size={16} />
              <span className="text-xs">{comments}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
