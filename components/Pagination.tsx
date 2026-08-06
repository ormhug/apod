'use client';

import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

type PaginationItem = number | 'start-ellipsis' | 'end-ellipsis';

const getPaginationItems = (currentPage: number, totalPages: number): PaginationItem[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, position) => position + 1);
  }

  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);

  if (currentPage <= 4) {
    startPage = 2;
    endPage = 5;
  }

  if (currentPage >= totalPages - 3) {
    startPage = totalPages - 4;
    endPage = totalPages - 1;
  }

  const items: PaginationItem[] = [1];

  if (startPage > 2) {
    items.push('start-ellipsis');
  }

  for (let page = startPage; page <= endPage; page += 1) {
    items.push(page);
  }

  if (endPage < totalPages - 1) {
    items.push('end-ellipsis');
  }

  items.push(totalPages);

  return items;
};

export const Pagination = ({ currentPage, totalPages, basePath }: Readonly<PaginationProps>) => {
  if (totalPages <= 1) {
    return null;
  }

  const paginationItems = getPaginationItems(currentPage, totalPages);

  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;

  const linkClassName =
    'inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white';

  const disabledClassName =
    'inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-400 opacity-50 dark:border-gray-700 dark:text-gray-500';

  return (
    <nav
      aria-label="Gallery pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      {currentPage > 1 ? (
        <Link href={`${basePath}&page=${previousPage}`} className={linkClassName}>
          Previous
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClassName}>
          Previous
        </span>
      )}

      {paginationItems.map((item) => {
        if (typeof item !== 'number') {
          return (
            <span
              key={item}
              aria-hidden="true"
              className="inline-flex min-h-10 min-w-10 items-center justify-center text-gray-500 dark:text-gray-400"
            >
              …
            </span>
          );
        }

        if (item === currentPage) {
          return (
            <span
              key={item}
              aria-current="page"
              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg bg-purple-700 px-3 text-sm font-semibold text-white"
            >
              {item}
            </span>
          );
        }

        return (
          <Link key={item} href={`${basePath}&page=${item}`} className={linkClassName}>
            {item}
          </Link>
        );
      })}

      {currentPage < totalPages ? (
        <Link href={`${basePath}&page=${nextPage}`} className={linkClassName}>
          Next
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClassName}>
          Next
        </span>
      )}
    </nav>
  );
};
