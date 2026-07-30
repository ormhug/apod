import ApodPage from '@/app/templates/ApodPage';
import { getApod } from '@/services/apod-service';

interface DateApodPageProps {
  params: Promise<{
    date: string;
  }>;
}

const DateApodPage = async ({ params }: Readonly<DateApodPageProps>) => {
  const { date } = await params;
  const apod = await getApod(date);

  return <ApodPage apod={apod} />;
};

export default DateApodPage;
