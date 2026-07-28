import type { ApodData } from './types';

const API_KEY = process.env.NEXT_NASA_API_KEY || 'DEMO_KEY';

export async function getApod(): Promise<ApodData> {
  const RESPONSE = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`);
  return RESPONSE.json();
}
