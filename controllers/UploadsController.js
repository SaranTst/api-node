const multer = require('multer');
const apiResponse = require("../helpers/apiResponse");

var fs = require('fs')

const uploads = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/temp/')
        },
        filename: function (req, file, cb) {
            let uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            let extArr = file.originalname.split('.')
            let ext = extArr[extArr.length - 1]
            cb(null, uniqueSuffix + '.' + ext)
            // ในที่นี้ เราใช้ชื่อไฟล์เป็น id ของ user จากค่า session เช่น จะได้ค่าเป็น 10002.jpg
        }
    }),
    fileFilter: (req, file, cb) => {
        // ถ้าไม่ใช่ไฟล์รูปภาพ
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) { // ตรวจสอบชนิดไฟล์
            return cb(new Error('Images Only !!'), false)
        }
        cb(null, true) // ถ้าเป็นไฟล์รูปภาพ ผ่านเงื่อนไขการตรวจสอบประเภทไฟล์
    },
    limits: {
        fileSize: 2000000 // กำหนดขนาดไฟล์ไม่เกิน 2 MB = 2000000 bytes
    }
}).array('images', 2)


exports.uploadTempImages = [
    function (req, res) {
        uploads(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return apiResponse.ErrorResponse(res, err.message); // ไม่ผ่านเงื่อนไขการอัพโหลดไฟล์
            } else if (err) {
                return apiResponse.ErrorResponse(res, err.message); // ไม่ผ่านเงื่อนไขอื่นๆ 
            }
            return apiResponse.successResponseWithData(res, "Upload Success", req.files);
        })
    }
];

exports.moveFile = [
    function (req, res) {
        let oldPath = 'uploads/temp/' + req.params.nameimg
        let newPath = 'uploads/images/' + req.params.nameimg
        fs.rename(oldPath, newPath, function (err) {
            if (err) return apiResponse.ErrorResponse(res, err);
            return apiResponse.successResponse(res, "Remove Files Success");
        })
    }
];