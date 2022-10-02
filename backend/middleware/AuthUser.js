import User from "../model/UserModel.js";
import jwt from "jsonwebtoken";

// export const verifyToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if(token == null) return res.sendStatus(401).json({msg : "Token kosong!"});
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         if(err) return res.sendStatus(403).json({msg:"token expired!!"});
//         req.email = decoded.email;
//         next();
//     });

// }
export const verifyUser = async(req,res,next) => {
    if(!req.session.userId){
        return res.status(404).json({msg : "Mohon login kedalam akun anda"});
    }
    const user = await User.findOne({
        where:{
            uuid : req.session.userId
        }
    });
    
    // console.log("1");
    if(!user) return res.status(404).json({msg : "tidak ada user yang ditemukan"});
    // res.status(200).json(user); 

    // console.log("2");
    req.userId = user.id;
    req.role = user.role;
    // console.log(req.userId, req.role);
    next();
}

export const adminOnly = async(req,res,next) => {

    const user = await User.findOne({
        where:{
            uuid : req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg : "tidak ada user yang ditemukan"});
    if(user.role !== 'Admin') return res.status(403).json({msg:"akses dilarang!!"});
    next();
}