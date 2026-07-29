import { getApod } from '@/services/apod-service';
import ApodPage from '@/app/templates/ApodPage';

export default async function Home() {
  const apod = await getApod();

  return <ApodPage apod={apod} />;
}
