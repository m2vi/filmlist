import { BrowseSectionProps, FrontendItemProps } from '@utils/types';
import { placeholderCards } from '@utils/utils';
import { useEffect, useState } from 'react';
import { CardProps } from './Card';
import Carousel from './Carousel';

export interface CarouselAsyncProps {
  name?: string;
  func: () => Promise<{
    name: string;
    route: string;
    length: number;
    items: FrontendItemProps[];
  }>;
}

const CarouselAsync = ({ func, name }: CarouselAsyncProps) => {
  const [section, setSection] = useState<BrowseSectionProps>({
    items: placeholderCards(20) as CardProps[],
    length: 20,
    name: name ? name : '',
    route: null,
  });

  useEffect(() => {
    func()
      .then((items) => setSection(items))
      .catch((reason) => console.error(reason));
  }, [func]);

  if (section.items.length === 0) return null;

  return <Carousel section={section} />;
};

export default CarouselAsync;
