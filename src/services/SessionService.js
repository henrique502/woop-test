const moment = require('moment-timezone')
const { knex } = require('../config/db');
const SessionModel = require('../models/SessionModel');
const { YES } = require('../types/boolean');

class SessionService {
  static async startNewSession({ name, minutes }) {
    const start_at = moment.utc()
      .format('YYYY-MM-DD HH:mm:ss');
    const end_at = moment.utc()
      .add(minutes, 'minutes')
      .format('YYYY-MM-DD HH:mm:ss');

    const [session_id] = await SessionModel.insert({
      name,
      end_at,
      start_at,
      active: YES,
    });

    return session_id;
  }

  static async vote({}) {

  }

  static async get({}) {

  }

  static delete(data) {
    return knex.transaction(async (trx) => {
      const user = await UserModel.get(userId)
        .transacting(trx);

      if (user) {
        await UserModel.delete(user.id, data)
          .transacting(trx);

        return true;
      }

      return false;
    });
  }
}

module.exports = SessionService;
