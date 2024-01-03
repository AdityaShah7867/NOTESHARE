const isEmailEdu = (email) => {
    const domain = email.split('@')[1];
    return domain === 'vcet.edu.in';
};



module.exports = isEmailEdu;
