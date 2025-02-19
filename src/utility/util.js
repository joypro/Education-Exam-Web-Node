const formidable            =   require('formidable');
const uniqid                =   require('uniqid');
const bcrypt 				=	require('bcrypt');
const nodemailer            =   require('nodemailer');
const config                =   require('../config');
const CryptoJS              =   require("crypto-js");
const crypto              =   require("crypto");
const axios                 =   require('axios');
const XLSX                  =   require('xlsx');
const token 				=   require('./token');
const jsPDF                 =   require("jspdf");
const autoTable             =   require('jspdf-autotable');
const fs                    =   require('fs');
const csvWriter = require('csv-writer');
const path              =   require('path');
const Converter = require("csv-converter-to-pdf-and-html");
const { Parser } = require('json2csv');
const { Transform } = require('stream');
const { sha3_256 } = require('js-sha3');
var sha1 = require('sha1');
const AWS = require('aws-sdk');
const superagent = require('superagent');

var GOOGLE_API              =    process.env.GOOGLE_API_KEY || config.GOOGLE_API_KEY;    
var API_URL                 =   process.env.API_BASE_URL || config.API_BASE_URL;
var EXPORT_FILECREATION_PATH        =   process.env.EXPORT_FILE_PATH || config.EXPORT_FILE_PATH;
var DOWNLOAD_FILE_URl                 =   process.env.DOWN_FILE_URl || config.DOWN_FILE_URl;
    
//creaion of transporter object using nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || config.SMTP_HOST,
    port: process.env.SMTP_PORT || config.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER || config.SMTP_USER,
        pass: process.env.SMTP_PWD || config.SMTP_PWD,
    },
});


// implement AWS S3 Bucket Credentials
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



//create generate uniqueid
let genUniqueId   =   async()=>{
    let qrString        =       uniqid();
    return qrString;
}

//create salt and encrypt password with salt
let generateHash = async(data)=>{
    let saltRound     =    process.env.SALTROUND || config.SALTROUND;
	var salt = bcrypt.genSaltSync(Number(saltRound));
	var hash = bcrypt.hashSync(data, salt);
	return hash;
}

//remove null value
let nullRemove 	=	async(data)=>{
	 try {
        let objKeys = Object.keys(data);
        for(let i=0;i< objKeys.length;i++){
            if(data[objKeys[i]]==null){
                data[objKeys[i]]="";
            }
        }
        return data
    } catch (err){
        return {}
    }
}


//match user input password and saved password for signin
let comparePass = async(inputPass,savedPass)=>{
    let compare = await bcrypt.compare( inputPass, savedPass);
    return compare;
}

//send sms to targeted user
let sendSms         =    async(data)=>{
    const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID || config.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN || config.TWILIO_AUTH_TOKEN);
    try{
       let res          =   await client.messages
      .create({
         body: 'Your verification code is '+data.otp,
         from: process.env.TWILIO_SENDER_PHONE || config.TWILIO_SENDER_PHONE,
         // from: '+18194604122',
         to: data.phone
       });

      return res.sid;
    }catch(error){
        return false;
    }
};

//mail sending function using nodemailer
// let sendMail        =    async(data)=>{
// let message         = "<p>Hi,</p><p></br></br> Your Verification code is <strong>";
//     message         +=    +data.otp+"</strong></p><p>Thanks & Regards<br>7CLINGO TEAM</p>";
//     try{
//         let mailsend =   await transporter.sendMail({
//             from: '"'+process.env.SENDER || config.SENDER+'" <'+process.env.SMTP_USER || config.SMTP_USER+'>', // sender address
//             to: data.toemail, // list of receivers
//             subject: process.env.SUBJECT || config.SUBJECT, // Subject line
//             text: message, // plain text body
//             html: message, // html body
//         })
//         return mailsend;
//     }catch(error){

//         return false;
//     }
// };
let sendMail        =    async(data)=>{
    let subject     =    process.env.SUBJECT || config.SUBJECT;
    if(data.subject && data.subject != ""){
        subject        =    data.subject;
    }
    try{

        let mailsend =   await transporter.sendMail({
            from: '"'+process.env.SENDER || config.SENDER+'" <'+process.env.SMTP_USER || config.SMTP_USER+'>', // sender address
            to: data.toemail, // list of receivers
            subject: subject, // Subject line
            text: data.message, // plain text body
            html: data.message, // html body
        })

        return true;
    }catch(error){

        return false;
    }
};

//4 digit random numerical otp generation
let generateOtp = async()=>{
    // let val = await Math.floor(1000 + Math.random() * 9000);
    // // let val     =   1234;
    // return val;
    let otp = crypto.randomInt(100000, 999999).toString();
    return otp
}



//capitalize first letter of any string
let capitalizeFirstLetter = async(string)=>{
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let createLog = (data)=>{
    if(process.env.EXECUTION_MODE == "prod" || config.EXECUTION_MODE == "prod"){
    	console.log(data)
        return true;
    }else{
        return true;
    }
}

let decryptPayload = async(data)=>{
    var bytes = await CryptoJS.AES.decrypt(data, process.env.CRYPTO_DECRYPT || config.CRYPTO_DECRYPT);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

let encryptPayload = async(data)=>{
    var ciphertext = await CryptoJS.AES.encrypt(JSON.stringify(data), process.env.CRYPTO_ENCRYPT || config.CRYPTO_ENCRYPT).toString();
    return ciphertext;
}

//for autocomplete suggestion of location
// 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+data.place+'&types=geocode&key='+GOOGLE_API
let getLocaionDescription= async(data)=>{
    var details         =    [];
    var config = {
      method: 'get',
      url: 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+data.place+'&key='+GOOGLE_API,
      headers: { }
    };
    try{
        let info = await axios(config);

        for(let i=0;i<info.data.predictions.length;i++){
            details.push({"description":info.data.predictions[i].description,"placeid":info.data.predictions[i].place_id})
        }
        return details;
    }catch(err){

        return false;
    }
};

//get co-ordinate from placeid
let getCoordinateFromPlaceId = async(data)=>{
    let coordinateurl      =    'https://maps.googleapis.com/maps/api/place/details/json?place_id='+data.placeid+'&fields=name,geometry&key='+GOOGLE_API;
    var details         =    [];
    var config = {
      method: 'get',
      url: coordinateurl,
      headers: { }
    };
    try{
        let info = await axios(config);
            details.push({"lat":info.data.result.geometry.location.lat,"lng":info.data.result.geometry.location.lng,"placename":info.data.result.name})
        return details;
    }catch(err){

        return false;
    }
};

let encryptResponse = async (data) => {
    // const token1 = await token.GetWebToken(data);
    // const response = await encryptPayload(token1);
    // return response;
    return data
}

//create csv file
let createExcelFile =async(data,file)=>{
    let reqTime     =    new Date().getTime();
    let filepath     =    "/var/www/html/qimages/7clingo/userdata/";
    let filename     =    "";
    if(file !=""){
        filename     =    file+"_"+reqTime+".xlsx";
    }else{
        filename     =    "userlist_"+reqTime+".xlsx";
    }
    var ws = XLSX.utils.json_to_sheet(data)
    var wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Responses')
    XLSX.writeFile(wb, filepath+filename)
    let fileUrl                =    "http://52.201.119.41/qimages/7clingo/userdata/"+filename;
    return fileUrl;
};

let replacer = async(someObj, replaceValue = "")=>{
  const replacer = (key, value) => 
    String(value) === "null" || String(value) === "undefined" || String(value) == ""  ? replaceValue : value;
  
  return JSON.stringify(someObj, replacer);
}

let getUserType = (typeId) => {
    return config.USER_TYPE[typeId];
}

let getCurrentTime = (flag = 0) => {
    const now     = new Date();
    let year    = now.getFullYear();
    let month   = now.getMonth()+1;
    let day     = now.getDate();
    let hour    = now.getHours();
    let minute  = now.getMinutes();
    let second  = now.getSeconds();
    if(month.toString().length === 1) {
        month = '0'+month;
    }
    if(day.toString().length === 1) {
        day = '0'+day;
    }
    if(hour.toString().length === 1) {
        hour = '0'+hour;
    }
    if(minute.toString().length === 1) {
        minute = '0'+minute;
    }
    if(second.toString().length === 1) {
        second = '0'+second;
    }
    if (flag === 0) {
        return year+'-'+month+'-'+day;
    } else {
        return year+'-'+month+'-'+day + ' ' + hour + ':' + minute + ':' + second;
    }
}


const statusCode = {
    SUCCESS: 200,
    NOTACCESSED:201,
    AUTH_ERR: 401,
    INTERNAL: 500,
    SOME_ERROR_OCCURRED: 500,
    LICENCED_EXCEED: 777,
    PARAM_MISSING: 1001,
    EMAIL_MISSING: 1002,
    MOBILE_MISSING: 1003,
    EMAIL_EXISTS: 1004,
    PHONE_EXISTS: 1004,
    NAME_EXISTS: 1004,
    USER_NOT_ADDED: 1007,
    USER_NOT_ADDED_IN_MAPPING: 1008
}



const Message = Object.freeze({
    SUCCESS: "Operation Successfull",
    NOTACCESSED:"Page not found",
    AUTH_ERR: "Un-authorized access",
    INTERNAL: "Internal server error",
    SOME_ERROR_OCCURRED: 'Some error occurred',
    PARAM_MISSING: "Parameter missing",
});


/////////call api using http module

let apicall = async(data,path) =>{
    try{
        let apiPath     =   API_URL + path
        let auth    =   'Bearer ' +data.token
        var config = {
            headers: { 
                "Authorization": auth
                 }
        };
        var apiRes = await axios.post(apiPath , data, config)
        // .then(res => {

        //     return res.response;
        // })

        return apiRes.data.response;
        // let resp = await axios(config)
        // return true;
    }catch(e){
        return 0;
        console.log("error in api call using http module ===> ", e)
    }
}

let getKeys = (data)=>{
    return Object.keys(data)
}

let getData = (data,fileName)=>{
    try{
        var fileNameAndPath = EXPORT_FILECREATION_PATH + fileName
        var respFileUrl     =   DOWNLOAD_FILE_URl + fileName
        if(data.length>0){
            var doc = new jsPDF.jsPDF()
            let rawdataArr = []
            var headder = getKeys(data[0]);
            for(let i=0; i< data.length;i++){
                var singleArr = []
                for(let j=0; j<headder.length;j++){
                    singleArr.push(data[i][headder[j]])

                }
                rawdataArr.push(singleArr)
            }
            doc.autoTable({
              head: [headder],
              body: rawdataArr,
            })

            doc.save(fileNameAndPath)
            return {"message":"pdf created","success":true , "downloadUrl":respFileUrl} 
        }else{
            return {"message":"Empty Data Set", "success":false, "downloadUrl":""}
        }
    }catch(e){
        return {"message":"Empty Data Set", "success":false , "downloadUrl":""}
    }
}

let createPdf = async(data,filename)=>{
    try{

        var myObject = []
        if(data === ""){
            myObject = [
              {
                "id": 0,
                "name": "Adam Carter",
                "work": "Unilogic",
                "email": "adam.carter@unilogic.com",
                "dob": "1978",
                "address": "83 Warner Street",
                "city": "Boston",
                "optedin": true
              },
              {
                "id": 1,
                "name": "Leanne Brier",
                "work": "Connic",
                "email": "leanne.brier@connic.org",
                "dob": "1987",
                "address": "9 Coleman Avenue",
                "city": "Toronto",
                "optedin": false
              },
              {
                "id": 0,
                "name": "Adam Carter",
                "work": "Unilogic",
                "email": "adam.carter@unilogic.com",
                "dob": "1978",
                "address": "83 Warner Street",
                "city": "Boston",
                "optedin": true
              },
              {
                "id": 1,
                "name": "Leanne Brier",
                "work": "Connic",
                "email": "leanne.brier@connic.org",
                "dob": "1987",
                "address": "9 Coleman Avenue",
                "city": "Toronto",
                "optedin": false
              }
            ]
         }else{
            myObject = data;
         }
        var pdfRes = getData(myObject,filename)
        if(pdfRes.success){
            return {success: true, status: 200, message: '', response: await util.encryptResponse({"resp": pdfRes.downloadUrl})}
        }else{
            return {success: false, status: 200, message: '', response: []}
        }
    }catch(e){
        return {success: false, status: 500, message: 'Some error occurred', response: null}
    }
}

let saveCsvFile = (req , uploadedPath) => {
    return new Promise((resolve, reject) => {
        const form = formidable({multiples: true, uploadDir: uploadedPath});
        let filePath = '';
        form.on('file', function(field, file) {
            //rename the incoming file to the file's name
            let fileName = file.name;
            filePath = form.uploadDir + "/" + file.name;
            const fileContent = fs.readFileSync(filePath);

            const s3Params = {
                    Bucket: config.BUCKET,
                    Key:  config.DEFAULT_PATH + fileName,
                    Body: fileContent,
                    ContentType: file.type,
            };

            s3.upload(s3Params,(err,data)=>{
                    if(err){
                        resolve({ status: 500, message: 'Error uploading to S3', response: null });
                    }else{

                        fs.rename(file.path, form.uploadDir + "/" + file.name, (err) => {
                            console.log('file error >> ', err);
                        });
                    }
                });

            // fs.rename(file.path, form.uploadDir + "/" + file.name, (err) => {
            //     console.log('file error >> ', err);
            // });
        });
        form.parse(req, (err, fields, files) => {
            const data = fields;
            data['path'] = filePath;
            data['success'] = true;
            resolve(data);
        });
    });
}

let getCurrentDate = async()=>{
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

    // prints date & time in YYYY-MM-DD format
    let res = (year + "-" + month + "-" + date);
    return res;
}
let formatDate = async (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}


let generateCsv = async(data)=>{
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);

    const now = Date.now();
    let date_ob = await getCurrentDate();
    let fileArr = date_ob.split('-');
    let dir = 'temp/'+fileArr[0]+"/"+fileArr[1]+"/"+fileArr[2];
    let fileName = now+"_file.csv";
    // if (!fs.existsSync(config.FILEPATH+dir)){
    //     fs.mkdirSync(config.FILEPATH+dir, { recursive: true , force: true});
    // }
    // fs.writeFileSync(config.FILEPATH+"/"+dir+"/"+fileName, csv);
    fs.writeFileSync(config.FILEPATH+"/temp/"+fileName, csv);
    // fs.writeFileSync(config.SFAFILEPATH+"/temp/"+fileName, csv);

    let CRMFilePath = config.FILEPATH+"/temp/"+fileName

    const CRMFileContent = fs.readFileSync(CRMFilePath);

    uploadToS3(fileName,"temp",CRMFileContent);

    return {dir:'temp/', file:fileName};
}


let generatePdf = async(data)=>{
    const converter = new Converter();
    let csvdata = await generateCsv(data);
    if(csvdata!==false){
        let filePath = path.resolve(config.FILEPATH+csvdata.dir,csvdata.file);
        const fileName = path.basename(filePath); 
        const now = Date.now();
        const destinationPath = path.resolve(config.FILEPATH+csvdata.dir+"/"+now);
        converter.PDFConverter(filePath, destinationPath);

        let getFilePath = config.FILEPATH+csvdata.dir+"/"+now;
        const fileContent = fs.readFileSync(getFilePath);
        uploadToS3(fileName,csvdata.dir,fileContent);
        
        return {dir:csvdata.dir, file:now+".pdf"};
    } else {
        return false;
    }
}

//create excel file
let generateExcel =async(data)=>{

        const now = Date.now();
        let date_ob = await getCurrentDate();
        let fileArr = date_ob.split('-');
        let dir = '/temp/'+fileArr[0]+"/"+fileArr[1]+"/"+fileArr[2];
        let fileName = now+"_file.xlsx";
        // if (!fs.existsSync(config.FILEPATH+dir)){
        //     fs.mkdirSync(config.FILEPATH+dir, { recursive: true , force: true});
        // }
        var ws = XLSX.utils.json_to_sheet(data)
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Responses');
        // XLSX.writeFile(wb, (config.FILEPATH + "/" + dir + "/" + fileName));
        XLSX.writeFile(wb, (config.FILEPATH + "/temp/" + fileName));
        // XLSX.writeFile(wb, (config.SFAFILEPATH + "/temp/" + fileName));


        let CRMFilePath = config.FILEPATH + "/temp/" + fileName;
        
        const CRMFileContent = fs.readFileSync(CRMFilePath);
 
        uploadToS3(fileName,"temp",CRMFileContent);
        
        // let fileUrl                =    "http://52.201.119.41/qimages/7clingo/userdata/"+filename;
        // return fileUrl;
        return fileName;
    // } else {
    //    return false;
    // }
};

let generateExcel_v2 =async(data)=>{
    try {
        const now = Date.now();
        let date_ob = await getCurrentDate();
        let fileArr = date_ob.split('-');
        let dir = '/temp/'+fileArr[0]+"/"+fileArr[1]+"/"+fileArr[2];
        let fileName = now+"_file.xlsx";
        // if (!fs.existsSync(config.FILEPATH+dir)){
        //     fs.mkdirSync(config.FILEPATH+dir, { recursive: true , force: true});
        // }
        var ws = XLSX.utils.json_to_sheet(data)
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Responses');
        // XLSX.writeFile(wb, (config.FILEPATH + "/" + dir + "/" + fileName));
        XLSX.writeFile(wb, (config.FILEPATH + "/temp/" + fileName));
        // XLSX.writeFile(wb, (config.SFAFILEPATH + "/temp/" + fileName));
        console.log("++++++++++++++++++++++++++")
        console.log(fileName)
        console.log("++++++++++++++++++++++++++")

        let CRMFilePath = config.FILEPATH + "/temp/" + fileName;

        const CRMFileContent = fs.readFileSync(CRMFilePath);

        uploadToS3(fileName,"temp",CRMFileContent);

        return fileName;
    } catch(e) {
        console.log('>>>>>>>>>>>>>>>>.' , e);
    }
};



//get location from lat and lng
let getLocationNameFromLatLng = async(lat,lng)=>{
    let coordinateurl      =    'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key='+GOOGLE_API;
    var details         =    [];
    var config = {
      method: 'get',
      url: coordinateurl,
      headers: { }
    };
    try{
        let info = await axios(config);

    if(info.data.status==="OK"){
        if(info.data.results.length>0){
                return info.data.results[0].formatted_address;
        } else {
             return false;
        }
    } else {
          return false;
    }
           
    }catch(err){

        return false;
    }
};


//get location distance from lat and lng
let getLocationDistanceFromLatLng = async(lat1,lng1, lat2, lng2)=>{
    let coordinateurl      =    'https://maps.googleapis.com/maps/api/distancematrix/json?origins='+lat1+','+lng1+'&destinations='+lat2+','+lng2+'&units=imperial&key='+GOOGLE_API;
    var details         =    [];
    var config = {
      method: 'get',
      url: coordinateurl,
      headers: { }
    };
    try{
        let info = await axios(config);

    if(info.data.status==="OK"){
        if(info.data.rows.length>0){
                return info.data.rows[0].elements[0].distance.text;
        } else {
             return false;
        }
    } else {
          return false;
    }
           
    }catch(err){

        return false;
    }
};


let getAlocatedZones = async (allZones, assignedZones)=>{
    try{
        let finalZoneArray = [];
        for(let i = 0; i < assignedZones.length; i++){
            if(allZones.includes(assignedZones[i])){
                finalZoneArray.push(assignedZones[i]);
            }
        }
        return finalZoneArray;
    }catch(e){
        return [];
    }
}

const groupBy = async (xs, key) => {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
};

const groupConcatByKey = async (result, key) => {
    let i = 0;
    for (let id in result) {
      const group = result[id];
      if (group.length > 1) {
        const allValueNames = group.flatMap(obj => obj[key].split(', '));
        const uniqueValueNames = [...new Set(allValueNames)];
        group[0][key] = uniqueValueNames.join(', ');
        group.splice(1);
      }
      if(i == (Object.keys(result).length - 1)) {
        return [].concat(...Object.values(result));
      }
      i++;
    }
}

//get location distance from lat and lng
let getLocationDistanceFromLatLngWithUnit = async(lat1, lon1, lat2, lon2)=>{

    try{
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers

        return distance;
       
    }catch(err){

        return false;
    }
};




/**
 * @author : Prosenjit Paul
 * @date : 26/06/2023
 * @description : excel file header
 * @argument : 
 * @returns
 */
let currentDateFormat= async()=>{
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}${month}${year}`
    return formattedDate

}


let generateHeaderExcel =async(data, moduleName)=>{
    try {
        const now = Date.now();
        // let date_ob = await getCurrentDate();
        let date_ob = await currentDateFormat();
        let fileArr = date_ob.split('-');
        let dir = '/temp/'+fileArr[0]+"/"+fileArr[1]+"/"+fileArr[2];
        // let fileName = now+"_file.xlsx";
        let fileName = moduleName+"_"+date_ob+".xlsx";
        var ws =  XLSX.utils.aoa_to_sheet([data]);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Responses');
        // XLSX.writeFile(wb, (config.FILEPATH + "/" + dir + "/" + fileName));
        XLSX.writeFile(wb, (config.FILEPATH + "/temp/" + fileName));
        // XLSX.writeFile(wb, (config.SFAFILEPATH + "/temp/" + fileName));


        let CRMFilePath = config.FILEPATH + "/temp/" + fileName

        const CRMFileContent = fs.readFileSync(CRMFilePath);

        uploadToS3(fileName,"temp",CRMFileContent);


        console.log("++++++++++++++++++++++++++")
        console.log(fileName)
        console.log("++++++++++++++++++++++++++")
        return fileName;
    } catch(e) {
        console.log('>>>>>>>>>>>>>>>>.' , e);
    }
};

const createAndAppendExcel = async (data, existingFilePath = "") => {
    try {
        let wb;
        if (existingFilePath !='') {
            const existingWorkbook = XLSX.readFile(config.FILEPATH + "/temp/" +existingFilePath);
            wb = existingWorkbook;
        } else {
            wb = XLSX.utils.book_new();
        }

        const wsName = 'Responses';
        let ws = wb.Sheets[wsName];

        if (!ws) {
            ws = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, wsName);
        } else {
            const existingData = XLSX.utils.sheet_to_json(ws);
            const newData = [...existingData, ...data];
            ws = XLSX.utils.json_to_sheet(newData);
            wb.Sheets[wsName] = ws;
        }

        let fileName;
        if (existingFilePath != "") {
            fileName = existingFilePath;
        } else {
            const now = Date.now();
            fileName = `${now}_file.xlsx`;
        }
        XLSX.writeFile(wb, config.FILEPATH + "/temp/" + fileName);

        let FILEPATH = config.FILEPATH + "/temp/" + fileName;

        const SFAFileContent = fs.readFileSync(FILEPATH);

        uploadToS3(fileName,"temp",SFAFileContent);


        return fileName;
    } catch (e) {
        console.log('Excel Error:', e);
    }
};	
const generateStreamCsv = async (data) => {
    let date_ob = await getCurrentDate();
    let fileArr = date_ob.split('-');
    let dir = 'temp/' + fileArr[0] + "/" + fileArr[1] + "/" + fileArr[2];
    const now = Date.now()
    let fileName = now + "_file.csv";


    return new Promise((resolve, reject) => {

        const transformStream = new Transform({
            writableObjectMode: true,
            transform(chunk, encoding, callback) {
                // const csvRow = Object.values(chunk).join(',') + '\n';
                const csvRow = Object.values(chunk).map(value => {
                    // If the value contains spaces, enclose it in double quotes
                    if (typeof value === 'string' && (value.includes(' ')|| value.includes(','))) {
                        return `"${value}"`;
                    } else {
                        return value;
                    }
                }).join(',') + '\n';

                this.push(csvRow);
                callback();
            }
        });

        const writeStream = fs.createWriteStream(config.FILEPATH + "/temp/" + fileName);

        let FILEPATH = config.FILEPATH + "/temp/" + fileName;

        const SFAFileContent = fs.readFileSync(FILEPATH);

        uploadToS3(fileName,"temp",SFAFileContent);


        writeStream.on('error', reject);
        writeStream.on('finish', () => resolve(fileName));

        transformStream.pipe(writeStream);
        // const header = Object.keys(data[0]).join(',') + '\n';
        const header = Object.keys(data[0]).map(key => {
            // If the header contains spaces, enclose it in double quotes
            if (key.includes(' ')) {
                return `"${key}"`;
            } else {
                return key;
            }
        }).join(',') + '\n';

        writeStream.write(header);

        data.forEach(chunk => transformStream.write(chunk));
        transformStream.end();
    });
}

const generateStreamExcel = async (data) => {
    
    const now = Date.now()
    let fileName = now + "_file.xlsx";
    return new Promise((resolve, reject) => {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Add worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Create write stream
        const writeStream = fs.createWriteStream(config.FILEPATH + "/temp/" + fileName);

        let CRMFilePath = config.FILEPATH + "/temp/" + fileName ;
        const CRMFileContent = fs.readFileSync(CRMFilePath);
        uploadToS3(fileName,"temp",CRMFileContent);

        writeStream.on('error', reject);
        writeStream.on('finish', () => resolve(fileName));

        // Write the workbook to the stream
        XLSX.stream.to_csv(workbook.Sheets.Sheet1).pipe(writeStream);
    });
}

const oldPasswordHash = (psw)=>{
    if(psw === undefined){
        return '';
    }else{
        return sha1(psw);
    }
}

 const passwordHash = (psw)=>{
    if(psw === undefined || psw == null){
        return '';
    }else{
        return sha3_256(psw);
    }
 }

const chkOldNewPsw =(newpsw,psw)=>{
    let flag = false;
    if(passwordHash(psw) == newpsw){
        flag= true;
    }else if(oldPasswordHash(psw)== oldpsw){
        flag = true
    }
    return flag
}

let getAddressLatLong = async(address)=>{
    let coordinateurl      =    'https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key='+GOOGLE_API;
    var details         =    [];
    var config = {
      method: 'get',
      url: coordinateurl,
      headers: { }
    };
    try{
        let info = await axios(config);
        if(info.data.status == 'ZERO_RESULTS'){
            createLog("failed to fetch latitude and longitude ");
            return false;
        }else{
            details.push({"lat":info.data.results[0].geometry.location.lat,"lng":info.data.results[0].geometry.location.lng});
            return details;
        }
    }catch(err){
        return false;
    }
}

const fileExists = async (bucketName, filePath) => {
    try {
      await s3.headObject({ Bucket: bucketName, Key: filePath }).promise();
      console.log("File exists:", filePath);
      return true;
    } catch (error) {
      if (error.code === 'NotFound') {
        console.log("File does not exist:", filePath);
        return false;
      } else {
        console.error("Error checking file existence:", error);
        throw error;
      }
    }
  };

  let callPostMethodBySuperagent = async (apiurl, params) => {
    try {
        const response = await superagent.post(apiurl).send(params);
        return JSON.parse(response.text)
    } catch (err) {
        throw err
    }
}

let sendEmail_V1 = async (data) => {
      
    var mailOptions = {
        from: '"CLIKY Admin" <'+process.env.SMTP_USER || config.SMTP_USER+'>',
        to: data.toemail,
        subject: data.subject, 
        html: data.message,
        text: data.message, // plain text body
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          return false;
        } else {
          console.log('Email sent: ' + info.response);
          return true;
        }
      });
}


let generateHeaderExcelModified = async (data, moduleName, reqObj) => {
    try {
        // const now = Date.now();
        // let date_ob = await currentDateFormat();
        let date_ob = '';

        if (reqObj.currentDateTime === undefined || reqObj.currentDateTime == "" || reqObj.currentDateTime == null) {

            date_ob = new Date();

        } else {
            date_ob = new Date(reqObj.currentDateTime)
        }


        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        let currentDateTime = date + month + year + hours + minutes + seconds;

        // let fileArr = date_ob.split('-');
        // let dir = '/temp/'+fileArr[0]+"/"+fileArr[1]+"/"+fileArr[2];
        // let fileName = now+"_file.xlsx";
        let fileName = moduleName + "_" + currentDateTime + ".xlsx";
        var ws = XLSX.utils.aoa_to_sheet([data]);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Responses');
        // XLSX.writeFile(wb, (config.FILEPATH + "/" + dir + "/" + fileName));
        XLSX.writeFile(wb, (config.FILEPATH + "/temp/" + fileName));
        // XLSX.writeFile(wb, (config.SFAFILEPATH + "/temp/" + fileName));


        let CRMFilePath = config.FILEPATH + "/temp/" + fileName

        const CRMFileContent = fs.readFileSync(CRMFilePath);

        uploadToS3(fileName, "temp", CRMFileContent);

        console.log("++++++++++++++++++++++++++")
        console.log(fileName)
        console.log("++++++++++++++++++++++++++")
        return fileName;
    } catch (e) {
        console.log('>>>>>>>>>>>>>>>>.', e);
    }
};



let setCurrentDateTime = async (data) => {

    try{
        if (data.currentDateTime === undefined || data.currentDateTime == "" || data.currentDateTime == null) {
            currentDate = new Date();
        } else {
            currentDate = new Date(data.currentDateTime)
        }

        let currentYear = currentDate.getFullYear();
        let currentMonth = ("0" + (currentDate.getMonth() + 1)).slice(-2);
        let day = ("0" + currentDate.getDate()).slice(-2);

        let timeHours = ("0" + currentDate.getHours()).slice(-2);
        let timeMinutes = ("0" + currentDate.getMinutes()).slice(-2);
        let seconds = ("0" + currentDate.getSeconds()).slice(-2);

        data.currentDateTime = currentYear + '-' + currentMonth + '-' + day + ' ' + timeHours + ':' + timeMinutes + ':' + seconds;
        data.currentDate = currentYear + '-' + currentMonth + '-' + day;
        return data
    }catch (e) {
        createLog(e)
        return data
    }
};



let formatDateTime = async (dateValue, type = 0) => {

    try{
        if (dateValue === undefined || dateValue == "" || dateValue == null) {
            currentDate = new Date();
        } else {
            currentDate = new Date(dateValue)
        }

        let currentYear = currentDate.getFullYear();
        let currentMonth = ("0" + (currentDate.getMonth() + 1)).slice(-2);
        let day = ("0" + currentDate.getDate()).slice(-2);

        let timeHours = ("0" + currentDate.getHours()).slice(-2);
        let timeMinutes = ("0" + currentDate.getMinutes()).slice(-2);
        let seconds = ("0" + currentDate.getSeconds()).slice(-2);

        if(type == 0){
            return currentYear + '-' + currentMonth + '-' + day + ' ' + timeHours + ':' + timeMinutes + ':' + seconds;
        }else{
            return currentYear + '-' + currentMonth + '-' + day;
        }
    }catch (e) {
        createLog(e)
        return null
    }
};



// Function to send an email
let sendEmail = async (MAIL_CONFIG = { TO: [], CC: [], BCC: [], SUBJECT: "INFO: Support E-mail", BODY: "This is an auto-generated mail for testing purpose.", ATTACHMENTS: [] }) => {
    try {
        // Validate MAIL_CONFIG is an object
        if (!MAIL_CONFIG || typeof MAIL_CONFIG !== "object") {
            throw new Error("MAIL_CONFIG should be a non-empty object.");
        }

        // Check mandatory fields
        if (!MAIL_CONFIG.TO || !MAIL_CONFIG.SUBJECT || !MAIL_CONFIG.BODY) {
            throw new Error("Missing required fields: TO, SUBJECT, or BODY.");
        }

        // Ensure fields are arrays
        const TO = Array.isArray(MAIL_CONFIG.TO) ? MAIL_CONFIG.TO : [MAIL_CONFIG.TO];
        const CC = Array.isArray(MAIL_CONFIG.CC) ? MAIL_CONFIG.CC : [];
        const BCC = Array.isArray(MAIL_CONFIG.BCC) ? MAIL_CONFIG.BCC : [];
        const ATTACHMENTS = Array.isArray(MAIL_CONFIG.ATTACHMENTS) ? MAIL_CONFIG.ATTACHMENTS : [];

        // Validate emails
        const validTO = TO.filter(email => config.VALID_EMAIL_REGEX.test(email));
        const validCC = CC.filter(email => config.VALID_EMAIL_REGEX.test(email));
        const validBCC = BCC.filter(email => config.VALID_EMAIL_REGEX.test(email));

        if (validTO.length === 0) {
            throw new Error("At least one valid recipient (TO) is required.");
        }

        console.log("Creating Email Configuration...");

        // Nodemailer transporter (Use environment variables for credentials)


        // const transporter = nodemailer.createTransport({
        //     service: "gmail", // You can change to another provider
        //     auth: {
        //         user: process.env.SMTP_EMAIL_ID, // Your email
        //         pass: process.env.SMTP_PASSWORD, // Your password
        //     },
        // });


        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: process.env.SMTP_HOST || config.SMTP_HOST,
            port: process.env.SMTP_PORT || config.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER || config.SMTP_USER,
                pass: process.env.SMTP_PWD || config.SMTP_PWD,
            },
        });

        let mailOptions = {
            from: `"Support Team" <${process.env.SMTP_USER || config.SMTP_USER}>`, // Sender
            to: validTO.join(","), // Convert array to string
            cc: validCC.length > 0 ? validCC.join(",") : undefined,
            bcc: validBCC.length > 0 ? validBCC.join(",") : undefined,
            subject: MAIL_CONFIG.SUBJECT,
            html: MAIL_CONFIG.BODY, // Email body in HTML
            attachments: [],
        };

        // Process attachments
        if (ATTACHMENTS.length > 0) {
            ATTACHMENTS.forEach((filePath) => {
                if (fs.existsSync(filePath)) {
                    mailOptions.attachments.push({
                        filename: path.basename(filePath),
                        path: filePath,
                    });
                    console.log(`Attached: ${filePath}`);
                } else {
                    console.log(`Invalid Attachment Path: ${filePath}`);
                }
            });
        } else {
            console.log("No Attachments Provided.");
        }

        let info = await transporter.sendMail(mailOptions);
        console.log("Email Sent Successfully:", info.messageId);
        return true;

    } catch (error) {
        console.error("Error Sending Email:", error.message);
        return false;
    }
}



module.exports = {
	generateStreamExcel: generateStreamExcel,
    generateStreamCsv: generateStreamCsv,
	createAndAppendExcel: createAndAppendExcel,
	genUniqueId:genUniqueId,
	generateHash:generateHash,
	nullRemove:nullRemove,
    comparePass:comparePass,
    capitalizeFirstLetter:capitalizeFirstLetter,
    sendSms:sendSms,
    sendMail:sendMail,
    generateOtp:generateOtp,
    createLog:createLog,
    decryptPayload:decryptPayload,
    encryptPayload:encryptPayload,
    getLocaionDescription:getLocaionDescription,
    getCoordinateFromPlaceId:getCoordinateFromPlaceId,
    createExcelFile:createExcelFile,
    replacer:replacer,
    encryptResponse: encryptResponse,
    getUserType: getUserType,
    getCurrentTime: getCurrentTime,
    statusCode: statusCode,
    apicall:apicall,
    createPdf:createPdf,
    saveCsvFile: saveCsvFile,
    generateCsv:generateCsv,
    generatePdf:generatePdf,
    generateExcel:generateExcel,
    formatDate:formatDate,
    generateExcel_v2:generateExcel_v2,
    generateHeaderExcel:generateHeaderExcel,
    getLocationNameFromLatLng:getLocationNameFromLatLng,
    getLocationDistanceFromLatLng:getLocationDistanceFromLatLng,
    getAlocatedZones : getAlocatedZones,
    groupBy: groupBy,
    groupConcatByKey: groupConcatByKey,
    getLocationDistanceFromLatLngWithUnit: getLocationDistanceFromLatLngWithUnit,
    passwordHash:passwordHash,
    oldPasswordHash : oldPasswordHash,
    chkOldNewPsw :chkOldNewPsw,
    getAddressLatLong :getAddressLatLong,
    fileExists:fileExists,
    callPostMethodBySuperagent: callPostMethodBySuperagent,
    sendEmail: sendEmail,
    generateHeaderExcelModified:generateHeaderExcelModified,
    setCurrentDateTime:setCurrentDateTime,
    formatDateTime:formatDateTime,
    Message:Message,
}
