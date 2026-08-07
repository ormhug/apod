import ApodModal from '@/components/apod-modal/ApodModal';
import type { ApodData } from '@/lib/api/apod/types';

interface ApodCardProps {
  apod: ApodData;
}

export const ApodCard = ({ apod }: Readonly<ApodCardProps>) => {
  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-800">
      <div className="p-6">
        <p className="mb-2 text-sm font-medium text-purple-600 dark:text-purple-400">{apod.date}</p>

        <h2 className="mb-5 text-2xl font-bold text-gray-900 dark:text-white">{apod.title}</h2>

        {apod.media_type === 'video' ? (
          <iframe
            src={apod.url}
            title={apod.title}
            className="h-[420px] w-full rounded-lg"
            allowFullScreen
          />
        ) : (
          <img
            src={apod.url}
            alt={apod.title}
            className="h-[420px] w-full rounded-lg object-cover"
          />
        )}

        {apod.media_type === 'image' && apod.hdurl && (
          <div className="mt-5">
            <ApodModal hdUrl={apod.hdurl} title={apod.title} buttonLabel="View HD" />
          </div>
        )}
      </div>
    </article>
  );
};
