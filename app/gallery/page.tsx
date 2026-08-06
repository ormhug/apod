import { ApodCard } from '@/components/ApodCard';
import { getApodRange } from '@/services/apod-service';
import { Pagination } from '@/components/Pagination';

interface GallerySearchParams {
  start_date?: string;
  end_date?: string;
  page?: string;
}

interface GalleryPageProps {
  searchParams: Promise<GallerySearchParams>;
}

const ITEMS_PER_PAGE = 10;

const GalleryPage = async ({ searchParams }: Readonly<GalleryPageProps>) => {
  const { start_date: startDate, end_date: endDate, page: pageValue } = await searchParams;

  if (!startDate) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 pt-28 pb-12 dark:bg-gray-900">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">APOD gallery</h1>

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Select a date range in the calendar first.
          </p>
        </div>
      </main>
    );
  }

  const apods = await getApodRange(startDate, endDate);

  const requestedPage = Number.parseInt(pageValue ?? '1', 10);

  const totalPages = Math.max(1, Math.ceil(apods.length / ITEMS_PER_PAGE));

  const currentPage = Number.isNaN(requestedPage)
    ? 1
    : Math.min(Math.max(requestedPage, 1), totalPages);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const visibleApods = apods.slice(startIndex, endIndex);

  const baseSearchParams = new URLSearchParams({
    start_date: startDate,
  });

  if (endDate) {
    baseSearchParams.set('end_date', endDate);
  }

  const basePath = `/gallery?${baseSearchParams.toString()}`;

  return (
    <main className="min-h-screen bg-gray-100 px-4 pt-28 pb-12 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">APOD gallery</h1>

          <p className="text-gray-600 dark:text-gray-400">
            From {startDate} to {endDate ?? 'today'}
          </p>
        </div>

        <div className="space-y-8">
          {visibleApods.map((apod) => (
            <ApodCard key={apod.date} apod={apod} />
          ))}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} />
      </div>
    </main>
  );
};

export default GalleryPage;
