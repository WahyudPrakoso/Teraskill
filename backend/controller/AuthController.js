import User from "../model/UserModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const refreshToken = async(req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const user = await User.findAll({
            where : {
                refresh_Token: refreshToken
            }
        });
        if(!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const userId = user[0].id;
            const uuid = user[0].uuid;
            const name = user[0].name;
            const email = user[0].email;
            const role = user[0].role;
            const accessToken = jwt.sign({userId, uuid, name, email, role}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn : '15s'
            });
            res.json({accessToken});
        })
    }catch(error){
        console.log(error);
    }
}

export const login = async(req,res) => {
    // console.log(req.body);
    try{
        const user = await User.findOne({
            where : {
                email : req.body.email
            }
        });
        if(!user) return res.status(404).json({msg : "user tidak ditemukan!!"});
        const match = await argon2.verify(user.password, req.body.password);
        if(!match) return res.status(404).json({msg : "User tidak ketemu!!"});
        req.session.userId = user.uuid;
        const id = user.id;
        const uuid = user.uuid;
        const name = user.name;
        const email = user.email;
        const role = user.role;
        const accessToken = jwt.sign({id,uuid, name, email, role}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn : '20s'
        });
        const refreshToken = jwt.sign({id,uuid, name, email, role}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn : '1d'
        });

        await User.update({refresh_token : refreshToken},{
           where:{
            id : id
           }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
            // secure : true
        });
        res.status(200).json({accessToken});
    }catch(error){
        res.status(404).json({msg : "Data tidak ditemukan!"});
    }
    
}

export const Me = async(req, res) => {
    if(!req.session.userId){
        return res.status(404).json({msg : "Mohon login kedalam akun anda"});
    }
    const user = await User.findOne({
        attributes:['uuid','name','email','role'],
        where:{
            uuid : req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg : "tidak ada user yang ditemukan"});
    res.status(200).json(user);
}

export const logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await User.findAll({
        where : {
            refresh_token : refreshToken
        }
    });
    if(!user) return res.sendStatus(204);
    const id = user.id;
    await User.update({refreshToken: null},{
        where:{
            id : id
        }
    });
    res.clearCookie('refreshToken');
    req.session.destroy((err)=>{
        if(err) return res.status(400).json({msg : "tidak dapat logout hiya hiya"});
        res.status(200).json({msg : "anda telah logout"});
    })
}