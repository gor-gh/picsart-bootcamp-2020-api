const Token = require('../../models/token');

module.exports = {
    createToken: (user) => {
        return new Promise((resolve, reject) => {
            const newToken = new Token({ owner: user });
            newToken.save((err, token) => {
                if (err) reject(err);
                resolve(token);
            })

        })
    },
    deleteToken: (tokenId) => {
        return new Promise((resolve, reject) => {
            Token.findByIdAndDelete(tokenId, (err, tokens) => {
                if (err) reject(new Error("Can't delete the specified token"));
                resolve(true);
            })
        })
    },
    authenticate: tokenId => {
        return new Promise((resolve, reject) => {
            Token.findById(tokenId, (err, token) => {
                if (err || !token) {
                    reject(new Error("Can't authenticate the user"));
                }
                resolve(token);
            })
        })
    }
}