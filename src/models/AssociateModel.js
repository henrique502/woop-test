const { knex } = require('../config/db');

class AssociateModel {
  static get(where) {
    return knex.first([
      'id',
      'name',
      'created_at',
      'updated_at',
    ])
      .from('associate')
      .where(where);
  }
}

module.exports = AssociateModel;
