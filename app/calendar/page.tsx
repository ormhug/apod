'use client';
import type { SubmitEventHandler } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Calendar } from '@/components/Calendar';

import { countDays, getTodayString } from '@/services/date-helper';

type CalendarMode = 'single' | 'range';

const CalendarPage = () => {
  const router = useRouter();

  const [mode, setMode] = useState<CalendarMode>('single');
  const [selectedDate, setSelectedDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleModeChange = (newMode: CalendarMode) => {
    setMode(newMode);
    setErrorMessage('');
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setErrorMessage('');
    const today = getTodayString();

    if (mode === 'single') {
      if (!selectedDate) {
        setErrorMessage('Select a date.');
        return;
      }

      if (selectedDate > today) {
        setErrorMessage('Future dates are not available.');
        return;
      }

      router.push(`/apod/${selectedDate}`);
      return;
    }

    if (!startDate || !endDate) {
      setErrorMessage('Select both the start date and the end date.');
      return;
    }

    if (startDate > today || endDate > today) {
      setErrorMessage('Future dates are not available.');
      return;
    }

    if (startDate > endDate) {
      setErrorMessage('The start date cannot be after the end date.');
      return;
    }

    const searchParams = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
      page: '1',
    });

    router.push(`/gallery?${searchParams.toString()}`);
  };

  const selectedDayCount =
    startDate && endDate && startDate <= endDate ? countDays(startDate, endDate) : 0;

  const isSubmitDisabled = mode === 'single' ? !selectedDate : !startDate || !endDate;

  return (
    <main className="min-h-screen bg-gray-100 px-4 pt-28 pb-12 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Select APOD dates
          </h1>

          <p className="text-gray-600 dark:text-gray-400">
            Choose one date or a date range from NASA&apos;s Astronomy Picture of the Day archive.
          </p>
        </div>

        <div className="mb-6 inline-flex rounded-lg bg-gray-200 p-1 dark:bg-gray-800">
          <button
            type="button"
            onClick={() => handleModeChange('single')}
            aria-pressed={mode === 'single'}
            className={
              mode === 'single'
                ? 'rounded-md bg-white px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm dark:bg-gray-700 dark:text-purple-400'
                : 'rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }
          >
            Single date
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('range')}
            aria-pressed={mode === 'range'}
            className={
              mode === 'range'
                ? 'rounded-md bg-white px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm dark:bg-gray-700 dark:text-purple-400'
                : 'rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }
          >
            Date range
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'single' ? (
            <Calendar
              mode="single"
              value={selectedDate}
              onChange={setSelectedDate}
              max={getTodayString()}
            />
          ) : (
            <Calendar
              mode="range"
              startValue={startDate}
              endValue={endDate}
              onStartChange={setStartDate}
              onEndChange={setEndDate}
              max={getTodayString()}
            />
          )}

          {mode === 'range' && selectedDayCount > 0 && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Selected period: {selectedDayCount} {selectedDayCount === 1 ? 'day' : 'days'}
            </p>
          )}

          {errorMessage && (
            <p role="alert" className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">
              {errorMessage}
            </p>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="rounded-lg bg-purple-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mode === 'single' ? 'View APOD' : 'View gallery'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CalendarPage;
