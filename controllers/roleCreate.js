const rel = require('../config/relations');
const Roles = rel.roles;

const roles = () => {
    Roles.create({
        roleName: 'CLIENT'
    });
    Roles.create({
        roleName: 'SUPER ADMIN'
    });
    Roles.create({
        roleName: 'ADMIN'
    });
    Roles.create({
        roleName: 'GODOWN MANAGER'
    });
    Roles.create({
        roleName: 'DELIVERY BOY'
    });
    Roles.create({
        roleName: 'ACCOUNT MANAGER'
    });
    Roles.create({
        roleName: 'BILL GENERATION MANAGER'
    });
    Roles.create({
        roleName: 'CUSTOMER CARE'
    });
    Roles.create({
        roleName: 'GODOWN OPERATOR'
    });
};

module.exports = roles;