import { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/outline';
import _ from 'lodash';
import { FilterProps } from '@Types/search';
import { useFilter } from 'context/useFilter';

export default function Filter(raw: FilterProps) {
  const { setProperty } = useFilter();
  const filter: FilterProps = {
    index: raw.index,
    name: raw.name,
    values: [
      {
        key: raw.index,
        name: raw.name,
        value: undefined as any,
        default: true,
      },
      ...raw.values,
    ],
  };
  const [selected, setSelected] = useState(_.find(filter.values, { default: true }));

  useEffect(() => {
    if (!selected) return;
    setProperty(selected?.key?.toString()!, selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div className='w-full'>
      <Listbox value={selected} onChange={setSelected}>
        <div className='relative w-full'>
          <Listbox.Button className='relative w-full cursor-default rounded-8 bg-primary-800 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
            <span className='block truncate'>{selected?.name ? selected?.name : selected?.name}</span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
              <SelectorIcon className='h-4 w-4 text-primary-200 opacity-70' aria-hidden='true' />
            </span>
          </Listbox.Button>
          <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
            <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-hidden rounded-8 bg-primary-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
              {filter.values.map((filter, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-primary-700 text-accent' : 'text-primary-100'}`
                  }
                  value={filter}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{filter.name}</span>
                      {selected ? (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-accent'>
                          <CheckIcon className='h-4 w-4' aria-hidden='true' />
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
