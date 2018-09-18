/* .env lib */
require('dotenv').config();
const debug = require('debug')('worker');

/* Dependencies */
require('./config/i18n');
const Cron = require('./helpers/Cron');

/* Logger */
const LoggerConfig = require('./config/LoggerConfig');
const Logger = require('./helpers/Logger');

/* Crons */
const EverySecond = require('./crons/EverySecond.js');

/* Services */
const services = [];

debug('load settings');
(async () => {
  await Settings.load();
  await LoggerConfig.init();

  debug('load workers');
  Cron.add(Settings.get('CRON_EVERY_SECOND'), EverySecond.runner);

  debug('start workers');
  Cron.startAll();

  debug(`Worker started ${services.length} services`);
})();
