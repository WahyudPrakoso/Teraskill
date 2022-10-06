import User from "../model/UserModel.js";
import UserAnswerProjek from "../model/UserAnswerProjekModel.js";
import {Op} from "sequelize";
import {v4 as uuidv4} from "uuid";
import SoalProjek from "../model/SoalProjekModel.js";

export const getUserAnswerProjek = async(req, res) => {
    try{
        let response;
        if(req.role === "Admin"){
            response = await UserAnswerProjek.findAll({
                attributes : ['uuid','jawaban'],
                include :{ // belum fix
                    model : SoalProjek,
                    attributes : ['name']
                }
            });
        }else if(req.role === "Mentor"){
            response = await UserAnswerProjek.findAll(
            {
                attributes : ['uuid','jawaban'],
                include :{
                    model : SoalProjek,
                    attributes : ['name'],
                    where : {
                        userId : req.userId
                    }
                }
            });
        }else{
            res.status(403).json({msg : "akses dilarang !!"});
        }
        res.status(200).json(response);
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}
export const getUserAnswerProjekById = async(req, res) => {
    try{
        const UserAnswerProjek = await UserAnswerProjek.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!UserAnswerProjek) return res.status(404).json({msg : "Data tidak ditemukan!!"});

        let response;
        if(req.role === "Admin"){
            response = await UserAnswerProjek.findOne({
                attributes : ['uuid','jawaban'],
                include :{
                    model : Kelas,
                    attributes : ['name']
                },
                where:{
                    id : UserAnswerProjek.id
                }
            });
        }else if(req.role === "Mentor"){
            response = await UserAnswerProjek.findAll(
            {
                attributes : ['uuid','jawaban'],
                include :{
                    model : Kelas,
                    attributes : ['name'],
                    where : {
                        userId : req.userId
                    }
                },
                where : {
                    id : UserAnswerProjek.id
                }
            });
        }else{
            res.status(403).json({msg : "akses dilarang !!"});
        }
        res.status(200).json(response);
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}

export const createUserAnswerProjek = async(req, res) => {
   
    const {jawaban, kelasId} = req.body;
    try{
        // console.log("1");
        if(req.role === "Admin" || req.role === "Mentor"){
            await Materi_Text.create({
                uuid : uuidv4(),
                jawaban : jawaban,
                kelasId : kelasId,
            });
            // console.log("wes");
            res.status(201).json({msg : "Data berhasil disimpan!!"})
        }else{
            // console.log("wes");
            res.status(403).json({msg : "Akses dilarang!!"})
        }
    }catch(error){
        error;
    }
}
export const updateUserAnswerProjek = async(req, res) => {
    try{
        const UserAnswerProjek = await UserAnswerProjek.findOne({
            where:{
                uuid:req.params.id
            },
            include : {
                model : Kelas,
                attributes : ['name'],
                where :{
                    userId : req.userId
                }
            }
        });
        if(!UserAnswerProjek) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        const {jawaban, kelasId} = req.body;
        let response;
        if(req.role === "Admin"){
            await Materi_Text.update({jawaban, kelasId},{
                where:{
                    id:UserAnswerProjek.id
                }
            });
        }else{
            if(req.userId !== UserAnswerProjek.userId) return res.status(403).json({msg : "akses dilarang!!"});
            await Modul.update({jawaban, kelasId},{
                where :{
                    id: UserAnswerProjek.id
                },
                include:{
                    model : Kelas,
                    attributes : ['name']
                }
            });
        }
        
        res.status(200).json({msg:"Modul berhasil diupdate"});
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}
export const deleteUserAnswerProjek = async(req, res) => {
    try{
        const UserAnswerProjek = await UserAnswerProjek.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!UserAnswerProjek) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        // const {name, desc, urutan} = req.body;
        // let response;
        if(req.role === "Admin" || req.role === "Mentor"){
            await UserAnswerProjek.destroy({
                where:{
                    id:UserAnswerProjek.id
                }
            });
        }else{
            res.status(403).json({msg:"Akses dilarang!!"});
        }
        
        res.status(200).json({msg:"Materi Text berhasil dihapus"});
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}