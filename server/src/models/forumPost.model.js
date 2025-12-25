module.exports = (sequelize, Sequelize) => {
    const ForumPost = sequelize.define("forum_posts", {
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
            type: Sequelize.STRING(255),
            allowNull: false
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        category: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        tags: {
            type: Sequelize.JSON, // Or Sequelize.ARRAY(Sequelize.STRING) for Postgres, but JSON is safer for compatibility
            defaultValue: []
        },
        likes: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        views: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        is_pinned: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
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

    return ForumPost;
};
