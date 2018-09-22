const { knex } = require('../config/db');

class SessionModel {
  static insert(data) {
    return knex('session')
      .insert(data)
      .returning('id');
  }

  static get(where) {
    return knex.first([
      'id',
      'name',
      'active',
      'end_at',
      'result',
      'yes',
      'no',
      'start_at',
      'created_at',
      'updated_at',
    ])
      .from('session')
      .where(where);
  }

  static getSessionsToClose(date) {
    return knex.select('id')
      .from('session')
      .where('end_at' , '<', date)
      .where('active' , 'YES');
  }

  static update(ids, date) {
    return knex('session').update(date)
      .whereIn('id', ids);
  }
}

module.exports = SessionModel;
