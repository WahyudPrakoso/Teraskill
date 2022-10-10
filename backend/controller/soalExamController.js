import Kelas from "../model/KelasModel.js";
import SoalExam from "../model/SoalExamModel.js";
import {Op} from "sequelize";
import {v4 as uuidv4} from "uuid";

export const getSoalExam = async(req, res) => {
    try{
        let response;
        if(req.role === "Admin"){
            response = await SoalExam.findAll({
                attributes : ['uuid','soal'],
                include :{
                    model : Kelas,
                    attributes : ['name']
                }
            });
        }else if(req.role === "Mentor"){
            response = await SoalExam.findAll(
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
export const getSoalExamById = async(req, res) => {
    try{
        const soalExam = await SoalExam.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!soalExam) return res.status(404).json({msg : "Data tidak ditemukan!!"});

        let response;
        if(req.role === "Admin"){
            response = await SoalExam.findOne({
                attributes : ['uuid','soal'],
                include :{
                    model : Kelas,
                    attributes : ['name']
                },
                where:{
                    id : soalExam.id
                }
            });
        }else if(req.role === "Mentor"){
            response = await SoalExam.findAll(
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
                    id : soalExam.id
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

export const getSoalExamByKelasId = async(req, res) => {
    try{
        const kelas = await Kelas.findOne({
            where:{
                uuid:req.params.id
            }
        });
        // console.log("sudah ini");
        if(!kelas) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        
        let response;
        if(req.role === "Admin" || req.role === "Mentor"){
            response = await SoalExam.findAll({
                attributes : ['uuid','soal'],
                where:{
                    kelasid: kelas.id
                    
                },
                include:{
                    model : Kelas,
                    attributes : ['name']
                }
            });
        }
        // else if(req.role === "Mentor"){
        //     response = await SoalExam.findAll({
        //         attributes : ['uuid','name','desc','urutan'],
        //         where:{
        //             [Op.and] : [{kelasId: kelas.id}, {user_id : req.userId}]
        //         },
        //         include:{
        //             model : Kelas,
        //             attributes : ['name']
        //         }
        //     })
        // }
        else{
            res.status(403).json({msg :"akses dilarang!"});
        }
        res.status(200).json(response);
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}

export const createSoalExam = async(req, res) => {
   
    const {soal, kelasId} = req.body;
    // console.log(soal, kelasId);
    // console.log(req.role);
    try{
        // console.log("1");
        if(req.role === "Admin" || req.role === "Mentor"){
            await SoalExam.create({
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
export const updateSoalExam = async(req, res) => {
    try{
        const soalExam = await SoalExam.findOne({
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
        if(!soalExam) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        const {soal, kelasId} = req.body;
        let response;
        if(req.role === "Admin"){
            await SoalExam.update({soal, kelasId},{
                where:{
                    id:soalExam.id
                }
            });
        }else{
            if(req.userId !== soalExam.userId) return res.status(403).json({msg : "akses dilarang!!"});
            await SoalExam.update({soal, kelasId},{
                where :{
                    id: soalExam.id
                },
                include:{
                    model : Kelas,
                    attributes : ['name']
                }
            });
        }
        
        res.status(200).json({msg:"Soal berhasil diupdate"});
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}
export const deleteSoalExam = async(req, res) => {
    try{
        const soalExam = await SoalExam.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!soalExam) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        // const {name, desc, urutan} = req.body;
        // let response;
        if(req.role === "Admin" || req.role === "Mentor"){
            await SoalExam.destroy({
                where:{
                    id:soalExam.id
                }
            });
        }else{
            res.status(403).json({msg:"Akses dilarang!!"});
        }
        
        res.status(200).json({msg:"Soal berhasil dihapus"});
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}