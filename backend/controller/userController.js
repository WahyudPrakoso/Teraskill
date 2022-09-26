import User from "../model/UserModel.js";
import argon2 from "argon2";
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
export const createUser = async(req, res) =>{
    const {name, email, password, confpassword, role} = req.body;
    if(password !== confpassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    const hashPassword = await argon2.hash(password);
    try {
        await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        });
        res.status(201).json({msg: "Register Berhasil"});
    } catch (error) {
        res.status(400).json({msg: error.message});
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
            await User.update({
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
            await User.destroy({
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