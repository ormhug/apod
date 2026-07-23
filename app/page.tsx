import ApodModal from '@/components/ApodModal';

type ApodData = {
  date: string;
  explanation: string;
  title: string;
  url: string;
  hdurl: string;
  media_type: 'image';
};

const API_KEY = process.env.NEXT_NASA_API_KEY || 'DEMO_KEY';

const APOD = await getApod();

async function getApod(): Promise<ApodData> {
  const RESPONSE = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`);
  return RESPONSE.json();
}

export default async function Home() {
  const APOD = await getApod();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 pt-20 pb-8 lg:py-16 lg:pt-28">
          <p className="mb-3 text-sm font-medium text-purple-600">{APOD.date}</p>

          <h1 className="mb-8 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl xl:text-6xl">
            {APOD.title}
          </h1>

          <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg lg:text-xl">
                {APOD.explanation}
              </p>

              <div className="mt-6">
                <ApodModal hdurl={APOD.hdurl} title={APOD.title} />
              </div>
            </div>

            <div className="flex items-start justify-center">
              <img
                src={APOD.url}
                alt={APOD.title}
                className="h-[320px] w-full rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
