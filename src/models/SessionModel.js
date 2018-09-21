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
      'start_at',
      'created_at',
      'updated_at',
    ])
      .from('session')
      .where(where);
  }

  static closeSessionByDate(date) {
    return knex('session').update({
      'active': 'NO',
    })
      .where('end_at' , '<', date)
      .where('active' , 'YES');
  }
}

module.exports = SessionModel;
