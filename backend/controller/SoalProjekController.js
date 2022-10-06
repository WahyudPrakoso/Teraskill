import Kelas from "../model/KelasModel.js";
import SoalProjek from "../model/SoalProjekModel.js";
import {Op} from "sequelize";
import {v4 as uuidv4} from "uuid";

export const getSoalProjek = async(req, res) => {
    try{
        let response;
        if(req.role === "Admin"){
            response = await SoalProjek.findAll({
                attributes : ['uuid','soal'],
                include :{
                    model : Kelas,
                    attributes : ['name']
                }
            });
        }else if(req.role === "Mentor"){
            response = await SoalProjek.findAll(
            {
                attributes : ['uuid','soal'],
                include :{
                    model : Kelas,
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
export const getSoalProjekById = async(req, res) => {
    try{
        const soalProjek = await SoalProjek.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!soalProjek) return res.status(404).json({msg : "Data tidak ditemukan!!"});

        let response;
        if(req.role === "Admin"){
            response = await SoalProjek.findOne({
                attributes : ['uuid','soal'],
                include :{
                    model : Kelas,
                    attributes : ['name']
                },
                where:{
                    id : soalProjek.id
                }
            });
        }else if(req.role === "Mentor"){
            response = await SoalProjek.findAll(
            {
                attributes : ['uuid','soal'],
                include :{
                    model : Kelas,
                    attributes : ['name'],
                    where : {
                        userId : req.userId
                    }
                },
                where : {
                    id : soalProjek.id
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

export const createSoalProjek = async(req, res) => {
   
    const {soal, kelasId} = req.body;
    try{
        // console.log("1");
        if(req.role === "Admin" || req.role === "Mentor"){
            await Materi_Text.create({
                uuid : uuidv4(),
                soal : soal,
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
export const updateSoalProjek = async(req, res) => {
    try{
        const soalProjek = await SoalProjek.findOne({
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
        if(!soalProjek) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        const {soal, kelasId} = req.body;
        let response;
        if(req.role === "Admin"){
            await Materi_Text.update({soal, kelasId},{
                where:{
                    id:soalProjek.id
                }
            });
        }else{
            if(req.userId !== soalProjek.userId) return res.status(403).json({msg : "akses dilarang!!"});
            await Modul.update({soal, kelasId},{
                where :{
                    id: soalProjek.id
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
export const deleteSoalProjek = async(req, res) => {
    try{
        const soalProjek = await SoalProjek.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!soalProjek) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        // const {name, desc, urutan} = req.body;
        // let response;
        if(req.role === "Admin" || req.role === "Mentor"){
            await SoalProjek.destroy({
                where:{
                    id:soalProjek.id
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