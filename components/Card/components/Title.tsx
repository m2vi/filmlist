const Title = ({ name }: { name: string | null }) => {
  return (
    <p className='font-semibold text-base overflow-hidden overflow-ellipsis whitespace-nowrap' title={name?.toString()}>
      {name}
    </p>
  );
};

export default Title;
