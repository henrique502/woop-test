const { knex } = require('../config/db');

class SessionVoteModel {
  static insert(data) {
    return knex('session_vote')
      .insert(data)
      .returning('id');
  }

  static get(where) {
    return knex.first([
      'session_id',
      'associate_id',
      'option',
      'created_at',
      'updated_at',
    ])
      .from('session_vote')
      .where(where);
  }

  static getVotesAndAssiciates(session_id) {
    return knex.select([
      'session_vote.option',
      'associate.name',
    ]).from('session_vote')
    .innerJoin('associate', 'session_vote.associate_id', 'associate.id')
    .where('session_vote.session_id', session_id)
    .orderBy('associate.name')
  }
}

module.exports = SessionVoteModel;
