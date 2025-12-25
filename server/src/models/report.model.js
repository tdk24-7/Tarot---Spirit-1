module.exports = (sequelize, Sequelize) => {
    const Report = sequelize.define("reports", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        reporter_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        target_id: {
            type: Sequelize.INTEGER, // ID of post or comment
            allowNull: false
        },
        report_type: {
            type: Sequelize.STRING(20), // 'post' or 'comment'
            allowNull: false
        },
        reason: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        details: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        status: {
            type: Sequelize.STRING(20), // 'pending', 'resolved', 'rejected'
            defaultValue: 'pending'
        }
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Report;
};
