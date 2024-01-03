exports.constants = {
    VALIDATION_ERROR: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER: 500
}

const bcrypt = require('bcryptjs');
let pwd = '123';
async function hasFn() {
    return await bcrypt.hash(pwd, 10);
}

hasFn().then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
})
