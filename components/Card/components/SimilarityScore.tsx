import { Fragment } from 'react';

const SimilarityScore = ({ similarity_score }: { similarity_score: number | undefined }) => {
  return (
    <Fragment>
      {similarity_score ? (
        <>
          <span className='mx-1 font-bold text-primary-200'>·</span>
          <div className='green font-semibold'>{(similarity_score * 100).toFixed(0)}%</div>
        </>
      ) : null}
    </Fragment>
  );
};

export default SimilarityScore;
