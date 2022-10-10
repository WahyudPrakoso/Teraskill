import Modul from "../model/ModulModel.js";
import Kelas from "../model/KelasModel.js";
import Materi_Video from "../model/Materi_VideoModel.js";
import {Op} from "sequelize";
import {v4 as uuidv4} from "uuid";

export const getMateriVideo = async(req, res) => {
    try{
        let response;
        if(req.role === "Admin"){
            response = await Materi_Video.findAll({
                attributes : ['uuid','link'],
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
                attributes : ['uuid','link'],
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
export const getMateriVideoById = async(req, res) => {
    try{
        const materiVideo = await Materi_Video.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!materiVideo) return res.status(404).json({msg : "Data tidak ditemukan!!"});

        let response;
        if(req.role === "Admin"){
            response = await Materi_Video.findOne({
                attributes : ['uuid','link'],
                include:{
                    model : Modul, 

                    attributes : ['name'],
                    include :{
                        model : Kelas,

                        attributes : ['name']
                    }
                },
                where:{
                    id : materiVideo.id
                }
            });
        }else if(req.role === "Mentor"){
            response = await Materi_Video.findAll(
            {
                attributes : ['uuid','link'],
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

export const getMateriVideoByModulId = async(req, res) => {
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
            response = await Materi_Video.findAll({
                attributes : ['uuid','link','modulId'],
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
        //     response = await Materi_Video.findAll({
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

export const createMateriVideo = async(req, res) => {
   
    const {link, modulId} = req.body;
    try{
        // console.log("1");
        if(req.role === "Admin" || req.role === "Mentor"){
            await Materi_Video.create({
                uuid : uuidv4(),
                link : link,
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
export const updateMateriVideo = async(req, res) => {
    try{
        const materiVideo = await Materi_Video.findOne({
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
        if(!materiVideo) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        const {link, modulId} = req.body;
        let response;
        if(req.role === "Admin"){
            await Materi_Video.update({link, modulId},{
                where:{
                    id:materiVideo.id
                }
            });
        }else{
            if(req.userId !== materiVideo.userId) return res.status(403).json({msg : "akses dilarang!!"});
            await Modul.update({link, modulId},{
                where :{
                    id: materiVideo.id
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
export const deleteMateriVideo = async(req, res) => {
    try{
        const materiVideo = await Materi_Video.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!materiVideo) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        // const {name, desc, urutan} = req.body;
        // let response;
        if(req.role === "Admin"){
            await materiVideo.destroy({
                where:{
                    id:materiVideo.id
                }
            });
        }else{
            if(req.userId !== materiVideo.userId) return res.status(403).json({msg : "akses dilarang!!"});
            await materiVideo.destroy({
                where :{
                    id: materiVideo.id
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