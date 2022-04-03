const ItemLink = ({ name, value, href }: { name: string; value: string; href: string }) => {
  return (
    <div className='flex flex-col'>
      <span className='text-base text-primary-300 mb-1 l-1'>{name}</span>
      <a href={href} className='text-xl text-primary-200 hover:text-accent'>
        {value}
      </a>
    </div>
  );
};

export default ItemLink;
