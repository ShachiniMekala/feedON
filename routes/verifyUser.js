const jwt=require('jsonwebtoken');

module.exports=(req,res,next)=>{
const token=req.header('auth-token');
if(!token) return res.status(400).send('First you have to log in')
try {
    const verified=jwt.verify(token,process.env.TOKEN_SECRET);
    req=verified;
    next();
} catch (error) {
    res.status(401).send('Invalid token');
}
}