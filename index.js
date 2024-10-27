// app.js
const express = require('express');
const { User, Role, Permission } = require('./models');
const app = express();

app.use(express.json());

// Create a new role
app.post('/roles', async (req, res) => {
    const { roleName } = req.body;
    console.log(roleName);
    try {
        const role = await Role.create({ roleName });
        res.status(201).json(role);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

// Create a new permission
app.post('/permissions', async (req, res) => {
    const { permissionName } = req.body;
    try {
        const permission = await Permission.create({ permissionName });
        res.status(201).json(permission);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Create a new user
app.post('/users', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.create({ name, email, password });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Assign a role to a user
app.post('/users/:userId/roles/:roleId', async (req, res) => {
    const { userId, roleId } = req.params;

    console.log("hello testing",userId, roleId);
    try {
        const user = await User.findByPk(userId);
        const role = await Role.findByPk(roleId);
        await user.addRole(role);
        res.status(200).json({ message: `Role ${role.roleName} assigned to user ${user.name}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Assign a permission to a role
app.post('/roles/:roleId/permissions/:permissionId', async (req, res) => {
    const { roleId, permissionId } = req.params;
    try {
        const role = await Role.findByPk(roleId);
        const permission = await Permission.findByPk(permissionId);
        await role.addPermission(permission);
        res.status(200).json({ message: `Permission ${permission.permissionName} assigned to role ${role.roleName}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's roles and permissions
app.get('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId, {
            include: {
                model: Role,
                include: [Permission],
            },
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log('Server running on port 3000');
