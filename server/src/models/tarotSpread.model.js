module.exports = (sequelize, Sequelize) => {
    const TarotSpread = sequelize.define('tarot_spread', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        card_count: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'tarot_spreads',
        timestamps: false
    });

    return TarotSpread;
};
