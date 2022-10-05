import Modul from "../model/ModulModel.js";
import Kelas from "../model/KelasModel.js";
import Materi_Text from "../model/Materi_TextModel.js";
import {Op} from "sequelize";
import {v4 as uuidv4} from "uuid";

export const getMateriText = async(req, res) => {
    try{
        let response;
        if(req.role === "Admin"){
            response = await Materi_Text.findAll({
                attributes : ['uuid','content'],
                include:{
                    model : Modul, 

                    attributes : ['name'],
                    include :{
                        model : Kelas,

                        attributes : ['name']
                    }
                }
            });
        }else if(req.role === "Mentor"){
            response = await Modul.findAll(
            {
                attributes : ['uuid','content'],
                where :{
                    kelasId : req.KelasId
                },
                include:{
                    model : Modul,

                    attributes : ['name'],
                    include :{
                        model : Kelas,

                        attributes : ['name'],
                        where : {
                            userId : req.userId
                        }
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
export const getMateriTextById = async(req, res) => {
    try{
        const materiText = await Materi_Text.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!materiText) return res.status(404).json({msg : "Data tidak ditemukan!!"});

        let response;
        if(req.role === "Admin"){
            response = await Materi_Text.findAll({
                attributes : ['uuid','content'],
                include:{
                    model : Modul, 

                    attributes : ['name'],
                    include :{
                        model : Kelas,

                        attributes : ['name']
                    }
                },
                where:{
                    id : materiText.id
                }
            });
        }else if(req.role === "Mentor"){
            response = await Materi_Text.findAll(
            {
                attributes : ['uuid','content'],
                where :{
                    kelasId : req.KelasId
                },
                include:{
                    model : Modul,

                    attributes : ['name'],
                    include :{
                        model : Kelas,

                        attributes : ['name'],
                        where : {
                            userId : req.userId
                        }
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

export const getMateriTextByModulId = async(req, res) => {
    try{
        const modul = await Modul.findOne({
            where:{
                uuid:req.params.id
            }
        });
        // console.log("sudah ini");
        if(!modul) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        
        let response;
        if(req.role === "Admin" || req.role === "Mentor"){
            response = await Materi_Text.findAll({
                attributes : ['uuid','content','modulId'],
                where:{
                    modulid: modul.id
                    
                },
                include:{
                    model : Modul,
                    attributes : ['name']
                }
            });
        }
        // else if(req.role === "Mentor"){
        //     response = await Modul.findAll({
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

export const createMateriText = async(req, res) => {
   
    const {content, modulId} = req.body;
    try{
        // console.log("1");
        if(req.role === "Admin" || req.role === "Mentor"){
            await Materi_Text.create({
                uuid : uuidv4(),
                content : content,
                modulId : modulId,
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
export const updateMateriText = async(req, res) => {
    try{
        const materiText = await Materi_Text.findOne({
            where:{
                uuid:req.params.id
            },
            include:{
                model : Modul, 
                attributes : ['name'],
                include : {
                    model : Kelas,
                    attributes : ['name'],
                    where :{
                        userId : req.userId
                    }
                }
            }
        });
        if(!materiText) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        const {content, modulId} = req.body;
        let response;
        if(req.role === "Admin"){
            await Materi_Text.update({content, modulId},{
                where:{
                    id:materiText.id
                }
            });
        }else{
            if(req.userId !== materiText.userId) return res.status(403).json({msg : "akses dilarang!!"});
            await Modul.update({content, modulId},{
                where :{
                    id: materiText.id
                },
                include:{
                    model : Kelas,
                    include : {
                        model : User,
                        where :{
                            id : req.userId
                        }
                    }
                }
            });
        }
        
        res.status(200).json({msg:"Modul berhasil diupdate"});
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}
export const deleteMateriText = async(req, res) => {
    try{
        const materiText = await Materi_Text.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!materiText) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        // const {name, desc, urutan} = req.body;
        // let response;
        if(req.role === "Admin"){
            await materiText.destroy({
                where:{
                    id:materiText.id
                }
            });
        }else{
            if(req.userId !== materiText.userId) return res.status(403).json({msg : "akses dilarang!!"});
            await materiText.destroy({
                where :{
                    id: materiText.id
                },
                include:{
                    model : Kelas,
                    include : {
                        model : User,
                        where :{
                            id : req.userId
                        }
                    }
                }
            });
        }
        
        res.status(200).json({msg:"Materi Text berhasil dihapus"});
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}