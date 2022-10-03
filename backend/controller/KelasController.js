import Kelas from "../model/KelasModel.js";
import User from "../model/UserModel.js";
import LearningPath from "../model/LearningPathModel.js";
import {Op} from "sequelize";
import multer from "multer";
import path from "path";
import {v4 as uuidv4} from "uuid";

export const getKelas = async(req, res) => {
    try{
        let response;
        if(req.role === "Admin"){
            response = await Kelas.findAll({
                attributes : ['uuid','name','about','image','image_bg','price','is_published','link_grub'],
                include:[
                    {
                        model : User,
                        attributes : ['name']
                    },{
                        model : LearningPath,
                        attributes : ['name']
                    }
                ]
            });
        }
        else if(req.role === "Mentor"){
            response = await Kelas.findAll({
                attributes :['uuid','name','about','image','image_bg','price','is_published','link_grub'],
                where :{
                    [Op.and] : [{id: product.id}, {userId : req.userId}]
                    
                },
                include:[
                    {
                        model : User,
                        attributes : ['name']
                    },{
                        model : LearningPath,
                        attributes : ['name']
                    }
                ]
            });
        }
        res.status(200).json(response);
    }
    catch(error){
        res.status(500).json({msg : error.message});
    }
}
export const getKelasById = async(req, res) => {
    try{
        const kelas = await Kelas.findOne({
            where:{
                uuid:req.params.id
            }
        });
        console.log("sudah ini");
        if(!kelas) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        
        let response;
        if(req.role === "Admin"){
            response = await Kelas.findOne({
                attributes : ['uuid','name','about','image','image_bg','price','is_published','link_grub'],
                where:{
                    id: kelas.id
                },
                include:[
                    {
                        model : User,
                        attributes : ['name']
                    },{
                        model : LearningPath,
                        attributes : ['name']
                    }
                ]
            });
        }else if(req.role === "Mentor"){
            response = await Kelas.findOne({
                attributes : ['uuid','name','about','image','image_bg','price','is_published','link_grub'],
                where :{
                    [Op.and] : [{id: product.id}, {userId : req.userId}]
                    
                },
                include:[
                    {
                        model : User,
                        attributes : ['name']
                    },{
                        model : LearningPath,
                        attributes : ['name']
                    }
                ]
            })
        }
        res.status(200).json(response);
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname+ "-kelas-"+ uuidv4() + path.extname(file.originalname))
    }
});

export const uploadImage = multer({
    storage : storage,
    limits : {
        fieldSize : '2000000' // 2mb
    },
    fileFilter : (req, file, cb) => {
        const fileTypes = /jpg|jpeg|png|gif|/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))
        
        if(mimeType && extname) return cb(null, true);
        
        cb('Tipe file anda tidak diizinkan');
    }
    // }).array('file', 2); //bisa 2 file
    // }).single('image'); // satu file
}).fields([{
    name : 'image',
    maxCount : 1
},{
    name : 'image_bg',
    maxCount : 1
}])
export const createKelas = async(req, res) => {
    
    try{
        const userId = req.userId;
        const {learningPathId, name, about, price, type, tools, link_grub} = req.body;
        if(req.files.image || req.files.image_bg){
            let image_filename = req.files.image.map(function(file){
                return file.filename;
            });
            let image_bg_filename = req.files.image_bg.map(function(file){
                return file.filename;
            });
            console.log(image_filename + " dan "+ image_bg_filename);
            console.log(learningPathId  + " dan "+ name+ " dan "+ type+ " dan "+price+ " dan "+about+ " dan "+tools);
            await Kelas.create({
                uuid: uuidv4(),
                learningPathId : learningPathId,
                userId : userId, 
                name : name,
                type : type,
                price : price,
                about : about,
                tools : tools,
                image : image_filename+'',
                image_bg : image_bg_filename+'',
                is_published : 0,
                jml_Materi_text : 0,
                jml__materi_video : 0,
                link_grub : link_grub
            });
            res.status(201).json({msg : "Data berhasil disimpan!!"})
            res.status(404).json({msg : "file gagal diupload"})
        }else{
            console.log("wes");
            await Kelas.create({
                uuid: uuidv4(),
                learningPathId : learningPathId,
                userId : userId, 
                name : name,
                type : type,
                price : price,
                about : about,
                tools : tools,
                is_published : false,
                jml_Materi_text : 0,
                jml__materi_video : 0
            });
            res.status(201).json({msg : "Data berhasil disimpan tanpa gambar!!"})
            // res.status(404).json({msg : "file gagal diupload"})
        }
    }catch(error){
        console.log(error.message);
    }
}

export const editKelas = async(req, res) => {
    try{
        const kelas = await Kelas.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!kelas) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        // const status = true;
        // let response;
        const userId = req.userId;
        const {learningPathId, name, about, price, type, tools} = req.body;
        if(req.files.image === undefined|| req.files.image_bg === undefined){
            if(req.role == "Admin" || req.role == "Mentor"){
                await Kelas.update({
                    learningPathId : learningPathId,
                    userId : userId, 
                    name : name,
                    type : type,
                    price : price,
                    about : about,
                    tools : tools
                },{
                    where:{
                        id:kelas.id
                    }
                });
                res.status(200).json({msg:"Data berhasil disimpan tanpa gambar"});
            }else{res.status(403).json({msg:"Akses dilarang"})};
        }else{
            if(req.role == "Admin" || req.role == "Mentor"){
                await Kelas.update({
                    learningPathId : learningPathId,
                    userId : userId, 
                    name : name,
                    type : type,
                    price : price,
                    about : about,
                    tools : tools,
                    image : image_filename,
                    image_bg : image_bg_filename,
                },{
                    where:{
                        id:kelas.id
                    }
                });
                res.status(200).json({msg:"Data berhasil disimpan"});
            }else{res.status(403).json({msg:"Akses dilarang"})};
        }
        
        
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}
export const deleteKelas = async(req, res) => {
    try{
        
        const kelas = await Kelas.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!Kelas) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        // const {name, price} = req.body;
        // let response;
        if(req.role === "Admin" || req.role == "Mentor"){
            await Kelas.destroy({
                where:{
                    id:kelas.id
                }
            });
        }
        
        res.status(200).json({msg:"Pendaftaran Mentor berhasil dihapus"});
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}