const express = require('express');
const Video = require('../Models/Video.js');

const router = express.Router();

router.get('/get', async (req, res) => {
  const { projectId } = req.query;
  try {
    const video = await Video.findOne({ projectId: projectId });
    res.json({ video: video });
  } catch (err) {
    console.log(err);
    res.json({ error: err.message });
  }
});

module.exports = router;
