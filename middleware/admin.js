function isAdmin(req, res, next){
    if(!req.user.isAdmin) return res.status(403).send('Access Denied...You dont have permissions!');
    next();
}
module.exports = isAdmin;