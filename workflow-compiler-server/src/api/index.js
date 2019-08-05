const express = require('express');

const router = express.Router()

router.use('/compile', require('./compile'))



module.exports = router;