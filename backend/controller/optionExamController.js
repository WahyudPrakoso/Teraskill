import OptionExam from "../model/OptionExamModel.js";
import SoalExam from "../model/SoalExamModel.js";
import {Op} from "sequelize";
import {v4 as uuidv4} from "uuid";
import Kelas from "../model/KelasModel.js";

export const getOptionExam = async(req, res) => {
    try{
        let response;
        if(req.role === "Admin"){
            response = await OptionExam.findAll({
                attributes : ['uuid','content','correct_answer'],
                include :{
                    model : SoalExam,
                    attributes : ['soal']
                }
            });
        }else if(req.role === "Mentor"){
            response = await OptionExam.findAll(
            {
                attributes : ['uuid','content','correct_answer'],
                include :{
                    model : SoalExam,
                    attributes : ['soal'],
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
export const getOptionExamById = async(req, res) => {
    try{
        const optionExam = await OptionExam.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!optionExam) return res.status(404).json({msg : "Data tidak ditemukan!!"});

        let response;
        if(req.role === "Admin"){
            response = await OptionExam.findOne({
                attributes : ['uuid','content','correct_answer'],
                include :{
                    model : SoalExam,
                    attributes : ['soal']
                },
                where:{
                    id : optionExam.id
                }
            });
        }else if(req.role === "Mentor"){
            response = await OptionExam.findAll(
            {
                attributes : ['uuid','content','correct_answer'],
                include :{
                    model : SoalExam,
                    attributes : ['soal'],
                    where : {
                        userId : req.userId
                    }
                },
                where : {
                    id : optionExam.id
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

export const getOptionExamBySoalExamId = async(req, res) => {
    try{
        const soalExam = await SoalExam.findOne({
            where:{
                uuid:req.params.id
            }
        });
        // console.log("sudah ini");
        if(!soalExam) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        
        let response;
        if(req.role === "Admin" || req.role === "Mentor"){
            response = await OptionExam.findAll({
                attributes : ['uuid','content','SoalExamId'],
                where:{
                    SoalExamid: soalExam.id
                    
                },
                include:{
                    model : SoalExam,
                    attributes : ['soal']
                }
            });
        }
        // else if(req.role === "Mentor"){
        //     response = await OptionExam.findAll({
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
            res.status(403).json({msg : "akses dilarang !!"});
        }
        res.status(200).json(response);
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}

export const createOptionExam = async(req, res) => {
   
    const {content, soalExamId, correct_answer} = req.body;
    console.log(content, correct_answer, soalExamId);
    console.log(req.role);
    try{
        // console.log("1");
        if(req.role === "Admin" || req.role === "Mentor"){
            await OptionExam.create({
                uuid : uuidv4(),
                content : content,
                soalExamId : soalExamId,
                correct_answer : correct_answer
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
export const updateOptionExam = async(req, res) => {
    try{
        const optionExam = await OptionExam.findOne({
            where:{
                uuid:req.params.id
            },
            include : {
                model : SoalExam,
                attributes : ['soal'],
                include :{
                    model : Kelas,
                    where : {
                        userId : req.userId
                    }
                }
            }
        });
        if(!optionExam) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        const {SoalExamId, content, correct_answer} = req.body;
        let response;
        if(req.role === "Admin"){
            await OptionExam.update({SoalExamId, content, correct_answer},{
                where:{
                    id:optionExam.id
                }
            });
        }else{
            if(req.userId !== optionExam.userId) return res.status(403).json({msg : "akses dilarang!!"});
            await OptionExam.update({SoalExamId, correct_answer},{
                where :{
                    id: optionExam.id
                },
                include:{
                    model : SoalExam,
                    attributes : ['soal']
                }
            });
        }
        
        res.status(200).json({msg:"Soal berhasil diupdate"});
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}
export const deleteOptionExam = async(req, res) => {
    try{
        const optionExam = await OptionExam.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!optionExam) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        // const {soal, desc, urutan} = req.body;
        // let response;
        if(req.role === "Admin" || req.role === "Mentor"){
            await OptionExam.destroy({
                where:{
                    id:optionExam.id
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