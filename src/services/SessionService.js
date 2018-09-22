const moment = require('moment-timezone');
const { knex } = require('../config/db');
const SessionModel = require('../models/SessionModel');
const AssociateModel = require('../models/AssociateModel');
const SessionVoteModel = require('../models/SessionVoteModel');
const { YES, NO } = require('../types/boolean');
const { DRAW } = require('../types/session');
const { toUnixEpoch } = require('../helpers/Datetime');

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

  static vote({ session_id, associate_id, option }) {
    const now = moment.utc()
      .format('YYYY-MM-DD HH:mm:ss');

    return knex.transaction(async (trx) => {
      const session = await SessionModel.get({ id: session_id })
        .transacting(trx);

      if (!session) {
        return {
          status: false,
          code: 'session_not_found',
        }
      }

      if (session.active === NO || now > session.end_at) {
        return {
          status: false,
          code: 'session_close',
        }
      }

      const associate = await AssociateModel.get({ id: associate_id })
        .transacting(trx);

      if (!associate) {
        return {
          status: false,
          code: 'associate_not_found',
        }
      }

      const vote = await SessionVoteModel.get({
        associate_id: associate.id,
        session_id: session.id,
      }).transacting(trx).forUpdate();

      if (vote) {
        return {
          status: false,
          code: 'vote_found',
        }
      }

      await SessionVoteModel.insert({
        associate_id: associate.id,
        session_id: session.id,
        option,
      }).transacting(trx);

      return { success: true };
    });
  }

  static async get(session_id) {
    const session = await SessionModel.get({ id: session_id });
    if (!session) {
      return {
        status: false,
        code: 'session_not_found',
      }
    }

    const votes = await SessionVoteModel.getVotesAndAssiciates(session.id);
    return {
      name: session.name,
      active: session.active === YES,
      end_at: toUnixEpoch(session.end_at),
      start_at: toUnixEpoch(session.start_at),
      resume: {
        result: session.result,
        yes: session.yes,
        no: session.no,
      },
      votes,
    };
  }

  static autoCloseSession() {
    const now = moment.utc()
      .format('YYYY-MM-DD HH:mm:ss');

    return knex.transaction(async (trx) => {
      const sessions = await SessionModel.getSessionsToClose(now)
        .forUpdate()
        .transacting(trx);

      const querys = sessions.map(async (session) => {
        const votes = await SessionVoteModel.getVotesAndAssiciates(session.id)
          .transacting(trx);
        const size = votes.length;
        const data = {
          active: NO,
          result: DRAW,
          yes: 0,
          no: 0,
        };

        if (size > 0) {
          for (let i = 0; i < size; i += 1) {
            if (votes[i].option === YES) {
              data.yes += 1;
            } else {
              data.no += 1;
            }
          }

          if (data.yes !== data.no) {
            data.result = data.yes > data.no ? 'YES' : 'NO';
          }
        }

        return SessionModel.update([session.id], data)
          .transacting(trx);
      });

      await Promise.all(querys);
    });
  }
}

module.exports = SessionService;
