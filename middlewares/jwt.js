const jwt = require('jsonwebtoken');
const apiResponse = require("../helpers/apiResponse");
const secret = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {

    const authorization = req.headers['authorization']
    const token = authorization ? authorization.split(' ')[1] : ''
    if (token === undefined || authorization === undefined) return apiResponse.unauthorizedResponse(res, "Token Undefined")

    const privateKey = secret
    jwt.verify(token, privateKey, function (error, decoded) {
        if (error) return apiResponse.unauthorizedResponse(res, error)

        req.user = decoded //return data from token
        next();
    })
}

module.exports = authenticate;