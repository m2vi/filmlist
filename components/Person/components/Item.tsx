const Item = ({ name, value }: { name: string; value: string }) => {
  return (
    <div className='flex flex-col'>
      <span className='text-base text-primary-300 mb-1 l-1'>{name}</span>
      <span className='text-xl text-primary-200'>{value}</span>
    </div>
  );
};

export default Item;
