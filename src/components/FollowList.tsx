
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import FollowButton from './FollowButton';

interface FollowUserType {
  id: string;
  username: string | null;
  avatar_url?: string;
}

interface FollowListProps {
  userId: string;
  type: 'followers' | 'following';
}

const FollowList: React.FC<FollowListProps> = ({ userId, type }) => {
  const [users, setUsers] = useState<FollowUserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        let query;
        
        if (type === 'followers') {
          // Get users who follow the specified user
          query = supabase
            .from('followers')
            .select(`
              follower_id,
              profiles!followers_follower_id_fkey (
                id,
                username
              )
            `)
            .eq('following_id', userId);
        } else {
          // Get users who are followed by the specified user
          query = supabase
            .from('followers')
            .select(`
              following_id,
              profiles!followers_following_id_fkey (
                id,
                username
              )
            `)
            .eq('follower_id', userId);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error(`Error fetching ${type}:`, error);
          return;
        }
        
        // Format the user data
        const formattedUsers: FollowUserType[] = data.map((item: any) => {
          const profile = type === 'followers' 
            ? item.profiles 
            : item.profiles;
            
          return {
            id: profile.id,
            username: profile.username || 'Anonymous User',
            avatar_url: '/lovable-uploads/d8ec8cb6-fb3f-4663-bffd-f8c7748b84c9.png' // Default avatar
          };
        });
        
        setUsers(formattedUsers);
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchUsers();
    }
  }, [userId, type]);
  
  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }
  
  if (users.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No {type} yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
          <Link to={`/profile/${user.id}`} className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar_url} alt={user.username || 'User'} />
              <AvatarFallback>
                {(user.username || 'User').substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.username || 'Anonymous User'}</p>
            </div>
          </Link>
          <FollowButton userId={user.id} />
        </div>
      ))}
    </div>
  );
};

export default FollowList;
