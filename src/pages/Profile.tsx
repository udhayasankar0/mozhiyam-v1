
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ContentCard from '@/components/ContentCard';
import FollowButton from '@/components/FollowButton';
import FollowList from '@/components/FollowList';

const data = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
  { name: 'Aug', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Sep', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Oct', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Nov', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Dec', uv: 1890, pv: 4800, amt: 2181 },
];

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Get profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // If no ID is provided, use the current user's profile
        const profileId = id || user?.id;
        
        if (!profileId) {
          setLoading(false);
          return;
        }
        
        // Get profile data
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        setProfileUser({
          ...profileData,
          created_at: user && profileId === user.id ? user.created_at : profileData.created_at
        });
        
        // Get user posts
        const { data: posts, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', profileId)
          .order('created_at', { ascending: false });
          
        if (postsError) {
          console.error('Error fetching posts:', postsError);
          return;
        }
        
        setUserPosts(posts || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [id, user]);
  
  const joinedDate = profileUser?.created_at 
    ? formatDate(profileUser.created_at) 
    : user?.created_at 
      ? formatDate(user.created_at) 
      : 'Recently';
      
  const userEmail = profileUser?.username || (id ? 'User' : user?.email || 'No email');
  
  // Get user initials for avatar fallback
  const getInitials = () => {
    if (profileUser?.username) return profileUser.username.substring(0, 2).toUpperCase();
    if (!user?.email) return '??';
    return user.email.substring(0, 2).toUpperCase();
  };

  const isOwnProfile = !id || (user && id === user.id);

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left Column - Profile Summary */}
          <div className="md:col-span-1">
            <Card className="bg-white shadow-md rounded-lg overflow-hidden">
              <CardHeader className="flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src="/lovable-uploads/d8ec8cb6-fb3f-4663-bffd-f8c7748b84c9.png" alt="Profile" />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl font-semibold">{userEmail}</CardTitle>
                <CardDescription className="text-gray-500">User</CardDescription>
                
                {!isOwnProfile && (
                  <div className="mt-4">
                    <FollowButton userId={id || ''} />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Joined {joinedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>Community Member</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">User</Badge>
                  </div>
                </div>
              </CardContent>
              {isOwnProfile && (
                <CardFooter className="flex justify-center">
                  <Button>Edit Profile</Button>
                </CardFooter>
              )}
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="md:col-span-2 space-y-6">
            {/* Content Tabs */}
            <Tabs defaultValue="posts">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="followers">Followers</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts" className="mt-6">
                {userPosts.length > 0 ? (
                  <div className="space-y-4">
                    {userPosts.map((post) => (
                      <ContentCard 
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        content={post.content}
                        type={post.type}
                        createdAt={post.created_at}
                        authorId={post.user_id}
                        authorName={userEmail}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 text-gray-500">
                    No posts yet
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="followers" className="mt-6">
                {id || user?.id ? (
                  <FollowList userId={id || user?.id || ''} type="followers" />
                ) : (
                  <div className="text-center p-8 text-gray-500">
                    Loading followers...
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="following" className="mt-6">
                {id || user?.id ? (
                  <FollowList userId={id || user?.id || ''} type="following" />
                ) : (
                  <div className="text-center p-8 text-gray-500">
                    Loading following...
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {isOwnProfile && (
              <>
                {/* Overview Section */}
                <Card className="bg-white shadow-md rounded-lg overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Overview</CardTitle>
                    <CardDescription>Your account activity this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Account Settings Section */}
                <Card className="bg-white shadow-md rounded-lg overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Personal Information</AccordionTrigger>
                        <AccordionContent>
                          <div>
                            <p><strong>Email:</strong> {user?.email}</p>
                            <p><strong>Account Created:</strong> {joinedDate}</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Password</AccordionTrigger>
                        <AccordionContent>
                          <div>
                            <Button size="sm">Reset Password</Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>Notifications</AccordionTrigger>
                        <AccordionContent>
                          <div>
                            <p><strong>Email Notifications:</strong> Enabled</p>
                            <p><strong>Push Notifications:</strong> Disabled</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>

                {/* Usage Section */}
                <Card className="bg-white shadow-md rounded-lg overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Usage</CardTitle>
                    <CardDescription>Your recent activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableCaption>Recent activities on your account</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Date</TableHead>
                          <TableHead>Activity</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>-</TableCell>
                          <TableCell>Account Creation</TableCell>
                          <TableCell>Account created on {joinedDate}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
