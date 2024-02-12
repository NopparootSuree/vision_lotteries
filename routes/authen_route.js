const controller = require('../controllers/authen_controller')
const router = require('express').Router()

router.post('/login', controller.login)
router.post('/register', controller.register)

module.exports = router