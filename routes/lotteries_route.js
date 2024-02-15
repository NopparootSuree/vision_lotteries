const controller = require('../controllers/lotteries_controller')
const router = require('express').Router()
const JWTMiddleware = require('../middlewares/jwt')

const jwtMiddleware = JWTMiddleware(process.env.JWT_SECRET_KEY);

router.post('/lotterie', controller.addLotterie)
router.get('/lotteries', controller.listLotteries)
router.delete('/lotterie/:id', controller.deleteLotterie)

module.exports = router