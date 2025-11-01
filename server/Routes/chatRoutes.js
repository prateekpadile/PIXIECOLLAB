const express = require('express');
const chatController = require('./../Controllers/chatController.js');

const router = express.Router();

router.route('/add').post(chatController.add);
router.route('/fetch').post(chatController.fetch);

module.exports = router;