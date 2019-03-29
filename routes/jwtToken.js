const jwt = require('jsonwebtoken');
const httpStatus = require('http-status-codes');

const secret = require('../config/config').secret_key;

verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token){
		return res.status(httpStatus.UNAUTHORIZED).json({ 
			auth: false,
			message: 'No token provided.' 
		});
    }
    
    jwt.verify(token, config.secret, (err, decoded) => {
		if (err){
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
					auth: false, 
					message: 'Fail to Authenticate. Error -> ' + err 
				});
		}
		req.userId = decoded.id;
		next();
	});
}