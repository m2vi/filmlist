import { SimpleObject } from '@Types/common';
import FormData from 'form-data';
import { basicFetch } from 'helper/fetch';

class Dlc {
  private parseResponseBody(body: SimpleObject<any>) {
    if (body.hasOwnProperty('form_errors')) {
      const errorMessage = body.form_errors['content'][0];
      throw Error(errorMessage);
    }

    if (body.hasOwnProperty('success') && Array.isArray(body.success.links)) {
      return body.success.links;
    }

    throw Error('Malformed response');
  }

  async paste(content: string) {
    try {
      let formData = new FormData();
      formData.append('content', content);

      const body = await basicFetch('http://dcrypt.it/decrypt/paste', { method: 'POST', body: formData as any });

      return this.parseResponseBody(body);
    } catch (error: any) {
      return {
        error: error?.message,
      };
    }
  }
}

export const dlc = new Dlc();
export default dlc;
