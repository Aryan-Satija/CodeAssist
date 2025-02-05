const express = require('express');
const router = express.Router();
const {Roadmap, RoadmapV2} = require('../controllers/roadmap.js');
router.post('/roadmap', Roadmap);
router.post('/v2/roadmap', RoadmapV2);
module.exports = router;