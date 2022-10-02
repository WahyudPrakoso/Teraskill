import LearningPath from "../model/LearningPathModel.js";
// import User from "../model/UserModel.js";
// import {Op} from "sequelize";
import multer from "multer";
import path from "path";
import {v4 as uuidv4} from "uuid";

export const getLearningPath = async(req, res) => {
    try{
        let response;
        if(req.role === "Admin"){
            response = await LearningPath.findAll({
                attributes : ['uuid','name','desc','image']
            });
        }
        res.status(200).json(response);
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}
export const getLearningPathById = async(req, res) => {
    try{
        const learningPath = await LearningPath.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!learningPath) return res.status(404).json({msg : "Data tidak ditemukan!!"});

        let response;
        if(req.role === "Admin"){
            response = await LearningPath.findOne({
                attributes : ['uuid','name','desc','image'],
                where:{
                    id: learningPath.id
                }
            });
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
        cb(null, file.fieldname+ "-"+ uuidv4() + path.extname(file.originalname))
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
}).single('image'); // satu file
// }).fields([{
//     name : 'surat_pernyataan',
//     maxCount : 1
// },{
//     name : 'portofolio',
//     maxCount : 1
// }])
export const createLearningPath = async(req, res) => {
    
    // console.log(req.file.filename);
    try{
        const {name, desc} = req.body;
        if(req.file.filename === undefined){
            if(req.role == "Admin"){
                await LearningPath.create({
                    uuid: uuidv4(),
                    name : name,
                    desc : desc
                });
                // console.log("wes");
                res.status(201).json({msg : "Data berhasil disimpan tanpa gambar!!"})
            }else{res.status(403).json({msg:"akses dilarang!!"})}
        }else{
            if(req.role == "Admin"){
                await LearningPath.create({
                    uuid: uuidv4(),
                    name : name,
                    desc : desc,
                    image : req.file.filename
                });
                // console.log("wes");
                res.status(201).json({msg : "Data berhasil disimpan!!"})
            }else{res.status(403).json({msg:"akses dilarang!!"})}
        }
        
    }catch(error){
        console.log(error.message);
    }
}

export const editLearningPath = async(req, res) => {
    try{
        const learningPath = await LearningPath.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!learningPath) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        // const status = true;
        // let response;
        const {name, desc} = req.body
        if(req.files.surat_pernyataan === undefined || req.files.portofolio === undefined){
            if(req.role == "Admin"){
                await learningPath.update({
                    name : name,
                    desc : desc
                },{
                    where:{
                        id:learningPath.id
                    }
                });
            }else{
                res.status(403).json({msg : "akses dilarang !!"});
            }
            res.status(200).json({msg:"Data berhasil disimpan tanpa gambar"});
            // res.status(404).json({msg : "file gagal diupload"});
        }else{
            let surat_pernyataan_filename = req.files.surat_pernyataan.map(function(file){
                return file.filename;
            });
            let portofolio_filename = req.files.portofolio.map(function(file){
                return file.filename;
            });
            if(req.role == "Admin"){
                await learningPath.update({
                    name : name,
                    desc : desc,
                    image : req.file.filename
                },{
                    where:{
                        id:learningPath.id
                    }
                });
                res.status(200).json({msg:"Data berhasil disimpan"});
            }else{res.status(403).json({msg:"akses dilarang!!"})}
        }
       
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}
export const deleteLearningPath = async(req, res) => {
    try{
        const learningPath = await LearningPath.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!learningPath) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        // const {name, price} = req.body;
        // let response;
        if(req.role === "Admin"){
            await learningPath.destroy({
                where:{
                    id:learningPath.id
                }
            });
            res.status(200).json({msg:"Pendaftaran Mentor berhasil dihapus"});
        }else{res.status(403).json({msg:"akses dilarang!!"})}
        
        
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}