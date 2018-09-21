const Joi = require('joi');
const RouteValidator = require('../../middlewares/RouteValidator');

class SessionSchema extends RouteValidator {

  static get get() {
    const schema = {
      params: Joi.object().keys({
        session_id: Joi.number().integer().required(),
      }),
    };

    return this.validate(schema);
  }

  static get post() {
    const schema = {
      body: Joi.object().keys({
        name: Joi.string()
          .required()
          .min(1)
          .max(200)
          .trim(),
        minutes: Joi.number()
          .integer()
          .default(1),
      }),
    };

    return this.validate(schema);
  }

  static get vote() {
    const schema = {
      params: Joi.object().keys({
        session_id: Joi.number().integer().required(),
      }),
      body: Joi.object().keys({
        associate_id: Joi.number()
          .integer()
          .min(1)
          .required(),
        option: Joi.any()
          .valid('YES', 'NO')
          .required(),
      }),
    };

    return this.validate(schema);
  }
}

module.exports = SessionSchema;
