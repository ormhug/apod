import ApodView from '@/components/ApodView';
import { getApod } from '@/services/apod-service';
import type { Metadata } from 'next';

interface DateApodPageProps {
  params: Promise<{
    date: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: Readonly<DateApodPageProps>): Promise<Metadata> => {
  const { date } = await params;

  return {
    title: `APOD — ${date}`,
  };
};

const DateApodPage = async ({ params }: Readonly<DateApodPageProps>) => {
  const { date } = await params;
  const apod = await getApod(date);

  return <ApodView apod={apod} />;
};

export default DateApodPage;
