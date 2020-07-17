const router = require('express').Router();
const usersRoutes = require('./usersRoutes');
const topicsRoutes = require('./topicsRoutes');

router.get('/companies',(req, res) => {
    res.json([
        {
            id: 1,
            name: "PicsArt Bootcamp 2020 Test"
        }
    ])
})
router.use('/users',usersRoutes);
router.use('/topics', topicsRoutes);

module.exports = router;