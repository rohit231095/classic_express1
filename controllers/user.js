const db = require('../config/database');
const rel = require('../config/relations');
const encrypt = require('../methods/encryption').encrypt;
const decrypt = require('../methods/encryption').decrypt;
const secret = require('../config/config').secret_key;

const bcrypt = require('bcrypt');
const httpStatus = require('http-status-codes');
const schedule = require('node-schedule');
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');

const Users = rel.users;
const Roles = rel.roles;
const OTPs = rel.otps;

const Op = Sequelize.Op;

otpGenerate = () => {
    const OTP = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    return OTP;
}

exports.start = (req, res, next) => {
    console.log('Classic Express');
    res.send('Classic Express Api Running');
}

exports.signup = async (req, res, next) => {
    console.log('Trying to signup');
    const body = req.body;

    console.log('User ===>', body);

    if (body['email'] !== undefined) {
        userUserNameErr = await Users.findOne({
            where: {
                [Op.and]: [{
                    isActive: true
                }, {
                    userName: encrypt(body.email)
                }]
            }
        });
    } else {
        userUserNameErr = null;
    }

    if (body['mobile'] !== undefined) {
        userContactErr = await Users.findOne({
            where: {
                [Op.and]: [{
                    isActive: true
                }, {
                    mobile: encrypt(body.mobile)
                }]
            }
        });
    } else {
        userContactErr = null;
    }

    if (userContactErr !== null) {
        console.log('Duplicate Contact, user not created');

        messageContactErr = "Contact already exist for another user";

    } else {
        messageContactErr = "";
    }

    if (userUserNameErr !== null) {
        console.log('Duplicate Email, user not created');

        messageEmailErr = "Email already exist for another user";

    } else {
        messageEmailErr = "";
    }

    const messageErr = {
        messageEmailErr: messageEmailErr,
        messageContactErr: messageContactErr
    };

    if ((messageErr.messageEmailErr === '') && (messageErr.messageContactErr === '')) {
        const roles = await Roles.findAll({
            where: {
                roleName: body.role
            }
        });

        const create = {
            userName: encrypt(body.email),
            firstName: encrypt(body.firstName),
            lastName: encrypt(body.lastName),
            gender: encrypt(body.gender),
            streetAddress: encrypt(body.streetAddress),
            email: encrypt(body.email),
            mobile: encrypt(body.mobile),
            password: bcrypt.hashSync(body.password, 8),
            countryId: body.countryId,
            stateId: body.stateId,
            cityId: body.cityId
        }

        Users.create(create)
            .then(user => {
                user.setRoles(roles);
                OTP = otpGenerate();
                console.log('OTP ===>', OTP);
                OTPs.create({
                    otp: OTP,
                    userId: user.userId
                });
            })
            .then(() => {
                return res.status(httpStatus.CREATED).json({
                    message: "User registered successfully!"
                });
            })
            .catch(err => {
                console.log('Creation Error ===>', err);
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    message: err
                })
            })
    } else {
        return res.status(httpStatus.CONFLICT).json(messageErr);
    }
}

exports.otpVerify = (req, res, next) => {
    otp = req.body.otp;
    console.log('OTP ===>', otp);

    OTPs.findOne({
        where: {
            otp: otp
        }
    })
        .then(store => {
            if (store !== null) {
                userId = store.userId;
                Users.update({ isActive: true }, { where: { userId: userId } })
                    .then(user => {
                        if (user !== null) {
                            console.log('User is Active ===>', user);
                            store.destroy();
                            res.status(httpStatus.OK).json({
                                message: 'OTP verified successfully'
                            })
                        } else {
                            res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                                message: 'User does not exist'
                            });
                        }
                    })
                    .catch(err => {
                        console.log('Activation Error ===>', err);
                        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                            message: err
                        });
                    })
            } else {
                res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                    message: 'Invalid OTP'
                })
            }
        })
        .catch(err => {
            console.log('Verification Error ===>', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                message: err
            })
        })
}

exports.login = (req, res, next) => {
    const body = req.body;

    if (!body.userName) {
        return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
            message: "Username cannot be empty"
        })
    }
    if (!body.password) {
        return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
            message: "Password cannot be empty"
        })
    }

    Users.findOne({
        where: {
            [Op.and]: [{
                userName: encrypt(body.userName)
            }, {
                isActive: true
            }]
        },
        include: [{
            model: Roles
        }]
    })
        .then(user => {
            console.log(user);
            if (user !== null) {
                roles = user.roles[0];
                // console.log(roles);
                passwordValidate = bcrypt.compareSync(body.password, user.password);
                console.log('IsValid ===>', passwordValidate);
                if (passwordValidate) {
                    const token = jwt.sign({
                        id: user.userId
                    }, secret, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                    res.status(httpStatus.OK).json({
                        auth: true,
                        accessToken: token,
                        status: 200,
                        user: user,
                        role: roles,
                        message: "Successfully Logged In"
                    });
                } else {
                    return res.status(httpStatus.UNAUTHORIZED).json({
                        auth: false,
                        message: "Invalid Password!"

                    });
                }
            } else {
                return res.status(httpStatus.UNAUTHORIZED).json({
                    auth: false,
                    message: "Invalid Username!"
                });
            }
        })
        .catch(err => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                "message": err
            });
        })
}

exports.adminLogin = (req, res, next) => {
    const body = req.body;

    if (!body.userName) {
        return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
            message: "Username cannot be empty"
        })
    }
    if (!body.password) {
        return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
            message: "Password cannot be empty"
        })
    }

    Users.findOne({
        where: {
            [Op.and]: [{
                userName: encrypt(body.userName)
            }, {
                isActive: true
            }]
        },
        include: [{
            model: Roles
        }]
    })
        .then(user => {
            if (user.roles[0].roleName === 'ADMIN') {
                console.log(user);
                if (user !== null) {
                    roles = user.roles[0];
                    // console.log(roles);
                    passwordValidate = bcrypt.compareSync(body.password, user.password);
                    console.log('IsValid ===>', passwordValidate);
                    if (passwordValidate) {
                        const token = jwt.sign({
                            id: user.userId
                        }, secret, {
                                expiresIn: 86400 // expires in 24 hours
                            });
                        res.status(httpStatus.OK).json({
                            auth: true,
                            accessToken: token,
                            status: 200,
                            user: user,
                            role: roles,
                            message: "Successfully Logged In"
                        });
                    } else {
                        return res.status(httpStatus.UNAUTHORIZED).json({
                            auth: false,
                            message: "Invalid Password!"

                        });
                    }
                } else {
                    return res.status(httpStatus.UNAUTHORIZED).json({
                        auth: false,
                        message: "Invalid Username!"
                    });
                }
            }
            else {
                res.status(httpStatus.UNAUTHORIZED).json({
                    message: 'Is not ADMIN. Please check again'
                })
            }
        })
        .catch(err => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                "message": err
            });
        })
}

exports.checkUser = (req, res, nex) => {
    console.log('username ===>', req.params);
    Users.findOne({
        where: {
            userName: encrypt(req.params.userName)
        }
    })
        .then(user => {
            if (user !== null) {
                user.userName = decrypt(user.userName);
                user.firstName = decrypt(user.firstName);
                user.lastName = decrypt(user.lastName);
                user.gender = decrypt(user.gender);
                user.streetAddress = decrypt(user.streetAddress);
                user.email = decrypt(user.email);
                user.mobile = decrypt(user.mobile);
                res.status(httpStatus.OK).json({
                    user: user,
                    status: 200
                });
            } else {
                res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                    message: 'User not found',
                    status: 422
                });
            }
        })
        .catch(err => {
            console.log('Error ===>', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
        })
}

exports.getAdminById = (req, res, next) => {
    Users.findOne({
        where: {
            userId: req.params.id,
            isActive: true
        }
    })
    .then(user => {
        if (user !== null) {
            user.userName = decrypt(user.userName);
            user.firstName = decrypt(user.firstName);
            user.lastName = decrypt(user.lastName);
            user.gender = decrypt(user.gender);
            user.streetAddress = decrypt(user.streetAddress);
            user.email = decrypt(user.email);
            user.mobile = decrypt(user.mobile);

            res.status(httpStatus.OK).json({
                user: user
            });
        } else {
            res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                message: 'User not found'
            });
        }
    })
    .catch(err => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    })
}

exports.addUser = (req, res, next) => {
    const body = req.body;
    console.log('User ===>', body);

    Users.findOne({
        where: {
            userId: req.userId
        }
    })
        .then(async user => {
            if (body['email'] !== undefined) {
                userUserNameErr = await Users.findOne({
                    where: {
                        [Op.and]: [{
                            isActive: true
                        }, {
                            userName: encrypt(body.email)
                        }]
                    }
                });
            } else {
                userUserNameErr = null;
            }

            if (body['mobile'] !== undefined) {
                userContactErr = await Users.findOne({
                    where: {
                        [Op.and]: [{
                            isActive: true
                        }, {
                            mobile: encrypt(body.mobile)
                        }]
                    }
                });
            } else {
                userContactErr = null;
            }

            if (userContactErr !== null) {
                console.log('Duplicate Contact, user not created');

                messageContactErr = "Contact already exist for another user";

            } else {
                messageContactErr = "";
            }

            if (userUserNameErr !== null) {
                console.log('Duplicate Email, user not created');

                messageEmailErr = "Email already exist for another user";

            } else {
                messageEmailErr = "";
            }

            const messageErr = {
                messageEmailErr: messageEmailErr,
                messageContactErr: messageContactErr
            };

            if ((messageErr.messageEmailErr === '') && (messageErr.messageContactErr === '')) {

                const create = {
                    userName: encrypt(body.email),
                    firstName: encrypt(body.firstName),
                    lastName: encrypt(body.lastName),
                    gender: encrypt(body.gender),
                    streetAddress: encrypt(body.streetAddress),
                    email: encrypt(body.email),
                    mobile: encrypt(body.mobile),
                    password: bcrypt.hashSync(body.password, 8),
                    countryId: user.countryId,
                    stateId: user.stateId,
                    cityId: user.cityId,
                    userAdmin: req.userId
                }

                Users.create(create)
                    .then(user => {
                        return res.status(httpStatus.CREATED).json({
                            message: "User registered successfully!"
                        });
                    })
                    .catch(err => {
                        console.log('Creation Error ===>', err);
                        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                            message: err
                        })
                    })
            } else {
                return res.status(httpStatus.CONFLICT).json(messageErr);
            }
        })
        .catch(err => {
            console.log('Creation Error ===>', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                message: err
            })
        })
}

exports.getUser = (req, res, next) => {
    const usersArr = [];
    Users.findAll({
        where: {
            userAdmin: req.userId
        }
    })
        .then(user => {
            user.map(item => {
                item.userName = decrypt(item.userName);
                item.firstName = decrypt(item.firstName);
                item.lastName = decrypt(item.lastName);
                item.gender = decrypt(item.gender);
                item.streetAddress = decrypt(item.streetAddress);
                item.email = decrypt(item.email);
                item.mobile = decrypt(item.mobile);
                usersArr.push(item);
            })
            return usersArr;
        })
        .then(users => {
            res.status(httpStatus.OK).json({
                users: users
            })
        })
        .catch(err => {
            console.log('Error ===>', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
        })
}

exports.getAdmin = (req, res, next) => {
    Users.findOne({
        where: {
            userId: req.userId
        }
    })
        .then(user => {
            if (user !== null) {
                user.userName = decrypt(user.userName);
                user.firstName = decrypt(user.firstName);
                user.lastName = decrypt(user.lastName);
                user.gender = decrypt(user.gender);
                user.streetAddress = decrypt(user.streetAddress);
                user.email = decrypt(user.email);
                user.mobile = decrypt(user.mobile);
                res.status(httpStatus.OK).json({
                    user: user,
                    status: 200
                });
            } else {
                res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                    message: 'User not found'
                })
            }
        })
        .catch(err => {
            console.log('Error ===>', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
        })
}

diff_minutes = (dt2, dt1) => {

    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));

}

var rule = new schedule.RecurrenceRule();
rule.minute = new schedule.Range(0, 59, 1);
schedule.scheduleJob(rule, () => {
    date = new Date();
    console.log(date);
    OTPs.findAll()
        .then(otp => {
            otp.map(item => {
                // console.log(diff_minutes(date, item.createdAt));
                if (diff_minutes(date, item.createdAt) > 15) {
                    console.log('Deleted Otp ===>', item.otp);
                    item.destroy();
                }
            });
        })
        .catch(err => console.log(err))
});
