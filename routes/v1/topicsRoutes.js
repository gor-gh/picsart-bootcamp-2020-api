const router = require('express').Router();
const topicsController = require('../../controllers/v1/topicsController');

router.get('/', topicsController.getAllTopicsInfo);
router.post('/', topicsController.create);
router.post('/:topicId/voting', topicsController.vote);
router.delete('/:topicId', topicsController.deleteTopic);

module.exports = router;



// {
//     "email": "gorgh@mail.ru",
//     "password": "password",
//     "firstName": "Gor",
//     "lastName": "Gharagyozyan",
//     "birthDate": "2000-02-01",
//     "sex": "male",
//     "avatarUrl": "https://images.unsplash.com/photo-1555445091-5a8b655e8a4a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
//     "jsExperience": 5,
//     "reactExperience": 1,
//     "companyId": 2
// }