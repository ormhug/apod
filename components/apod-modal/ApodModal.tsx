'use client';

import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

import type { ApodModalProps } from './types';

type ReadonlyProps = Readonly<ApodModalProps>;

const ApodModal = ({ hdUrl, title, buttonLabel = 'Open dialog' }: ReadonlyProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-white"
      >
        {buttonLabel}{' '}
      </button>
      <Dialog open={isOpen} onClose={setIsOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="relative grid max-h-[92vh] max-w-6xl grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-xl bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="shrink-0 px-6 pt-5">
                <DialogTitle as="h3" className="text-xl font-semibold text-white">
                  {title}
                </DialogTitle>
              </div>

              <div className="flex min-h-0 items-center justify-center px-6 py-5">
                <img
                  src={hdUrl}
                  alt={title}
                  className="max-h-[72vh] max-w-full rounded-lg object-contain"
                />
              </div>

              <div className="shrink-0 bg-gray-700/25 px-6 py-4 sm:flex sm:justify-end">
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setIsOpen(false)}
                  className="inline-flex w-full justify-center rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ApodModal;
