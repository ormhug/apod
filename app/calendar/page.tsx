'use client';

import type { SubmitEventHandler } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Calendar } from '@/components/Calendar';

const getTodayString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const CalendarPage = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (!selectedDate) {
      return;
    }

    router.push(`/apod/${selectedDate}`);
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 pt-28 pb-12 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Select an APOD date
          </h1>

          <p className="text-gray-600 dark:text-gray-400">
            Choose a date to view NASA&apos;s Astronomy Picture of the Day.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Calendar
            mode="single"
            value={selectedDate}
            onChange={setSelectedDate}
            max={getTodayString()}
          />

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={!selectedDate}
              className="rounded-lg bg-purple-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              View APOD
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CalendarPage;
