import { getApod } from '@/lib/api/apod/GetApod';
import ApodPage from '@/app/templates/ApodPage';

export default async function Home() {
  const apod = await getApod();

  return <ApodPage apod={apod} />;
}
