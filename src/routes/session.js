const express = require('express');
const SessionController = require('../controllers/SessionController');
const SessionSchema = require('../routes/schemas/SessionSchema');

const router = express.Router({ mergeParams: true });

/* GET /session/:session_id */
router.get('/:session_id', SessionSchema.get, SessionController.get);
/* POST /session */
router.post('/', SessionSchema.post, SessionController.post);
/* POST /session/:session_id/vote */
router.post('/:session_id/vote', SessionSchema.vote, SessionController.vote);

module.exports = router;
