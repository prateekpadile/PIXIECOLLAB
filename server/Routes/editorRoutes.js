const express = require('express');
const editorAuthController = require('./../Controllers/editorAuthController');

const router = express.Router();

router.route('/signup').post(editorAuthController.signup);
router.route('/login').post(editorAuthController.login);
router
  .route('/updatePassword')
  .patch(editorAuthController.protect, editorAuthController.updatePassword);


module.exports = router;
