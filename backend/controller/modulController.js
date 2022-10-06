import Modul from "../model/ModulModel.js";
import Kelas from "../model/KelasModel.js";
import User from "../model/UserModel.js";
import {Op} from "sequelize";
import {v4 as uuidv4} from "uuid";

export const getModul = async(req, res) => {
    try{
        let response;
        if(req.role === "Admin"){
            response = await Modul.findAll({
                attributes : ['uuid','name','desc','urutan'],
                include:{
                    model : Kelas, 

                    attributes : ['name'],
                    include :{
                        model : User,

                        attributes : ['name']
                    }
                }
            });
        }else if(req.role === "Mentor"){
            response = await Modul.findAll(
            {
                attributes : ['uuid','name','desc','urutan'],
                include:{
                    model : Kelas,

                    attributes : ['name'],
                    include :{
                        model : User,

                        attributes : ['name'],
                        where : {
                            id : req.userId
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
export const getModulById = async(req, res) => {
    try{
        const modul = await Modul.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!modul) return res.status(404).json({msg : "Data tidak ditemukan!!"});

        let response;
        if(req.role === "Admin"){
            response = await Modul.findOne({
                attributes : ['uuid','name','desc','urutan'],
                where:{
                    id: modul.id
                },
                include:{
                    model : Kelas,
                    attributes : ['name'],
                    include : {
                        model : User,
                    
                        attributes : ['name'],
                    }
                }
            });
        }else if(req.role === "Mentor"){
            response = await Modul.findOne({
                attributes : ['uuid','name','desc','urutan'],
                where:{
                    id: modul.id
                },
                include:{
                    model : Kelas, 

                    attributes : ['name'],
                    include : {
                        model : User,

                        attributes : ['name'],
                        where :{
                            id : req.userId
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

export const getModulByKelasId = async(req, res) => {
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
            response = await Modul.findAll({
                attributes : ['uuid','name','desc','urutan'],
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
            res.status(403).json({msg :"akses dilarang!"});
        }
        res.status(200).json(response);
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}

export const createModul = async(req, res) => {
   
    const {name, desc, urutan, kelasId} = req.body;
    try{
        console.log("1");
        await Modul.create({
            uuid : uuidv4(),
            name : name,
            desc : desc,
            urutan : urutan,
            kelasId : kelasId,
        });
        console.log("wes");
        res.status(201).json({msg : "Data berhasil disimpan!!"})
    }catch(error){
        error;
    }
}
export const updateModul = async(req, res) => {
    try{
        const modul = await Modul.findOne({
            where:{
                uuid:req.params.id
            },
            include:{
                model : Kelas, 
                attributes : ['name'],
                include : {
                    model : User,
                    attributes : ['name'],
                    where :{
                        id : req.userId
                    }
                }
            }
        });
        if(!modul) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        const {name, desc, urutan, kelasId} = req.body;
        let response;
        if(req.role === "Admin"){
            await modul.update({name, desc, urutan, kelasId},{
                where:{
                    id:modul.id
                }
            });
        }else{
            if(req.userId !== modul.userId) return res.status(403).json({msg : "akses dilarang!!"});
            await Modul.update({name, desc, urutan, kelasId},{
                where :{
                    id: modul.id
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
export const deleteModul = async(req, res) => {
    try{
        const modul = await Modul.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!modul) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        // const {name, desc, urutan} = req.body;
        // let response;
        if(req.role === "Admin"){
            await Modul.destroy({
                where:{
                    id:modul.id
                }
            });
        }else{
            if(req.userId !== modul.userId) return res.status(403).json({msg : "akses dilarang!!"});
            await Modul.destroy({
                where :{
                    id: modul.id
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
        
        res.status(200).json({msg:"Modul berhasil dihapus"});
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}