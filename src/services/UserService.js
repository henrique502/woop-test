const { knex } = require('../config/db');
const UserModel = require('../models/UserModel');
const { toUnixEpoch } = require('../helpers/Datetime');

class UserService {

  static async list() {
    const list = await UserModel.list();

    const result = list.map(user => ({
      id: user.id,
      name: user.name,
      status: user.status,
      createdAt: toUnixEpoch(user.createdAt),
      updatedAt: toUnixEpoch(user.updatedAt),
      deletedAt: user.deletedAt ? toUnixEpoch(user.deletedAt) : null,
    }));

    return list;
  }

  static async get(data) {
    let user = await UserModel.get(data);

    if (user) {
      user = {
        id: user.id,
        name: user.name,
        status: user.status,
        createdAt: toUnixEpoch(user.createdAt),
        updatedAt: toUnixEpoch(user.updatedAt),
        deletedAt: user.deletedAt ? toUnixEpoch(user.deletedAt) : null,
      };
    }

    return user;
  }

  static post(data) {
    return UserModel.post(data);
  }

  static put(userId, data) {
    return knex.transaction(async (trx) => {
      const user = await UserModel.get(userId)
        .transacting(trx);

      if (user) {
        await UserModel.put(user.id, data)
          .transacting(trx);

        return true;
      }

      return false;
    });
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

module.exports = UserService;
