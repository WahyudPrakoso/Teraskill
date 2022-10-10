import PendaftaranMentor from "../model/PendaftaranMentorModel.js";
import User from "../model/UserModel.js";
import {Op} from "sequelize";
import multer from "multer";
import path from "path";
import {v4 as uuidv4} from "uuid";

export const getPendaftaranMentor = async(req, res) => {
    try{
        let response;
        if(req.role === "Admin"){
            response = await PendaftaranMentor.findAll({
                attributes : ['uuid','surat_pernyataan','portofolio','status'],
                include:{
                    model : User, 
                    attributes : ['name','email']
                }
            });
        }else{
            response = await PendaftaranMentor.findAll(
            {
                attributes : ['uuid','surat_pernyataan','portofolio','status'],
                where :{
                    userId : req.userId
                },
                include:{
                    model : User,
                    attributes : ['name','email']
                }
            });
        }
        
        res.status(200).json(response);
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}
export const getPendaftaranMentorById = async(req, res) => {
    try{
        const PendaftaranMentor = await PendaftaranMentor.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!PendaftaranMentor) return res.status(404).json({msg : "Data tidak ditemukan!!"});

        let response;
        if(req.role === "Admin"){
            response = await PendaftaranMentor.findOne({
                attributes : ['uuid','name','price'],
                where:{
                    id: PendaftaranMentor.id
                },
                include:{
                    model : User, 
                    attributes : ['name','email']
                }
            });
        }else{
            response = await PendaftaranMentor.findOne(
            {
                attributes : ['uuid','name','price'],
                where :{
                    [Op.and] : [{id: PendaftaranMentor.id}, {user_id : req.userId}]
                    
                },
                include:{
                    model : User,
                    attributes : ['name','email']
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
        cb(null, 'document/fileLamaran')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname+ "-"+ uuidv4() + path.extname(file.originalname))
    }
});

export const uploadFile = multer({
    storage : storage,
    limits : {
        fieldSize : '2000000' // 2mb
    },
    fileFilter : (req, file, cb) => {
        const fileTypes = /pdf/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if(mimeType && extname) return cb(null, true)

        cb('Tipe file anda tidak diizinkan')
    }
// }).array('file', 2); //bisa 2 file
// }).single('file'); // satu file
}).fields([{
    name : 'surat_pernyataan',
    maxCount : 1
},{
    name : 'portofolio',
    maxCount : 1
}]);
export const createPendaftaranMentor = async(req, res) => {
   
    
    try{
        if(req.files.surat_pernyataan || req.files.portofolio){
            res.status(404).json({msg : "file gagal diupload"})
        }
        // Array.isArray(req.files)
        let surat_pernyataan_filename = req.files.surat_pernyataan.map(function(file){
            return file.filename;
        });
        let portofolio_filename = req.files.portofolio.map(function(file){
            return file.filename;
        });
        // console.log(surat_pernyataan_filename[0]);
        // console.log(portofolio_filename[0]);
        await PendaftaranMentor.create({
            uuid: uuidv4(),
            surat_pernyataan : surat_pernyataan_filename[0],
            portofolio : portofolio_filename[0],
            userId : req.userId,
            status : false
        });
        // console.log("wes");
        res.status(201).json({msg : "Data berhasil disimpan!!"})
    }catch(error){
        console.log(error.message);
    }
}

export const validasiPendaftaranMentor = async(req, res) => {
    try{
        const pendaftaranMentor = await PendaftaranMentor.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!pendaftaranMentor) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        // const status = true;
        // let response;
        if(req.role === "Admin"){
            await pendaftaranMentor.update({
                status : true
            },{
                where:{
                    id:pendaftaranMentor.id
                }
            });
        }
        
        res.status(200).json({msg:"Berhasil di validasi"});
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}
export const deletePendaftaranMentor = async(req, res) => {
    try{
        const pendaftaranMentor = await PendaftaranMentor.findOne({
            where:{
                uuid:req.params.id
            }
        });
        if(!pendaftaranMentor) return res.status(404).json({msg : "Data tidak ditemukan!!"});
        // const {name, price} = req.body;
        // let response;
        if(req.role === "Admin"){
            await pendaftaranMentor.destroy({
                where:{
                    id:pendaftaranMentor.id
                }
            });
        }
        
        res.status(200).json({msg:"Pendaftaran Mentor berhasil dihapus"});
    }catch(error){
        res.status(500).json({msg : error.message});
    }
}