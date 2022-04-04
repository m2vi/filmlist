import * as cheerio from 'cheerio';

class Parser {
  private async html(url: string) {
    return await (await fetch(url, { headers: { 'Accept-Language': 'en-US,en;q=0.8' } })).text();
  }

  async keywords(id: string) {
    const html = await this.html(`https://www.imdb.com/title/${id}/keywords`);
    const $ = cheerio.load(html);

    return $('td.soda')
      .map((i, el) => $(el).find('div.sodatext').text().trim())
      .get();
  }
}

export const parser = new Parser();
