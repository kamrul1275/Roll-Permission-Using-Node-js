// models.js
const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize connection
const sequelize = new Sequelize('rolepermission', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

// Define User Model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false
});

// Define Role Model
const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    roleName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});

// Define Permission Model
const Permission = sequelize.define('Permission', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    permissionName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    timestamps: false // Disable createdAt and updatedAt
});
// Define junction tables for many-to-many relationships
const UserRoles = sequelize.define('UserRoles', {});
const RolePermissions = sequelize.define('RolePermissions', {});

// Define relationships
User.belongsToMany(Role, { through: UserRoles });
Role.belongsToMany(User, { through: UserRoles });

Role.belongsToMany(Permission, { through: RolePermissions });
Permission.belongsToMany(Role, { through: RolePermissions });

// Sync models
sequelize.sync()
    .then(() => console.log('Tables have been created.'))
    .catch((err) => console.error('Error creating tables:', err));

module.exports = { User, Role, Permission };
