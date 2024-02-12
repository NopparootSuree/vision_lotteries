module.exports = (sequelize, DataTypes) => {
    const Lottery = sequelize.define("lottery", {
        lottery_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reward_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: true,
    })
    return Lottery
}