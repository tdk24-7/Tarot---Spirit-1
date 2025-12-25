module.exports = (sequelize, Sequelize) => {
    const Journal = sequelize.define("journals", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING(200),
            allowNull: false
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        mood: {
            type: Sequelize.ENUM('happy', 'sad', 'neutral', 'anxious', 'calm', 'excited', 'confused'),
            allowNull: true
        },
        tags: {
            type: Sequelize.JSON,
            defaultValue: []
        },
        associated_reading_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'journals',
        underscored: true
    });

    return Journal;
};
