import m from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
momentDurationFormatSetup(m as any);

export const moment = m;
