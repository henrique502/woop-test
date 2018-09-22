const Logger = require('../helpers/Logger');
const SessionService = require('../services/SessionService');

class SessionController {

  static async post(req, res) {
    try {
      const session_id = await SessionService.startNewSession({
        name: req.joi.body.name,
        minutes: req.joi.body.minutes,
      });

      res.send({
        success: true,
        data: { session_id },
      });
    } catch (err) {
      Logger.throw(res, '3272358416', err);
    }
  }

  static async get(req, res) {
    try {
      const data = await SessionService.get(req.joi.params.session_id);

      if (data.status === false) {
        res.send({
          success: false,
          message: req.__('api.session.vote.session_not_found'),
        });
        return;
      }

      res.send({ success: true, data });
    } catch (err) {
      Logger.throw(res, '6001059324', err);
    }
  }

  static async vote(req, res) {
    try {
      const result = await SessionService.vote({
        session_id: req.joi.params.session_id,
        associate_id: req.joi.body.associate_id,
        option: req.joi.body.option,
      });

      if (result.success) {
        res.status(204).send();
        return;
      }

      res.send({
        success: false,
        message: req.__(`api.session.vote.${result.code}`),
      });
    } catch (err) {
      Logger.throw(res, '2365958507', err);
    }
  }
}

module.exports = SessionController;
