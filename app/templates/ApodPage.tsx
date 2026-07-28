import ApodModal from '@/components/apod-modal/ApodModal';
import type { ApodData } from '@/lib/api/apod/types';

interface ApodPageProps {
  apod: ApodData;
}

export default function ApodPage({ apod }: Readonly<ApodPageProps>) {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 pt-20 pb-8 lg:py-16 lg:pt-28">
          <p className="mb-3 text-sm font-medium text-purple-600">{apod.date}</p>

          <h1 className="mb-8 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl xl:text-6xl">
            {apod.title}
          </h1>

          <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg lg:text-xl">
                {apod.explanation}
              </p>

              <div className="mt-6">
                <ApodModal hdUrl={apod.hdurl} title={apod.title} />
              </div>
            </div>

            <div className="flex items-start justify-center">
              <img
                src={apod.url}
                alt={apod.title}
                className="h-[320px] w-full rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
