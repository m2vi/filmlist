import { CardProps } from '@components/Card';
import { GetTabResponse } from '@Types/filmlist';
import { useEffect, useState } from 'react';
import Carousel from '.';
import { placeholderCards } from '@utils/apis/filmlist/helper';

const AsyncCarousel = ({ func }: { func: () => Promise<GetTabResponse> }) => {
  const [section, setSection] = useState<GetTabResponse>({
    items: placeholderCards(20) as CardProps[],
    length: 20,
    key: '...',
    query: {},
  });

  useEffect(() => {
    func().then(setSection).catch(console.error);
  }, [func]);

  if (section.items.length === 0) return null;

  return <Carousel section={section} />;
};

export default AsyncCarousel;
