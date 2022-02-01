// @ts-ignore
import IMDb from 'imdb-light';

export class Api {
  private fetchBase(id: string): any {
    return new Promise(function (resolve, reject) {
      IMDb.fetch(id, (details: any) => {
        console.log(details);
        resolve(details);
      });
    });
  }

  private async fetchId(id: string) {
    return { ...(await this.fetchBase(id)) };
  }

  async id(id: string) {
    const data = await this.fetchId(id);

    return data;
  }

  async db(id: string) {
    const data = await this.fetchId(id);

    const rating = parseFloat(data?.Rating?.split('/')[0]);
    const votes = data?.Votes;

    return { vote_average: isNaN(rating) ? null : rating, vote_count: votes ? votes : null };
  }
}

export const api = new Api();
export default api;
