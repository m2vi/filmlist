import { PersonsCredits } from '@Types/filmlist';
import { placeholderCards } from '@utils/apis/filmlist/helper';
import { useEffect, useState } from 'react';
import PersonCarousel from '.';

const AsyncPersonCarousel = ({ func }: { func: () => Promise<PersonsCredits> }) => {
  const [items, setItems] = useState<PersonsCredits>(placeholderCards(20) as any[]);

  useEffect(() => {
    func().then(setItems).catch(console.error);
  }, [func]);

  if (items.length === 0) return null;

  return <PersonCarousel items={items} />;
};

export default AsyncPersonCarousel;
