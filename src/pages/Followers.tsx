
import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FollowList from '@/components/FollowList';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Followers = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('followers');
  const { toast } = useToast();

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10">
          <div className="text-center p-8 bg-white shadow-sm rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-gray-600">You need to be signed in to view your followers.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  console.log('Followers page - Current user ID:', user.id);

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6 tamil">பின்தொடர்பவர்கள்</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          
          <TabsContent value="followers" className="mt-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">People Following You</h2>
              {user && user.id && (
                <FollowList userId={user.id} type="followers" />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="following" className="mt-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">People You Follow</h2>
              {user && user.id && (
                <FollowList userId={user.id} type="following" />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Followers;
