import type { ApodData } from '@/lib/api/apod/types';

const APOD_API_URL = 'https://api.nasa.gov/planetary/apod';
const API_KEY = process.env.NEXT_NASA_API_KEY ?? 'DEMO_KEY';

const fetchApod = async <T>(searchParams: URLSearchParams): Promise<T> => {
  searchParams.set('api_key', API_KEY);

  const response = await fetch(`${APOD_API_URL}?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch APOD: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};

export const getApod = async (date?: string): Promise<ApodData> => {
  const searchParams = new URLSearchParams();

  if (date) {
    searchParams.set('date', date);
  }

  return fetchApod<ApodData>(searchParams);
};

export const getApodRange = async (startDate: string, endDate?: string): Promise<ApodData[]> => {
  const searchParams = new URLSearchParams({
    start_date: startDate,
  });

  if (endDate) {
    searchParams.set('end_date', endDate);
  }

  return fetchApod<ApodData[]>(searchParams);
};
