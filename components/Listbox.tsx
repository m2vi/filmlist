import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { IoCheckmarkOutline } from 'react-icons/io5';
import { useTranslation } from 'next-i18next';
import _ from 'underscore';

export default function ListboxEl() {
  const { t } = useTranslation();
  const types = [
    { name: t('details.type.movie'), value: '1' },
    { name: t('details.type.tv show'), value: '0' },
  ];

  const [selected, setSelected] = useState(types[0]);

  return (
    <div className='w-full mt-2'>
      <Listbox value={selected} onChange={(value: any) => setSelected(_.find(types, { value })!)}>
        <div className='relative mt-1'>
          <Listbox.Button className='flex justify-between items-center relative w-full py-2 px-4 mb-2  text-left bg-transparent border border-primary-600 placeholder-primary-300 text-primary-100 rounded-8 shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm'>
            <span className='block truncate'>{selected.name}</span>
            <span className='w-5 h-5 text-gray-400' aria-hidden='true'>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 9l4-4 4 4m0 6l-4 4-4-4' />
              </svg>
            </span>
          </Listbox.Button>
          <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
            <Listbox.Options className='absolute w-full py-1 -mt-2 overflow-auto text-base bg-primary-800 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
              {types.map((type, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `${active ? 'text-accent' : 'text-primary-100 '}
                          cursor-pointer select-none relative py-2 pl-10 pr-4`
                  }
                  value={type.value}
                >
                  {({ selected, active }) => (
                    <>
                      <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>{type.name}</span>
                      {selected ? (
                        <span
                          className={`${active ? 'text-amber-600' : 'text-amber-600'}
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                        >
                          <IoCheckmarkOutline className='w-5 h-5' aria-hidden='true' />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
