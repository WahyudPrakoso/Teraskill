import db  from '../config/database.js';
import User from "../model/UserModel.js";
import argon2 from "argon2";
import nodemailer from "nodemailer";
import crypto from "crypto";
import Sequelize from "sequelize";
// const sequelize = new 
// const argon2 = require('argon2');

export const getUser = async(req, res) => {
    try{
        const response = await User.findAll({
            attributes:['uuid','name','email','role']
        });
        res.status(200).json(response);
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}
export const getUserById = async(req, res) => {
    try{
        const response = await User.findOne({
            attributes : ['uuid','name','email','role'],
            where:{
                uuid:req.params.id
            }
        });
        res.status(200).json(response);
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}

var transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user: "teraskill.cs@gmail.com",
        pass: "jotojhbsidafedgx"
    },
    tls : {
        rejectUnauthorized : false
    }
});

export const createUser = async(req, res) =>{
    const {name, email, password, confpassword, no_hp} = req.body;
    if(password !== confpassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    const hashPassword = await argon2.hash(password);
    let verifyEmail = crypto.randomBytes(64).toString('hex');

    // let checkVerification = async(verificationCode) => {
    //    return await sequelize.query(`Select from user where verify_email = ${verificationCode}`); 
    // }
    // const getUser = await sequelize.query(`Select from user where verify_email = ${verifyEmail}`);
    // while(checkVerification){
    //     verifyEmail = crypto.randomBytes(64).toString('hex');
    //     console.log("muter");
    //     checkVerification(verifyEmail);
    // }

    try {
        await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: 'Member',
            no_hp : no_hp,
            is_verified : false,
            verify_email : verifyEmail
        });

        var mailOptions = {
            from : ` "Verify your email " <teraskill.cs@gmail.com> `,
            to : email,
            subject : 'Teraskill | Verify Your Email !',
            html : `<h2> ${name} ! Thanks for registering on our Site </h2>
                    <h4> please verify your email to continue .. </h4>
                    <a href="http://localhost:5000/user/verify-email?token=${verifyEmail}"> Verify your email here </a>`
        }

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
               console.log("Sending email verification failed!!");
            }
        });
        res.status(201).json({msg : "Verification email link is sent to your email"});
        // res.status(201).json({msg: "Register Berhasil"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const verifyEmail = async(req, res) => {
    try{
        const token = req.query.token;
        const user = await User.findOne({
            verify_email : token
        });
        if(user){
            await db.sequelize.query(`update user set is_verified = 1, verify_email = null where verify_email = '${token}'`,{
                raw : true,
                type : db.sequelize.QueryTypes.UPDATE
            });
            // await user.update({
            //     verify_email : null,
            //     is_verified : true
            // },{
            //     where :{ 
            //         verify_email : token
            //     }
            // });
            res.status(201).json({msg: "Email is verified !"});
        }
    }catch(error){
        console.log(error);
    }
}

export const updateAvatar = async(req, res) =>{
    try{
        const user = await User.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!user) return res.status(404).json({msg : "user tidak ditemukan"});
        const {avatar} = req.body;
        let hashPassword;
        
        try {
            await User.update({
                avatar : avatar
            },{
                where:{
                    id : user.id
                }
            });
            res.status(201).json({msg: "Avatar User Berhasil Diupload"});
        } catch (error) {
            res.status(400).json({msg: error.message});
        }
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}
export const updateUser = async(req, res) => {
    try{
        const user = await User.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!user) return res.status(404).json({msg : "user tidak ditemukan"});
        const {name, email, password, confpassword, role} = req.body;
        let hashPassword;
        if(password === '' || password === null){
            hashPassword = user.password;
        }
        else{
            hashPassword = await argon2.hash(password);
        }
        if(password !== confpassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
        try {
            await user.update({
                name: name,
                email: email,
                password: hashPassword,
                role: role
            },{
                where:{
                    id : user.id
                }
            });
            res.status(201).json({msg: "Update User Berhasil"});
        } catch (error) {
            res.status(400).json({msg: error.message});
        }
    }catch(error){
        res.status(500).json({msg : error.message});
    }
    
}
export const deleteUser = async(req, res) => {
    try{
        const user = await User.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!user) return res.status(404).json({msg : "user tidak ditemukan"});
        
        try {
            await user.destroy({
                where:{
                    id : user.id
                }
            });
            res.status(201).json({msg: "Delete User Berhasil"});
        } catch (error) {
            res.status(400).json({msg: error.message});
        }
    }catch(error){
        res.status(500).json({msg : error.message});
    }
} 