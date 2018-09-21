const Logger = require('../helpers/Logger');
const SessionService = require('../services/SessionService')

class AutoCloseSessionJob {
  static async runner() {
    try {
      await SessionService.autoCloseSession();
    } catch (ex) {
      Logger.error(ex);
    }
  }
}

module.exports = AutoCloseSessionJob;
