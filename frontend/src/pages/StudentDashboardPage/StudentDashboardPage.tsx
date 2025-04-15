import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SocialLinkType } from '../MentorPage/types';
import { SocialLinks } from '../MentorPage/components/SocialLinks/SocialLinks';
import { AlertCircle, MessageCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface RequestStatus {
  value: 'active' | 'pending' | 'rejected';
  label: string;
  color: string;
}

interface MentorRequest {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar?: string;
  status: RequestStatus['value'];
  errorDescription: string;
  socialLinks: SocialLinkType[];
  createdAt: string;
}

const StudentDashboardPage = () => {
  const statuses: RequestStatus[] = [
    { value: 'active', label: 'Активные', color: 'bg-green-500' },
    { value: 'pending', label: 'Ожидающие ответа', color: 'bg-yellow-500' },
    { value: 'rejected', label: 'Отклоненные', color: 'bg-red-500' }
  ];

  const currentStudentName = "Иван Петров";

  const mockRequests: MentorRequest[] = [
    {
      id: '1',
      mentorId: 'mentor1',
      mentorName: 'Александр Иванов',
      mentorAvatar: 'https://github.com/shadcn.png',
      status: 'active',
      errorDescription: 'Проблема с оптимизацией React компонентов и производительностью приложения',
      socialLinks: [
        { name: 'github', url: 'https://github.com/alex' },
        { name: 'twitter', url: 'https://twitter.com/alex' },
        { name: 'telegram', url: 'https://t.me/shiro4k' },
      ],
      createdAt: '2023-09-15T14:30:00Z'
    },
  ];

  const [activeTab, setActiveTab] = useState<RequestStatus['value']>('active');

  const filteredRequests = mockRequests.filter(request => request.status === activeTab);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: RequestStatus['value']) => {
    return statuses.find(s => s.value === status)?.color || 'bg-gray-500';
  };

  const getStatusLabel = (status: RequestStatus['value']) => {
    return statuses.find(s => s.value === status)?.label || 'Неизвестно';
  };

  const extractTelegramUsername = (url: string): string | null => {
    if (!url) return null;
    
    let username: string | null = null;
    
    if (url.includes('t.me/')) {
      const match = url.match(/t\.me\/([^?/]+)/);
      username = match ? match[1] : null;
    } else if (url.startsWith('@')) {
      username = url.substring(1);
    }
    
    return username;
  };

  const getMentorTelegramLink = (socialLinks: SocialLinkType[]): string | null => {
    const telegramLink = socialLinks.find(link => 
      link.name.toLowerCase() === 'telegram'
    );
    
    if (!telegramLink) return null;
    
    const username = extractTelegramUsername(telegramLink.url as string);
    return username;
  };

  const createTelegramLink = (
    telegramUsername: string, 
    mentorName: string, 
    errorDescription: string
  ): string => {
    const username = telegramUsername.startsWith('@') 
      ? telegramUsername.substring(1) 
      : telegramUsername;
    
    const messageText = encodeURIComponent(
      `Здравствуйте, ${mentorName}! Меня зовут ${currentStudentName}.\nУ меня возник вопрос: ${errorDescription}\n\nПодскажите, пожалуйста, как можно решить эту проблему?`
    );
    
    return `https://t.me/${username}?text=${messageText}`;
  };

  return (
    <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Мои заявки</h1>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4 sm:mb-8 w-full overflow-x-auto">
          {statuses.map((status) => (
            <TabsTrigger 
              key={status.value} 
              value={status.value}
              onClick={() => setActiveTab(status.value)}
              className="px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap"
            >
              {status.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {statuses.map((status) => (
          <TabsContent key={status.value} value={status.value} className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-6 sm:py-10 text-muted-foreground">
                Нет заявок в этой категории
              </div>
            ) : (
              filteredRequests.map((request) => {
                const telegramUsername = getMentorTelegramLink(request.socialLinks);
                
                const telegramChatLink = telegramUsername 
                  ? createTelegramLink(telegramUsername, request.mentorName, request.errorDescription) 
                  : null;
                
                return (
                  <Card key={request.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={request.mentorAvatar} alt={request.mentorName} />
                            <AvatarFallback>{request.mentorName.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <Link 
                              to={`/mentors/${request.mentorId}`}
                              className="text-lg sm:text-xl font-semibold hover:underline"
                            >
                              {request.mentorName}
                            </Link>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              {formatDate(request.createdAt)}
                            </div>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(request.status)} text-white mt-2 sm:mt-0`}>
                          {getStatusLabel(request.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="py-3 sm:py-4">
                      <CardDescription className="text-sm sm:text-base mb-3 sm:mb-4">
                        {request.errorDescription}
                      </CardDescription>
                      
                      {request.status === 'active' && (
                        <Alert className="mt-3 sm:mt-4 bg-green-50 border-green-200">
                          <AlertCircle className="h-4 w-4" color='green'/>
                          <AlertTitle className="text-green-700 text-sm">Заявка активна</AlertTitle>
                          <AlertDescription className="text-green-600 text-xs sm:text-sm">
                            {telegramUsername 
                              ? 'Свяжитесь с ментором через Telegram для обсуждения вопроса.'
                              : 'У ментора не указан Telegram. Вы можете связаться с ним через другие каналы связи.'}
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/50 pt-2 pb-3 sm:pb-2">
                      <div className="w-full sm:w-auto overflow-x-auto">
                        <SocialLinks socialLinks={request.socialLinks} />
                      </div>
                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        {request.status === 'active' && telegramUsername && (
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="bg-green-500 hover:bg-green-600 w-full sm:w-auto text-xs sm:text-sm" 
                            asChild
                          >
                            <a href={telegramChatLink as string} target="_blank" rel="noopener noreferrer">
                              <MessageCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                              Написать ментору
                            </a>
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full sm:w-auto text-xs sm:text-sm"
                          asChild
                        >
                          <Link to={`/mentors/${request.mentorId}`}>
                            Профиль ментора
                          </Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default StudentDashboardPage;