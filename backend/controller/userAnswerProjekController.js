import User from "../model/UserModel.js";
import UserAnswerProjek from "../model/UserAnswerProjekModel.js";
import {Op} from "sequelize";
import {v4 as uuidv4} from "uuid";
import SoalProjek from "../model/SoalProjekModel.js";
import multer from "multer";
import path from "path";

export const getUserAnswerProjek = async(req, res) => {
    try{
        let response;
        if(req.role === "Admin"){
            response = await UserAnswerProjek.findAll({
                attributes : ['uuid','projek'],
                include :{ // belum fix
                    model : SoalProjek,
                    attributes : ['soal']
                }
            });
        }else if(req.role === "Mentor"){
            response = await UserAnswerProjek.findAll(
            {
                attributes : ['uuid','projek'],
                include :{
                    model : SoalProjek,
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
export const getUserAnswerProjekById = async(req, res) => {
    try{
        const userAnswerProjek = await UserAnswerProjek.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!userAnswerProjek) return res.status(404).json({msg : "Data tidak ditemukan!!"});

        let response;
        if(req.role === "Admin"){
            response = await UserAnswerProjek.findOne({
                attributes : ['uuid','projek'],
                include :{
                    model : SoalProjek,
                    attributes : ['soal']
                },
                where:{
                    id : userAnswerProjek.id
                }
            });
        }else if(req.role === "Mentor"){
            response = await UserAnswerProjek.findAll(
            {
                attributes : ['uuid','projek'],
                include :{
                    model : SoalProjek,
                    attributes : ['soal'],
                    where : {
                        userId : req.userId
                    }
                },
                where : {
                    id : userAnswerProjek.id
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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'document/userProjek/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname+'-'+uuidv4() + path.extname(file.originalname))
    }
});

export const uploadProjek = multer({
    storage : storage,
    limits : {
        fieldSize : '10000000' // 10mb
    },
    fileFilter : (req, file, cb) => {
        const fileTypes = /zip|rar|7z/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if(mimeType && extname) return cb(null, true);

        cb('Tipe file anda tidak diizinkan');
    }
// }).array('file', 2); //bisa 2 file
}).single('projek'); // satu file
// }).fields([{
//     name : 'surat_pernyataan',
//     maxCount : 1
// },{
//     name : 'portofolio',
//     maxCount : 1
// }])

export const createUserAnswerProjek = async(req, res) => {
   
    const {soalProjekId} = req.body;
    try{
        // console.log("1");
        if(req.file.filename === undefined || req.file.filename === ''){
            
            res.status(500).json({msg : "Upload file gagal!!"})
        }else{
            // console.log(req.file.filename, soalProjekId);
            await UserAnswerProjek.create({
                uuid : uuidv4(),
                userId : req.userId,
                projek : req.file.filename,
                soalProjekId : soalProjekId,
            });
            // console.log("wes");
            res.status(201).json({msg : "Data berhasil disimpan!!"});
        }
    }catch(error){
        error;
    }
}
export const updateUserAnswerProjek = async(req, res) => {
    try{
        const userAnswerProjek = await UserAnswerProjek.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!userAnswerProjek) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        // const {projek, soalProjekId} = req.body;
        let response;
        if(req.file.filename === undefined || req.file.filename === ''){
            res.status(500).json({msg:"Projek gagal diupload"});
        }else{
            // console.log(req.userId, userAnswerProjek.userId);
            if(req.userId !== userAnswerProjek.userId) return res.status(403).json({msg : "akses dilarang!!"});
            await UserAnswerProjek.update({
                projek : req.file.filename,
            },{
                where:{
                    id:userAnswerProjek.id
                }
            });
            res.status(200).json({msg:"Projek berhasil diupdate"});
        }
        
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}
export const deleteUserAnswerProjek = async(req, res) => {
    try{
        const userAnswerProjek = await UserAnswerProjek.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!userAnswerProjek) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        // const {name, desc, urutan} = req.body;
        // let response;
        if(req.userId === userAnswerProjek.userId){
            await UserAnswerProjek.destroy({
                where:{
                    id:userAnswerProjek.id
                }
            });
        }else{
            res.status(403).json({msg:"Akses dilarang!!"});
        }
        
        res.status(200).json({msg:"jabawan projek berhasil dihapus"});
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}