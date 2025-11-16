import { TLOG_LEVELS } from './types';

export const LOG_LEVELS: TLOG_LEVELS =
  process.env.NODE_ENV === 'production'
    ? ['log', 'warn', 'error', 'fatal']
    : ['verbose', 'debug', 'log', 'warn', 'error', 'fatal'];
