import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import config from '@data/config.json';
import { ItemProps } from '@Types/items';
import { useRouter } from 'next/router';
import Trailer from '@components/Trailer';

const TrailerModal = ({ data }: { data: ItemProps }) => {
  let [isOpen, setIsOpen] = useState(false);
  const locale = useRouter().locale!;

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <img
        src={`https://image.tmdb.org/t/p/${config.highResPosterWidth}${data.poster_path[locale]}`}
        alt=''
        style={{ aspectRatio: '2 / 3' }}
        className='no-drag select-none overflow-hidden relative w-full cursor-pointer'
        title='Trailer'
        onClick={openModal}
      />
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='fixed inset-0 z-10 overflow-y-auto' onClose={closeModal}>
          <div className='min-h-screen px-80 text-center bg-gray-900 bg-opacity-50 backdrop-blur-sm'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0' />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className='inline-block h-screen align-middle' aria-hidden='true'>
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <div className='inline-block w-full max-w-screen-lg my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl relative'>
                <div className='absolute top-0 right-0 z-20 p-3 cursor-pointer' onClick={closeModal}>
                  <div className='bg-gray-900 backdrop-blur-3xl bg-opacity-50 rounded-5 p-1'>
                    <IoCloseOutline className='h-5 w-5 text-accent' />
                  </div>
                </div>
                <Trailer trailers={data.trailers} />
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default TrailerModal;
