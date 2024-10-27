// roleMiddleware.js
const { User, Role } = require('./models');

// Middleware to check if the user has a specific role
const checkRole = (roleName) => {
    return async (req, res, next) => {
        const userId = req.userId; // Assume userId is available via authentication
        try {
            const user = await User.findByPk(userId, {
                include: Role,
            });
            const roles = user.Roles.map(role => role.roleName);
            if (roles.includes(roleName)) {
                return next();
            } else {
                return res.status(403).json({ error: 'Access Denied: Insufficient role' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Server error' });
        }
    };
};

module.exports = { checkRole };
