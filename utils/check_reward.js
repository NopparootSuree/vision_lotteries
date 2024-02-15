const db = require('../models/sequelize')
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

        let list_lotteries_number = []

        lotteries.forEach((eachLotterie) => {
            list_lotteries_number.push({lottery_number: eachLotterie.lottery_number, reward_number: eachLotterie.reward_number})
        });

        let list_sorted = list_lotteries_number.sort((a, b) => a - b);
        
        let message = ''
        if (list_sorted.length == 2) {
            list_sorted.forEach((element) => {
                if (element.reward_number != 7) {
                    message = `คุณถูกรางวัลที่ ${element.reward_number} และ รางวัล 3 ตัวท้าย เลข ${lottery_number}`
                }
            })
        } else if (list_sorted.length == 1) {
            if (list_sorted[0].reward_number == 7) {
                message = `คุณถูกรางวัล 3 ตัวท้าย เลข ${lottery_number}`
            } else {
                message = `คุณถูกรางวัลที่ ${list_sorted[0].reward_number} เลข ${list_sorted[0].lottery_number}`
            }
        } else {
            message = `คุณไม่ถูกรางวัล เลข ${lottery_number}`
        }

        return message
    } catch (error) {
        return error
    }
}

module.exports = check_reward