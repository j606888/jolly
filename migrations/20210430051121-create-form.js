"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Forms", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
      expires_at: {
        type: Sequelize.DATE,
      },
      collect_email: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      display_type: {
        type: Sequelize.STRING,
        defaultValue: "public",
      },
      submit_once: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      allow_edit: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Forms")
  },
}
