const crypto = require('crypto');
const secret = 'my_secret_code';

module.exports = {
    checkPasswordsForEquality: (newPas, passFromDb) => {
        return new Promise((resolve, reject) => {
            const newHash = crypto.createHmac('sha256', secret)
                .update(newPas)
                .digest('hex');
            if (newHash === passFromDb) {
                resolve(true)
            }
            else reject(new Error("Wrong password"));
        })
    }
}