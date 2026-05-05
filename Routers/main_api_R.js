const express = require('express');
const router = express.Router();
module.exports = router;


const notifications_R = require('./notifications_R');
router.use('/NF',[],notifications_R);

const users_R = require('./users_R');
router.use('/US', [], users_R);


const veterinarians_R = require('./veterinarians_R');
router.use('/VT', [], veterinarians_R);
