"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        name: "James",
        email: "james@gmail.com",
        password: "testtest",
      },
    ])
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {})
  },
}
