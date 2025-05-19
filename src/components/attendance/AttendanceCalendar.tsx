
import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AttendanceCalendarProps {
  currentYear: number;
  currentMonth: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: Date) => void;
  selectedDate: Date | null;
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  currentYear,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  selectedDate,
}) => {
  const getMonthName = (month: number) => {
    const date = new Date();
    date.setMonth(month - 1);
    return date.toLocaleString('id-ID', { month: 'long' });
  };

  // Get days in current month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Create calendar days
  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();
    const isCurrentMonth = 
      today.getFullYear() === currentYear && 
      today.getMonth() === currentMonth - 1;

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth - 1, day);
      const isToday = 
        isCurrentMonth && today.getDate() === day;
      const isSelected = 
        selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentMonth - 1 && 
        selectedDate.getFullYear() === currentYear;

      days.push(
        <Button
          key={`day-${day}`}
          variant="ghost"
          className={`h-10 w-10 p-0 font-normal ${
            isToday ? 'bg-primary/10 text-primary' : ''
          } ${isSelected ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground' : ''}`}
          onClick={() => onSelectDate(date)}
        >
          {day}
        </Button>
      );
    }

    return days;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onPrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>{getMonthName(currentMonth)} {currentYear}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center">
          <div className="text-sm font-medium text-muted-foreground">Mg</div>
          <div className="text-sm font-medium text-muted-foreground">Sn</div>
          <div className="text-sm font-medium text-muted-foreground">Sl</div>
          <div className="text-sm font-medium text-muted-foreground">Rb</div>
          <div className="text-sm font-medium text-muted-foreground">Km</div>
          <div className="text-sm font-medium text-muted-foreground">Jm</div>
          <div className="text-sm font-medium text-muted-foreground">Sb</div>

          {renderCalendarDays()}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceCalendar;
