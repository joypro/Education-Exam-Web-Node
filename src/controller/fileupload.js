const express		    =	require('express');
const formidable        =   require('formidable');
const fs                =   require('fs');
const router 		    = 	express.Router();
const config            =   require('../config');
const util 				=	require('../utility/util');
const fileuploadUtil 	=	require('../utility/fileUploadUtil');
const multer            =   require('multer');
const AWS = require('aws-sdk');

const filePath          =    process.env.FILEPATH || config.FILEPATH;


const s3 = new AWS.S3({
    accessKeyId: config.ACCESS_KEY_ID,
    secretAccessKey:  config.SECRET_ACCESS_KEY,
    region:  config.REGION,
});

function uploadToS3(fileName,path, fileContent) {
    const s3Params = {
        Bucket: config.BUCKET,
        Key: config.DEFAULT_PATH + path+"/" + fileName,
        Body: fileContent,

    };

    s3.upload(s3Params, (err, data) => {
        if (err) {
            resolve({ status: 500, message: 'Error uploading to S3', response: null });
        }

    });
}


router.post('/v1/imageupload', async (req, res) => {
    const respData = await fileuploadUtil.uploadFile(req, 'image');
    res.json({success: respData.status === 200, status: respData.status, message: respData.message, response: respData.response});
});

router.post('/v1/fileupload', async (req, res) => {
    const respData = await fileuploadUtil.uploadFile(req, 'file');
    // console.log("================================",respData.response);
    res.json({success: respData.status === 200, status: respData.status, message: respData.message, response: respData.response});
});


var genFileName = (filename) =>{
    let splfile = filename.split(".");
    let ext = splfile.pop();
    let onlyfile = splfile.join('').replace(/[^a-zA-Z ]/g, "").replace(/ +/g,"_");
    return onlyfile+Date.now()+"."+ext;
}

var tmpFileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        if(String(month).length==1){
            month = "0"+month;
        }
        if(String(date).length==1){
            date = "0"+date;
        }
        let dir = '/temp/'+year+"/"+month+"/"+date+"/";
        if (!fs.existsSync(filePath+dir)){
            fs.mkdirSync(filePath+dir, { recursive: true , force: true});
        }
      cb(null, filePath+dir)
    },
    filename: function (req, file, cb) {
      cb(null, genFileName(file.originalname))
    }
});


var tmpFileUpload = multer({ storage: tmpFileStorage }).single('file');
router.post('/v1/tmpFileUpload', async (req, res) => {
    tmpFileUpload(req, res, async function(err) {
        let tmpDir = req.file.path.split('public_html');
        if(err) {
            res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
        } else {
            res.json({error : 0, message:"File Uploaded Success",data:{filename:req.file.filename,path:tmpDir[1],url:req.file.path,orgFileName:req.file.originalname}});
        }
    });   
});

// POC=>>
// var tmpFileUpload = multer({ storage: tmpFileStorage }).single('file');
// router.post('/v1/tmpFileUpload', async (req, res) => {
//     tmpFileUpload(req, res, async function(err) {
//         if(err) {
//             res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
//         } else {
//             // let resp = await model.insertProductFromFile(req.file);
//             // res.json(resp);
//             res.json({})
//         }
//     });
// });


var userFileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dir = '/files/';
      cb(null, filePath+dir)
    },
    filename: function (req, file, cb) {
      cb(null, genFileName(file.originalname))
    }
});


var userFileUpload = multer({ storage: userFileStorage }).single('file');
router.post('/v1/userFileUpload', async (req, res) => {
    console.log("======================1234>")
    userFileUpload(req, res, async function(err) {
        let tmpDir = req.file.path.split('public_html');
        if(err) {
            res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
        } else {
            let data = {
                'orgfilename' : req.file.filename,
                'fileName' :  tmpDir[1]
            };

            let getFilePath = req.file.path;
            const fileContent = fs.readFileSync(getFilePath);
            uploadToS3(data.orgfilename,"files",fileContent);

            res.json({success: true, message: 'File uploaded successfully', response: await util.encryptResponse(data)})
            // res.json({error : 0, message:"Success",data:{filename:req.file.filename,path:tmpDir[1],url:req.file.path}});
        }
    });   
});


module.exports = router;
