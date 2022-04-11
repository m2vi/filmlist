import { Menu, Transition } from '@headlessui/react';
import { UserCookie } from '@Types/user';
import userClient from '@utils/user/client';
import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';
import DropdownItem from './DropdownItem';
import Link from 'next/link';

export const Dropdown = ({ avatar }: { avatar: string | null }) => {
  const [client, setClient] = useState<UserCookie | null>(null);

  useEffect(() => setClient(userClient.getUser()), []);

  return (
    <Menu as='div' className='relative inline-block'>
      <div>
        <Menu.Button className='flex justify-center h-7 w-7 bg-primary-800 text-sm font-medium rounded cursor-pointer'>
          {avatar && <Image src={avatar} alt='Avatar' height='35px' width='35px' className='rounded no-drag' />}
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
        <div className='absolute right-0 w-250 mt-3 px-3 py-2 origin-top-right bg-primary-800 shadow-xl rounded-8'>
          <Menu.Items>
            <div className='flex flex-col divide-y divide-primary-700'>
              <div className='grid grid-flow-row gap-2 py-2'>
                <Menu.Item>
                  <DropdownItem>
                    <span>Profile</span>
                  </DropdownItem>
                </Menu.Item>
              </div>
              <div className='grid grid-flow-row gap-2 py-2'>
                <Menu.Item>
                  <DropdownItem>
                    <span>Edit Profile</span>
                  </DropdownItem>
                </Menu.Item>
                <Menu.Item>
                  <DropdownItem>
                    <span>Edit Preferences</span>
                  </DropdownItem>
                </Menu.Item>
              </div>

              <div className='grid grid-flow-row gap-2 py-2'>
                <Menu.Item>
                  <DropdownItem>
                    <span>Account Settings</span>
                  </DropdownItem>
                </Menu.Item>
                <Menu.Item>
                  <Link href='/api/auth/logout' locale={false}>
                    <a>
                      <DropdownItem>
                        <span>Log out</span>
                      </DropdownItem>
                    </a>
                  </Link>
                </Menu.Item>
              </div>
            </div>
          </Menu.Items>
        </div>
      </Transition>
    </Menu>
  );
};

export default Dropdown;
