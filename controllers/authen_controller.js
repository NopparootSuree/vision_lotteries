const db = require('../models/sequelize')
const Joi = require('joi');
const { generateToken, comparePassword, setTimeExpired, hashPassword } = require('../utils/authen')
require('dotenv').config();
const User = db.authen

const register = async (req, res) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        authenkey: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { username, password, authenkey } = req.body
    if (authenkey != process.env.AUTHEN_PASSWORD) {
        return res.status(401).json({ error: "Invalid authenticate password" })
    }

    const hashedPassword = await hashPassword(password)

    let arg = {
        username: username,
        password: hashedPassword,
    }

    try {
        await User.create(arg)
        return res.status(200).json({ message: "Created user successfully" })

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            if (error.errors[0].message === 'users_username must be unique') {
                return res.status(400).json({ error: "This username already exists." })
            } else if (error.errors[0].message === 'users_email must be unique') {
                return res.status(400).json({ error: "This email already exists." })
            }
        } else {
            return res.status(500).json({ error: "Internal Server Error" })
        }
    }
}

const login = async (req, res) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { username, password } = req.body;

    const user = await User.findOne({ where: { username: username } })

    if (user != null) {
        let jsonPassword = JSON.stringify(user.password)
        const hashedPassword = jsonPassword.replace(/\"/g, "");
        const secretKey = process.env.JWT_SECRET_KEY;

        const isPasswordCorrect = await comparePassword(password, hashedPassword);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: 'Login error, Invalid username and password.' });
        }

        let expiredIn = setTimeExpired(1, "d")

        const claims = {
            username: user.username,
            algorithm: 'HS256',
        };

        const token = generateToken(claims, secretKey, expiredIn.stingTime);

        const payload = {
            token,
            username: user.username,
            issuedAt: new Date(),
            expiredAt: expiredIn.times,
        };

        res.status(200).json({ payload });
    } else {
        return res.status(404).json({ error: 'User is not found' });
    }

}

module.exports = {
    register,
    login
}