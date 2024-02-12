const controller = require('../controllers/lotteries_controller')
const router = require('express').Router()
const JWTMiddleware = require('../middlewares/jwt')

const jwtMiddleware = JWTMiddleware(process.env.JWT_SECRET_KEY);

router.post('/lotterie', jwtMiddleware, controller.addLotterie)
router.get('/lotteries', jwtMiddleware, controller.listLotteries)
router.delete('/lotterie/:id', jwtMiddleware, controller.deleteLotterie)

module.exports = router