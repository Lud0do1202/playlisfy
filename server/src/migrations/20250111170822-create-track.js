/** @type {import('sequelize-cli').Migration} */
const migration = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Tracks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('Tracks');
    },
};

export default migration;
