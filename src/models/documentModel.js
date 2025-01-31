const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Vérifie que le chemin est bon

const Document = sequelize.define('Document', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',  // Assure-toi que la table "users" existe
            key: 'id',
        },
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    filepath: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'documents',
    timestamps: true,
});

module.exports = Document;
