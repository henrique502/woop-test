const moment = require('moment-timezone');
const { knex } = require('../config/db');
const SessionModel = require('../models/SessionModel');
const AssociateModel = require('../models/AssociateModel');
const SessionVoteModel = require('../models/SessionVoteModel');
const { YES, NO } = require('../types/boolean');
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
    return knex.transaction(async (trx) => {
      const session = await SessionModel.get({ id: session_id })
        .transacting(trx);

      if (!session) {
        return {
          status: false,
          code: 'session_not_found',
        }
      }

      if (session.active === NO) {
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

      return { status: true };
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
    const size = votes.length;
    const data = {
      name: session.name,
      active: session.active === YES,
      end_at: toUnixEpoch(session.end_at),
      start_at: toUnixEpoch(session.start_at),
      resume: {
        result: null,
        yes: 0,
        no: 0,
      },
      votes: [],
    };

    if (size > 0) {
      for (let i = 0; i < size; i += 1) {
        data.votes.push(votes[i]);

        if (votes[i].option === YES) {
          data.resume.yes += 1;
        } else {
          data.resume.no += 1;
        }
      }

      if (session.active === NO) {
        if (data.resume.yes === data.resume.no) {
          data.resume.result = 'DRAW';
        } else {
          data.resume.result = data.resume.yes > data.resume.no ? 'YES' : 'NO';
        }
      }
    }

    return data;
  }

  static async autoCloseSession() {
    const now = moment.utc()
      .format('YYYY-MM-DD HH:mm:ss');

    await SessionModel.closeSessionByDate(now);
  }
}

module.exports = SessionService;
