const router = require('express').Router();
const controllers = require('../controllers');
const auth = require('../utils/auth');


router.get('/create', auth(), controllers.expense.get.create);

router.post('/create', auth(), controllers.expense.post.create);

router.get('/details/:id', auth(), controllers.expense.get.details);

router.get('/delete/:id', auth(), controllers.expense.get.delete);

module.exports = router;