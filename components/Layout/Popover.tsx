import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { IoNotifications } from 'react-icons/io5';

const PopoverEl = () => {
  return (
    <div className=' flex justify-end'>
      <Menu as='div' className='relative h-full'>
        <div className='h-full flex justify-center'>
          <Menu.Button className='font-normal text-sm text-center flex justify-center items-center mx-4 cursor-pointer h-7 w-7'>
            <IoNotifications className='h-4 w-4' />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <div className='absolute right-0 w-300 mt-3 origin-top-right bg-primary-800 divide-y divide-primary-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <Menu.Items>
              <div className='p-4'>
                <Menu.Item>{({ active }) => <a href=''>dd</a>}</Menu.Item>
              </div>
            </Menu.Items>
            <Menu.Items>
              <div className='p-4'>
                <Menu.Item>{({ active }) => <Menu.Item>{({ active }) => <a href=''>dd</a>}</Menu.Item>}</Menu.Item>
              </div>
            </Menu.Items>
          </div>
        </Transition>
      </Menu>
    </div>
  );
};

export default PopoverEl;
