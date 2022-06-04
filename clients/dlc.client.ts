import { basicFetch } from 'helper/fetch';

class Dlc {
  async paste(content: string) {
    const links = await basicFetch('/api/dlc/decrypt', { method: 'POST', body: content });

    if (Object.hasOwn(links, 'error')) {
      console.log(links);
      return [];
    }

    return links;
  }
}

export const dlc = new Dlc();
export default dlc;
