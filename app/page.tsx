import ApodPage from '@/app/templates/ApodPage';
import { getApod } from '@/services/apod-service';

const Home = async () => {
  const apod = await getApod();

  return <ApodPage apod={apod} />;
};

export default Home;
