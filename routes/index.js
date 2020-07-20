const mongoose = require('mongoose');
const router = require('express').Router();
const apiRoutes = require('./apiRoutes');
const errorRoutes = require('./errorRoutes');

router.use('/api',apiRoutes);
router.get('/',(req, res) => {
    res.send(mongoose.connection.name);
})
router.use('/',errorRoutes);

module.exports = router;
