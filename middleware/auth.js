const config = require('../config');

function checkAdmin(password) {
    return password === config.ADMIN_PASSWORD;
}

function requireAdmin(password) {
    if (!checkAdmin(password)) {
        return {
            authorized: false,
            message: '🚫 Access Denied!\n\nThis command requires admin privileges.\nPlease provide the correct admin password.\n\nUsage: !command <admin_password> [args]'
        };
    }
    return { authorized: true };
}

module.exports = {
    checkAdmin,
    requireAdmin
};
