import api from './api';

class CleanUp {
  async anime(updateCache: boolean = false) {
    await api.updateMany({ original_language: 'ja', genre_ids: { $in: [16, 7424] } }, { $pull: { genre_ids: 7424 } });
    await api.updateMany(
      { original_language: 'ja', genre_ids: { $in: [16], $nin: [7424] } },
      { $push: { genre_ids: { $each: [7424], $position: 0 } } }
    );

    if (updateCache) return (await api.updateCache()).createdAt;

    return null;
  }
}

export const cleanup = new CleanUp();
export default cleanup;
