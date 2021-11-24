const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'it'],
    localePath: path.resolve('./public/locales'),
  },
};
