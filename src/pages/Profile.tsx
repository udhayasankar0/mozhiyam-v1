
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  const { user } = useAuth();
  
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
  
  const joinedDate = user?.created_at ? formatDate(user.created_at) : 'Recently';
  const userEmail = user?.email || 'No email';
  
  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user?.email) return '??';
    return user.email.substring(0, 2).toUpperCase();
  };

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
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Joined {joinedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">User</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button>Edit Profile</Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="md:col-span-2 space-y-6">

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
                        <p><strong>Email:</strong> {userEmail}</p>
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
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
