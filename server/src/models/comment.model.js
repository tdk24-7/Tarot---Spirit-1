module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comments", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        post_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        parent_comment_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        likes: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        is_approved: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Comment;
};
