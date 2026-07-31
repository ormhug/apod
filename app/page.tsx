import ApodView from '@/components/ApodView';
import { getApod } from '@/services/apod-service';

const Home = async () => {
  const apod = await getApod();

  return <ApodView apod={apod} />;
};

export default Home;
