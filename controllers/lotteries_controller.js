const db = require('../models/sequelize')
const Joi = require('joi');
const Lotterie = db.lottery

const addLotterie = async (req, res) => {
    const schema = Joi.object({
        lottery_number: Joi.number().integer().required(),
        reward_number: Joi.number().integer().min(1).max(7).required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const lotterie = await Lotterie.create({ ...req.body })
        res.status(200).json({ message: "Created lotterie successfully", result: lotterie })

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            if (error.errors[0].message === 'lotteries_name must be unique') {
                return res.status(400).json({ error: "This lotterie name already exists." })
            } else if (error.errors[0].message === 'PRIMARY must be unique') {
                return res.status(400).json({ error: "This lotterieID already exists." })
            }
        } else {
            return res.status(500).json({ error: "Internal Server Error" })
        }
    }
}

const listLotteries = async (req, res) => {
    let lotteries = await Lotterie.findAll({ where: {} })
    if (lotteries.length == 0) {
        return res.status(200).json({ result: "No lotterie" })
    }
    res.status(200).json(lotteries)
}

const deleteLotterie = async (req, res) => {
    const { id } = req.params

    let lotterie = await Lotterie.destroy({
        where: {
            id: id
        }
    })

    if (lotterie == 0) {
        return res.status(200).json({ result: "No lotterie" })
    }

    res.status(200).json({ message: "Deleted Lotterie successfully" })
}

module.exports = {
    addLotterie,
    listLotteries,
    deleteLotterie,
}