const db = require('../models/sequelize')
const Joi = require('joi');
const Lotterie = db.lottery

const check_reward = async (lottery_number) => {
    try {
        let lotteries = await Lotterie.findAll({ where: {} })
        return lotteries
    } catch (error) {
        return error
    }
}

module.exports = check_reward