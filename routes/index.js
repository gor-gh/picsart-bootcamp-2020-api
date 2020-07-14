const router = require('express').Router();
const apiRoutes = require('./apiRoutes');
const errorRoutes = require('./errorRoutes');

router.use('/api',apiRoutes);
router.get('/',(req, res) => {
    res.send("Hello");
})
router.use('/',errorRoutes);

module.exports = router;
