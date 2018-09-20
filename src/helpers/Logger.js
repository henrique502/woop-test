/* Logger use RFC5424 */
class Logger {
  static emerg(emerg) {
    console.error('emerg', emerg);
  }

  static alert(alert) {
    console.warn('alert', alert);
  }

  static crit(crit) {
    console.error('crit', crit);
  }

  static error(error) {
    console.log('error', error);
  }

  static warning(warning) {
    console.error('warning', warning);
  }

  static notice(notice) {
    console.log('notice', notice);
  }

  static info(info) {
    console.log('info', info);
  }

  static throw(res, code, args) {
    Logger.error(args);
    res.status(500).send({ success: false, code, message: res.__('helpers.logger.throw') });
  }
}

module.exports = Logger;
