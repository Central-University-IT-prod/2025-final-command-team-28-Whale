import { ReactNode } from 'react';
import { Clock, CheckCheck, XOctagon, CheckCircle, MessageSquare } from 'lucide-react';
import { TabValue } from '../types';

export const getTabIcon = (tab: TabValue): ReactNode => {
  switch (tab) {
    case 'pending': return <Clock className="h-4 w-4 mr-2" />;
    case 'active': return <CheckCheck className="h-4 w-4 mr-2" />;
    case 'rejected': return <XOctagon className="h-4 w-4 mr-2" />;
    case 'completed': return <CheckCircle className="h-4 w-4 mr-2" />;
    case 'all': return null;
    default: return null;
  }
};

export const getTabTitle = (tab: TabValue): string => {
  switch (tab) {
    case 'pending': return "Вопросы на рассмотрении";
    case 'active': return "Активные вопросы";
    case 'rejected': return "Отклоненные вопросы";
    case 'completed': return "Завершенные вопросы";
    case 'all': return "Все вопросы";
    default: return "Вопросы";
  }
};

export const getEmptyStateText = (tab: TabValue): string => {
  switch (tab) {
    case 'pending': return "Нет ожидающих вопросов";
    case 'active': return "Нет активных вопросов";
    case 'rejected': return "Нет отклоненных вопросов";
    case 'completed': return "Нет завершенных вопросов";
    case 'all': return "Нет вопросов в системе";
    default: return "Нет вопросов";
  }
};

export const getEmptyStateIcon = (tab: TabValue): ReactNode => {
  switch (tab) {
    case 'pending': return <Clock className="h-12 w-12 mb-3 text-muted-foreground/60" />;
    case 'active': return <CheckCheck className="h-12 w-12 mb-3 text-muted-foreground/60" />;
    case 'completed': return <CheckCircle className="h-12 w-12 mb-3 text-muted-foreground/60" />;
    case 'rejected': return <XOctagon className="h-12 w-12 mb-3 text-muted-foreground/60" />;
    case 'all': return <MessageSquare className="h-12 w-12 mb-3 text-muted-foreground/60" />;
    default: return null;
  }
};