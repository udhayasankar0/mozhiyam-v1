
import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Book, BookOpen, Bold, Italic, Underline, Type, ChevronDown, Save } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const Editor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<'poem' | 'story'>('poem');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "தலைப்பு தேவை",
        description: "உங்கள் படைப்புக்கு ஒரு தலைப்பைக் கொடுங்கள்.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "உள்ளடக்கம் தேவை",
        description: "உங்கள் படைப்பை உள்ளிடவும்.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "வெற்றிகரமாக சேமிக்கப்பட்டது!",
        description: "உங்கள் படைப்பு சேமிக்கப்பட்டது.",
      });
    }, 1500);
  };

  const formatText = (format: 'bold' | 'italic' | 'underline') => {
    // This is a placeholder for text formatting functionality
    // In a real implementation, this would modify the selected text
    toast({
      title: "வடிவூட்டல் பயன்படுத்தப்பட்டது",
      description: `${format} வடிவூட்டல் பயன்படுத்தப்பட்டது.`,
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto pb-20 md:pb-0">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2 tamil">புதிய படைப்பு</h1>
            <p className="text-gray-600">
              உங்கள் எண்ணங்களை, கவிதைகளை அல்லது கதைகளை பகிரலாம்.
            </p>
          </div>

          <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        {contentType === 'poem' ? (
                          <>
                            <Book size={16} className="text-blue-500" />
                            <span className="tamil">கவிதை</span>
                          </>
                        ) : (
                          <>
                            <BookOpen size={16} className="text-emerald-500" />
                            <span className="tamil">சிறுகதை</span>
                          </>
                        )}
                        <ChevronDown size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => setContentType('poem')}>
                        <div className="flex items-center gap-2">
                          <Book size={16} className="text-blue-500" />
                          <span className="tamil">கவிதை</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setContentType('story')}>
                        <div className="flex items-center gap-2">
                          <BookOpen size={16} className="text-emerald-500" />
                          <span className="tamil">சிறுகதை</span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => formatText('bold')}
                    title="Bold"
                  >
                    <Bold size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => formatText('italic')}
                    title="Italic"
                  >
                    <Italic size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => formatText('underline')}
                    title="Underline"
                  >
                    <Underline size={16} />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Type size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <span className="text-lg">எழுத்துரு 1</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <span className="text-lg font-serif">எழுத்துரு 2</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <span className="text-lg font-mono">எழுத்துரு 3</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <Input
                  placeholder="தலைப்பு இங்கே உள்ளிடவும்"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium border-none shadow-none focus-visible:ring-0 px-0 tamil"
                />
              </div>
              
              <Textarea
                placeholder="உங்கள் எண்ணங்களை இங்கே பகிரவும்..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[400px] border-none shadow-none focus-visible:ring-0 px-0 resize-none tamil"
              />
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Save size={16} />
                )}
                <span className="tamil">பதிவிடுக</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Editor;
