import { FrontendItemProps } from '@utils/types';
import { placeholderCards } from '@utils/utils';
import { useEffect, useState } from 'react';
import { CardProps } from './Card';
import Carousel from './Carousel';

export interface CarouselAsyncProps {
  func: () => Promise<FrontendItemProps[]>;
}

const CarouselAsync = ({ func }: CarouselAsyncProps) => {
  const [items, setItems] = useState(placeholderCards(20) as CardProps[]);

  useEffect(() => {
    func()
      .then((items) => {
        console.log(items);
        setItems(items);
      })
      .catch((reason) => console.error(reason));
  }, [func]);

  return (
    <Carousel
      section={{
        items: items,
        length: items.length,
        name: null,
        route: null,
      }}
    />
  );
};

export default CarouselAsync;
