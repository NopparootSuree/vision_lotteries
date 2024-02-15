const controller = require('../controllers/reward_controller')
const router = require('express').Router()
const JWTMiddleware = require('../middlewares/jwt')
const multer = require('multer');

const upload = multer();
const jwtMiddleware = JWTMiddleware(process.env.JWT_SECRET_KEY);

// router.post('/upload', jwtMiddleware, upload.single('image'), controller.reward)
router.post('/upload', upload.single('image'), controller.reward)
router.post('/check_reward', controller.number_reward)

module.exports = router