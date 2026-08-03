'use client';

import { useEffect, useState } from 'react';

interface SingleCalendarProps {
  mode: 'single';
  value: string;
  onChange: (date: string) => void;
  max?: string;
}

interface RangeCalendarProps {
  mode: 'range';
  startValue: string;
  endValue: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
  max?: string;
}

type CalendarProps = SingleCalendarProps | RangeCalendarProps;

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const formatDate = (year: number, month: number, day: number): string => {
  const formattedMonth = String(month + 1).padStart(2, '0');
  const formattedDay = String(day).padStart(2, '0');

  return `${year}-${formattedMonth}-${formattedDay}`;
};

const parseDate = (date: string): Date => {
  const [year, month, day] = date.split('-').map(Number);

  return new Date(year, month - 1, day);
};

const getTodayString = (): string => {
  const today = new Date();

  return formatDate(today.getFullYear(), today.getMonth(), today.getDate());
};

export const Calendar = (props: Readonly<CalendarProps>) => {
  const initialValue = props.mode === 'single' ? props.value : props.startValue || props.endValue;

  const initialDate = initialValue ? parseDate(initialValue) : new Date();

  const [displayedDate, setDisplayedDate] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  );

  useEffect(() => {
    if (!initialValue) {
      return;
    }

    const selectedDate = parseDate(initialValue);

    setDisplayedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  }, [initialValue]);

  const displayedYear = displayedDate.getFullYear();
  const displayedMonth = displayedDate.getMonth();

  const firstDayOfMonth = new Date(displayedYear, displayedMonth, 1).getDay();

  const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();

  const monthLabel = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(displayedDate);

  const maxDate = props.max ? parseDate(props.max) : undefined;

  const canOpenNextMonth =
    !maxDate ||
    new Date(displayedYear, displayedMonth + 1, 1) <=
      new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  const handlePreviousMonth = () => {
    setDisplayedDate(new Date(displayedYear, displayedMonth - 1, 1));
  };

  const handleNextMonth = () => {
    if (!canOpenNextMonth) {
      return;
    }

    setDisplayedDate(new Date(displayedYear, displayedMonth + 1, 1));
  };

  const handleDateSelect = (date: string) => {
    if (props.mode === 'single') {
      props.onChange(date);
      return;
    }

    if (!props.startValue || props.endValue) {
      props.onStartChange(date);
      props.onEndChange('');
      return;
    }

    if (date < props.startValue) {
      props.onStartChange(date);
      return;
    }

    props.onEndChange(date);
  };

  const isSelectedDate = (date: string): boolean => {
    if (props.mode === 'single') {
      return props.value === date;
    }

    return props.startValue === date || props.endValue === date;
  };

  const isDateInRange = (date: string): boolean => {
    if (props.mode !== 'range' || !props.startValue || !props.endValue) {
      return false;
    }

    return date > props.startValue && date < props.endValue;
  };

  const calendarCells = [
    ...Array.from({ length: firstDayOfMonth }, (_, position) => ({
      id: `empty-${displayedYear}-${displayedMonth}-${position + 1}`,
      day: null,
    })),
    ...Array.from({ length: daysInMonth }, (_, position) => {
      const day = position + 1;

      return {
        id: formatDate(displayedYear, displayedMonth, day),
        day,
      };
    }),
  ];

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
      <div className="flex items-center justify-between bg-gray-700 px-6 py-3">
        <button
          type="button"
          onClick={handlePreviousMonth}
          className="text-white hover:text-gray-200"
        >
          Previous
        </button>

        <h2 className="font-medium text-white">{monthLabel}</h2>

        <button
          type="button"
          onClick={handleNextMonth}
          disabled={!canOpenNextMonth}
          className="text-white hover:text-gray-200 disabled:cursor-not-allowed disabled:text-gray-500"
        >
          Next
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 p-4">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="py-2 text-center font-semibold text-gray-900 dark:text-white">
            {day}
          </div>
        ))}

        {calendarCells.map(({ id, day }) => {
          if (day === null) {
            return <div key={id} aria-hidden="true" />;
          }

          const date = formatDate(displayedYear, displayedMonth, day);

          const isFutureDate = maxDate !== undefined && parseDate(date) > maxDate;

          const isSelected = isSelectedDate(date);
          const isInRange = isDateInRange(date);
          const isToday = date === getTodayString();

          let dateClassName =
            'h-11 border border-gray-200 text-center text-gray-900 transition hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700';

          if (isInRange) {
            dateClassName += ' bg-blue-100 dark:bg-blue-900/40';
          }

          if (isToday) {
            dateClassName += ' ring-2 ring-inset ring-blue-500';
          }

          if (isSelected) {
            dateClassName +=
              ' border-blue-500 bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-500';
          }

          if (isFutureDate) {
            dateClassName += ' cursor-not-allowed opacity-30 hover:bg-transparent';
          }

          return (
            <button
              key={id}
              type="button"
              disabled={isFutureDate}
              onClick={() => handleDateSelect(date)}
              aria-label={`Select ${date}`}
              aria-pressed={isSelected}
              className={dateClassName}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};
