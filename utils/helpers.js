// middleware to check auth
const authCheck = (req, res, next) => {
    if (!req.user) {
        // if user is not loggin
        res.redirect('/');
    } else {
        next();
    }
};

module.exports = {
    authCheck: authCheck
};
