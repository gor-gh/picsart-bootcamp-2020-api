const router = require('express').Router();
const usersRoutes = require('./usersRoutes');
const topicsRoutes = require('./topicsRoutes');
const projectsRoutes = require('./projectsRoutes');

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
router.use('/projects', projectsRoutes);

module.exports = router;