const crypto = require('crypto');
const secret = require('./config').secret_code;

module.exports = {
    hash: (password) => {
        return crypto.createHmac('sha256', secret)
            .update(password)
            .digest('hex');
    }
}