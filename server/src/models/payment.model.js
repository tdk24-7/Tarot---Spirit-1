                                                                                                                                                                                                                                                                                        module.exports = (sequelize, Sequelize) => {
  const Payment = sequelize.define('payment', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    app_trans_id: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: Sequelize.STRING(10),
      defaultValue: 'VND'
    },
    status: {
      type: Sequelize.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending'
    },
    transaction_id: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    payment_method: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'payments',
    timestamps: false
  });

  return Payment;
}; 