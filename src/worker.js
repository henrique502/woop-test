/* .env lib */
require('dotenv').config();
const debug = require('debug')('worker');

/* Dependencies */
require('./config/i18n');
const { CronJob } = require('cron');
const Settings = require('./config/Settings');

/* Crons */
const AutoCloseSessionJob = require('./crons/AutoCloseSessionJob.js');

debug('load settings');
(async () => {
  await Settings.load();

  debug('load workers');
  const job = new CronJob(Settings.get('AUTO_CLOSE_SESSION_JOB'), AutoCloseSessionJob.runner, null, false, 'Etc/UTC');
  job.start();
})();
