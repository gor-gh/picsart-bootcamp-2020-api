const router = require('express').Router();
const usersRoutes = require('./usersRoutes');

router.get('/companies',(req, res) => {
    res.json([
        {
            id: 1,
            name: "PicsArt Bootcamp 2020 Test"
        }
    ])
})
router.use('/users',usersRoutes);

module.exports = router;