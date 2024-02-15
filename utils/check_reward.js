const db = require('../models/sequelize')
const Joi = require('joi');
const { Op } = require('sequelize');
const Lotterie = db.lottery

const check_reward = async (lottery_number) => {
    const three_digits = Number(lottery_number.toString().slice(-3));

    try {
        let lotteries = await Lotterie.findAll(
            {
                where:
                {
                    [Op.or]: [
                        { lottery_number: lottery_number },
                        { lottery_number: three_digits },
                      ]
                }
            }
        );

        console.log(typeof lotteries);
        console.log(lotteries);

        let list_lotteries_number = []

        lotteries.forEach((eachLotterie) => {
            console.log("reward no :", eachLotterie.reward_number)
            console.log("lottery_no",eachLotterie.lottery_number)
            list_lotteries_number.push({lottery_number: eachLotterie.lottery_number, reward_number: eachLotterie.reward_number})
        });

        let list_sorted = list_lotteries_number.sort((a, b) => b - a);
        
        let message = ''
        if (list_sorted.length == 2) {
            message = `คุณถูกรางวัลที่ ${list_sorted[0].reward_number} \n และ รางวัล 3 ตัวท้าย \n เลข ${list_sorted[0].lottery_number}`
        } else if (list_sorted.length == 1) {
            if (list_sorted[0].length == 3) {
                message = `คุณถูกรางวัล 3 ตัวท้าย \n เลข ${list_sorted[0].lottery_number}`
            } else {
                message = `คุณถูกรางวัลที่ ${list_sorted[0].reward_number} \n เลข ${list_sorted[0].lottery_number}`
            }
        } else {
            message = `คุณไม่ถูกรางวัล \n เลข ${lottery_number}`
        }

        return message
    } catch (error) {
        return error
    }
}

module.exports = check_reward