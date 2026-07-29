export interface ApodData {
  date: string;
  explanation: string;
  title: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video';
}
