import { ReactNode } from 'react';

const DropdownItem = ({ children }: { children: ReactNode }) => {
  return (
    <div className='rounded-8 bg-transparent py-2 px-3 flex items-center justify-start leading-none text-primary-200 hover:text-primary-100 cursor-pointer'>
      {children}
    </div>
  );
};

export default DropdownItem;
