import Product from "../model/ProductModel.js";
import User from "../model/UserModel.js";
import {Op} from "sequelize";

export const getProduct = async(req, res) => {
    try{
        let response;
        if(req.role === "Admin"){
            response = await Product.findAll({
                attributes : ['uuid','name','price'],
                include:{
                    model : User, 
                    attributes : ['name','email']
                }
            });
        }else{
            response = await Product.findAll(
            {
                attributes : ['uuid','name','price'],
                where :{
                    user_id : req.userId
                },
                include:{
                    model : User,
                    attributes : ['name','email']
                }
            });
        }
        
        res.status(200).json(response);
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}
export const getProductById = async(req, res) => {
    try{
        const product = await Product.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!product) return res.status(404).json({msg : "Data tidak ditemukan!!"});

        let response;
        if(req.role === "Admin"){
            response = await Product.findOne({
                attributes : ['uuid','name','price'],
                where:{
                    id: product.id
                },
                include:{
                    model : User, 
                    attributes : ['name','email']
                }
            });
        }else{
            response = await Product.findOne(
            {
                attributes : ['uuid','name','price'],
                where :{
                    [Op.and] : [{id: product.id}, {user_id : req.userId}]
                    
                },
                include:{
                    model : User,
                    attributes : ['name','email']
                }
            });
        }
        
        res.status(200).json(response);
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}
export const createProduct = async(req, res) => {
   
    const {name, price} = req.body;
    try{
        console.log("1");
        await Product.create({
            name : name,
            price : price,
            user_id : req.userId
        });
        console.log("wes");
        res.status(201).json({msg : "Data berhasil disimpan!!"})
    }catch(error){
        error.message;
    }
}
export const updateProduct = async(req, res) => {
    try{
        const product = await Product.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!product) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        const {name, price} = req.body;
        let response;
        if(req.role === "Admin"){
            await Product.update({name, price},{
                where:{
                    id:product.id
                }
            });
        }else{
            if(req.userId !== product.userId) return res.status(403).json({msg : "akses dilarang!!"});
            await Product.update({name, price},{
                where :{
                    [Op.and] : [{id: product.id}, {user_id : req.userId}]
                    
                },
            });
        }
        
        res.status(200).json({msg:"product berhasil diupdate"});
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}
export const deleteProduct = async(req, res) => {
    try{
        const product = await Product.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!product) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        const {name, price} = req.body;
        let response;
        if(req.role === "Admin"){
            await Product.destroy({
                where:{
                    id:product.id
                }
            });
        }else{
            if(req.userId !== product.userId) return res.status(403).json({msg : "akses dilarang!!"});
            await Product.destroy({
                where :{
                    [Op.and] : [{id: product.id}, {user_id : req.userId}]
                    
                },
            });
        }
        
        res.status(200).json({msg:"product berhasil dihapus"});
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}