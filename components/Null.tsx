import { ReactNode } from 'react';

interface NullProps {
  children?: ReactNode;
}

const Null = ({ children = null }: NullProps) => {
  return <>{children}</>;
};

export default Null;
