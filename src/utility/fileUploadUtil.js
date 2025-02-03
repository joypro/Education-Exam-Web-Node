const formidable        =   require('formidable');
const fs                =   require('fs');
const config            =   require('../config');
const util 				=	require('../utility/util');
const readXlsxFile      =   require('read-excel-file/node');
const { resolve } = require('dns');
const spawn = require("child_process").spawn;
const AWS = require('aws-sdk');
const filePath          =    process.env.FILEPATH || config.FILEPATH;


// const s3 = new AWS.S3({
//     accessKeyId: config.ACCESS_KEY_ID,
//     secretAccessKey:  config.SECRET_ACCESS_KEY,
//     region:  config.REGION,
// });

var genFileName = (filename) =>{
    let splfile = filename.split(".");
    let ext = splfile.pop();
    let onlyfile = splfile.join('').replace(/[^a-zA-Z ]/g, "").replace(" ","_").trim();
    return onlyfile+Date.now()+"."+ext;
}

// implement upload file with AWS S3 Bucket and local 01-03-2024

module.exports.uploadFile_S3 = async (req, type) => {
    return new Promise((resolve, reject) => {
        try {
            const allowedMimeTypes = ['image/jpeg', 'image/png','application/pdf','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
            const lastPath = type === 'image' ? '/images' : '/files';
            const form = formidable({multiples: true, uploadDir: filePath + lastPath});
            let filename = '';
            let orgfilename = '';

            form.on('fileBegin', function (field, file) {
                let splfile = file.originalFilename.split(".");
                let type = splfile.pop();
                if (type != 'jpeg' && type != 'JPEG' && type != 'JPG' && type != 'jpg' && type != 'png'&& type !== 'xlsx' && type !== 'xls' && type !== 'pdf') {

                    resolve({status: 500, message: 'Please Select a Valid file Type', response: null})  
                }
            });

            form.on('file', function(field, file) {

                orgfilename = file.originalFilename

                filename = genFileName(file.originalFilename);
                const fileContent = fs.readFileSync(file.filepath);

                const s3Params = {
                    Bucket: config.BUCKET,
                    Key:  config.DEFAULT_PATH+'images/' + filename,
                    Body: fileContent,
                    ContentType: file.type,
                };
                s3.upload(s3Params,(err,data)=>{
                    if(err){
                        resolve({ status: 500, message: 'Error uploading to S3', response: null });
                    }else{

                        fs.rename(file.filepath, form.uploadDir + "/" + filename, (err) => {
                        });

                    }
                });
            });

            form.parse(req, async (err, fields, files) => {
                
                const data = fields;

                data['fileName'] = lastPath + '/' + filename;
                data['orgfilename'] = orgfilename;
            
                if(filename !== '') {
                    const file = files.image === undefined ? files.file : files.image;
                    const fileType =file.mimetype;

                    if (!allowedMimeTypes.includes(fileType)) {

                        resolve({status: 500, message: 'Please Select a Valid File Type', response: null})

                    }else{
                        resolve({status: 200, message: 'File uploaded successfully', response: await util.encryptResponse(data)});
                    }
                } else {
                    resolve({status: 200, message: 'File uploaded successfully', response: await util.encryptResponse(data)});
                }
            });  
        } catch (e) {

            resolve({status: 500, message: 'Internal server error', response: null})
        }
    })
}


module.exports.uploadFile = async (req, type) => {
    return new Promise((resolve, reject) => {
        try {
            const lastPath = type === 'image' ? '/images' : '/files';
            const form = formidable({multiples: true, uploadDir: filePath + lastPath});
            let filename = '';
            let orgfilename = '';
            form.on('fileBegin', function (field, file) {
                let splfile = file.originalFilename.split(".");
                let type = splfile.pop();

                if (type != 'jpeg' && type != 'JPEG' && type != 'JPG' && type != 'jpg' && type != 'png' && type !== 'xlsx' && type !== 'xls' && type !== 'pdf') {
                    resolve({status: 500, message: 'Please Select a Valid file Type', response: null})  
                    fs.unlink(file.path);
                }
            });
            form.on('file', function(field, file) {
                //rename the incoming file to the file's name
                orgfilename = file.originalFilename
                filename = genFileName(file.originalFilename);
                fs.rename(file.filepath, form.uploadDir + "/" + filename, (err) => {

                });
            });
            form.parse(req, async (err, fields, files) => {
                const data = fields;

                data['fileName'] = lastPath + '/' + filename;
                data['orgfilename'] = orgfilename;
                if(filename !== '') {
                    const pythonProcess = spawn('python3',[config.BASEPATH + "/src/utility/fileValidation.py", filePath + lastPath + '/' + filename]);

                    pythonProcess.stdout.on('data', async (pyres) => {

                        if(pyres.toString().trim() !== '1') {
                            resolve({status: 500, message: 'Please Select a Valid File Type', response: null})
                        } else {

                            resolve({status: 200, message: 'File uploaded successfully', response: await util.encryptResponse(data)});
                        }
                    });
                    pythonProcess.stderr.on('data', (error) => {

                        resolve({status: 500, message: 'Please Select a Valid File Type', response: null})
                    });
                } else {
                    resolve({status: 200, message: 'File uploaded successfully', response: await util.encryptResponse(data)});
                }
            });  
        } catch (e) {

            resolve({status: 500, message: 'Internal server error', response: null})
        }
    })
}

module.exports.saveCsvFile = async (req) => {
    return new Promise((resolve, reject) => {
        const form = new formidable({multiples: true, uploadDir: config.UPLOADFILE});
        let filePath = '';
        form.on('file', function(field, file) {
            //rename the incoming file to the file's name
            filePath = form.uploadDir + "/" + file.name;
            fs.rename(file.path, form.uploadDir + "/" + file.name, (err) => {
                console.log('file error >> ', err);
            });
        });
        form.parse(req, (err, fields, files) => {

            const data = fields;
            data['path'] = filePath;
            data['success'] = true;
            resolve(data);
        });
    });
}

module.exports.readExcel = async (filePath) => {
    return new Promise((resolve, reject) => {
        try{
            const results = [];
            readXlsxFile(fs.createReadStream(filePath)).then((rows) => {
                for (const i in rows){  
                    if (Number(i) > 0) {
                        const data = {
                            recordNo : '',
                            taskName : rows[i][0],
                            taskCategory : 5,
                            assignTo : -1,
                            assignType : -1,
                            dueDate : rows[i][2],
                            priorityStatus : 3,
                            taskStage : 6,
                            organizationName : rows[i][5],
                            contactPersonName : rows[i][6],
                            contactPersonPhoneNumber : rows[i][7],
                            contactPersonEmail : rows[i][8],
                            description : rows[i][9]
                        };
                        results.push(data)
                    }
                    if (Number(i) == (rows.length - 1)) {
                        resolve(results)
                    }
                }
            })
        } catch(e) {
            resolve([])
        }
    });
}

module.exports.readExcel_Lead = async (filePath) => {
    return new Promise((resolve, reject) => {
        try {
            const results = [];
            readXlsxFile(fs.createReadStream(filePath)).then((rows) => {
                for (const i in rows) {
                    if (Number(i) > 0) {
                        const data = {
                            contactFirstName : rows[i][0],
                            contactLastName : rows[i][1],
                            contactPhoneNo : rows[i][2],
                            contactEmailId  : rows[i][3],
                            contactTitle : rows[i][4],
                            contactType : rows[i][5],
                            contactAddress : rows[i][6],
                            contactCountry : rows[i][7],
                            contactState : rows[i][8],
                            contactDist : rows[i][9],
                            contactZone : rows[i][10],
                            contactGeoLocation : rows[i][11],
                            contactLat : rows[i][12],
                            contactLong : rows[i][13],
                            contactDesc : rows[i][14],
                            organizationName : rows[i][15],
                            organizationOwnerName : rows[i][16],
                            orgnizationPhone : rows[i][17],
                            organizationEmail : rows[i][18],
                            orgnizationAddress : rows[i][19],
                            organizationCountry : rows[i][20],
                            organizationState : rows[i][21],
                            organizationCity : rows[i][22],
                            organizationZone : rows[i][23],
                            organizationGeoLocation : rows[i][24],
                            organizationLat : rows[i][25],
                            organizationLong : rows[i][26],
                            annualRevenue : rows[i][27],
                            numberOfEmployee : rows[i][28],
                            productGroup : rows[i][29],
                            productCategory : rows[i][30],
                            productName : rows[i][31],
                            productDescription : rows[i][32],
                        };
                        results.push(data)
                    }
                    if (Number(i) == (rows.length - 1)) {
                        resolve(results)
                    }
                }
            })
        } catch(e) {
            resolve([])
        }
    })
}
module.exports.readExcel_Contact = async (filePath) => {
    return new Promise((resolve, reject) => {
        try {
            const results = [];
            readXlsxFile(fs.createReadStream(filePath)).then((rows) => {
                for (const i in rows) {
                    if (Number(i) > 0) {
                        const data = {
                            contactFirstName : rows[i][0],
                            contactLastName : rows[i][1],
                            contactPhoneNo : rows[i][2],
                            contactEmailId  : rows[i][3],
                            contactTitle : rows[i][4],
                            contactType : rows[i][5],
                            contactAddress : rows[i][6],
                            contactCountry : rows[i][7],
                            contactState : rows[i][8],
                            contactDist : rows[i][9],
                            contactZone : rows[i][10],
                            contactGeoLocation : rows[i][11],
                            contactLat : rows[i][12],
                            contactLong : rows[i][13],
                            contactDesc : rows[i][14],
                            organizationName : rows[i][15],
                            organizationOwnerName : rows[i][16],
                            orgnizationPhone : rows[i][17],
                            organizationEmail : rows[i][18],
                            orgnizationAddress : rows[i][19],
                            organizationCountry : rows[i][20],
                            organizationState : rows[i][21],
                            organizationCity : rows[i][22],
                            organizationZone : rows[i][23],
                            organizationGeoLocation : rows[i][24],
                            organizationLat : rows[i][25],
                            organizationLong : rows[i][26],
                            annualRevenue : rows[i][27],
                            numberOfEmployee : rows[i][28],
                            productGroup : rows[i][29],
                            productCategory : rows[i][30],
                            productName : rows[i][31],
                            productDescription : rows[i][32],
                        };

                        results.push(data)
                    }
                    if (Number(i) == (rows.length - 1)) {
                        resolve(results)
                    }
                }
            })
        } catch(e) {
            resolve([])
        }
    })
}
module.exports.readExcel_Organization = async (filePath) => {
    return new Promise((resolve, reject) => {
        try {
            const results = [];
            readXlsxFile(fs.createReadStream(filePath)).then((rows) => {
                for (const i in rows) {
                    if (Number(i) > 0) {
                        const data = {
                            contactFirstName : rows[i][0],
                            contactLastName : rows[i][1],
                            contactPhoneNo : rows[i][2],
                            contactEmailId  : rows[i][3],
                            contactTitle : rows[i][4],
                            contactType : rows[i][5],
                            contactAddress : rows[i][6],
                            contactCountry : rows[i][7],
                            contactState : rows[i][8],
                            contactDist : rows[i][9],
                            contactZone : rows[i][10],
                            contactGeoLocation : rows[i][11],
                            contactLat : rows[i][12],
                            contactLong : rows[i][13],
                            contactDesc : rows[i][14],
                            organizationName : rows[i][15],
                            organizationOwnerName : rows[i][16],
                            orgnizationPhone : rows[i][17],
                            organizationEmail : rows[i][18],
                            orgnizationAddress : rows[i][19],
                            organizationCountry : rows[i][20],
                            organizationState : rows[i][21],
                            organizationCity : rows[i][22],
                            organizationZone : rows[i][23],
                            organizationGeoLocation : rows[i][24],
                            organizationLat : rows[i][25],
                            organizationLong : rows[i][26],
                            annualRevenue : rows[i][27],
                            numberOfEmployee : rows[i][28],
                            productGroup : rows[i][29],
                            productCategory : rows[i][30],
                            productName : rows[i][31],
                            productDescription : rows[i][32]
                        };
                        results.push(data)
                    }
                    if (Number(i) == (rows.length - 1)) {
                        resolve(results)
                    }
                }
            })
        } catch(e) {
            resolve([])
        }
    })
}
module.exports.readExcelForUserTarget = async (filePath) => {
    return new Promise((resolve, reject) => {
        try{
            const results = [];
            readXlsxFile(fs.createReadStream(filePath)).then((rows) => {
                for (const i in rows){  
                    // let targetDateData =  await util.forformatDate(rows[i][1])
                    if (Number(i) > 0) {
                        const data = {
                            erpCode : rows[i][0],
                            targetDate : rows[i][1],
                            targetVisitCount : rows[i][2],
                        };
                        results.push(data)
                    }
                    if (Number(i) == (rows.length - 1)) {
                        resolve(results)
                    }
                }
            })
        } catch(e) {
            resolve([])
        }
    });
}
module.exports.readExcelForSalesTarget = async (filePath) => {
    return new Promise((resolve, reject) => {
        try{
            const results = [];
            readXlsxFile(fs.createReadStream(filePath)).then((rows) => {
                for (const i in rows){  
                    // let targetDateData =  await util.forformatDate(rows[i][1])
                    if (Number(i) > 0) {
                        const data = {
                            erpCode : rows[i][0],
                            salesTargetValue : rows[i][2],
                            salesTargetDate : rows[i][1],
                        };
                        results.push(data)
                    }
                    if (Number(i) == (rows.length - 1)) {
                        resolve(results)
                    }
                }
            })
        } catch(e) {
            resolve([])
        }
    });
}
module.exports.readExcelForSalesAchive = async (filePath) => {
    return new Promise((resolve, reject) => {
        try{
            const results = [];
            readXlsxFile(fs.createReadStream(filePath)).then((rows) => {
                for (const i in rows){  
                    // let targetDateData =  await util.forformatDate(rows[i][1])
                    if (Number(i) > 0) {
                        const data = {
                            erpCode : rows[i][0],
                            salesDate : rows[i][1],
                            salesValue : rows[i][2],
                            
                        };
                        results.push(data)
                    }
                    if (Number(i) == (rows.length - 1)) {
                        resolve(results)
                    }
                }
            })
        } catch(e) {
            resolve([])
        }
    });
}
module.exports.readExcelForUserExpense = async (filePath) => {
    return new Promise((resolve, reject) => {
        try{
            const results = [];
            readXlsxFile(fs.createReadStream(filePath)).then((rows) => {
                for (const i in rows){  
                    // let targetDateData =  await util.forformatDate(rows[i][1])
                    if (Number(i) > 0) {
                        const data = {
                            erpCode : rows[i][0],
                            expenseDate : rows[i][1],
                            remark : rows[i][2],
                            expense : rows[i][3],
                        };
                        results.push(data)
                    }
                    if (Number(i) == (rows.length - 1)) {
                        resolve(results)
                    }
                }
            })
        } catch(e) {
            resolve([])
        }
    });
}


// ======================================== UNDER DEVELOPEMENT ===================================
module.exports.readExcel_addInternalEnquiry = async (filePath) => {
    return new Promise((resolve, reject) => {
        try {
            const results = [];
            readXlsxFile(fs.createReadStream(filePath)).then((rows) => {
                for (const i in rows) {
                    if (Number(i) > 0) {
                        const data = {
                            enquiryTypeName : rows[i][0],
                            enquirySourceName : rows[i][1],
                            ownerFirstName : rows[i][2],
                            ownerLastName : rows[i][3],
                            ownerPhone : rows[i][4],
                            ownerEmail : rows[i][5],
                            businessName : rows[i][6],
                            businessAddress : rows[i][7],
                            businessPhone : rows[i][8],
                            businessEmail : rows[i][9],
                            address : rows[i][10],
                            cityVillage : rows[i][11],
                            pincode : rows[i][12],
                            notes : rows[i][13],
                            countryName : rows[i][14],
                            stateName : rows[i][15],
                            cityName : rows[i][16],
                            zoneName : rows[i][17]
                        };

                        results.push(data)
                    }
                    if (Number(i) == (rows.length - 1)) {
                        resolve(results)
                    }
                }
            })
        } catch(e) {
            resolve([])
        }
    })
}
// ======================================== UNDER DEVELOPEMENT ===================================


// const folderExists = async (directoryPath) => {
//     try {

//         return fs.existsSync(directoryPath);

//     } catch (e) {

//         return 0;
//     }
// }

var folderExists = (directoryPath) =>{
    try {
        return fs.existsSync(directoryPath);

    } catch (e) {

        return false;
    }
}

var createFolder = (directoryPath) =>{
    try {

        fs.mkdir(directoryPath, { recursive: true }, (err) => {
            if (err) {
              console.error('Error creating folder:', err);
            } else {
              console.log('Folder created successfully.');
            }
        });

        return fs.existsSync(directoryPath);

    } catch (e) {

        return false;
    }
}

// const createFolder = async (directoryPath) => {
//     try {

//         fs.mkdir(filePath + directoryPath, (err) => {
//             if (err) {
//               console.error('Error creating folder:', err);
//             } else {

//             }
//         });

//         return fs.existsSync(directoryPath);

//     } catch (e) {

//         return 0;
//     }
// }

// upload file AWS S3 bucket and local path implement 01-03-2024

module.exports.uploadIconFile = async (req, type) => {
    return new Promise((resolve, reject) => {
        try {

            let lastPath0 = ''
            const allowedMimeTypes = ['image/jpeg', 'image/png'];
            const form = formidable({multiples: true, uploadDir: filePath + lastPath0});
            let filename = '';
            let rawfile = '';
            let orgfilename = '';

            form.on('fileBegin', function (field, file) {
                let splfile = file.originalFilename.split(".");
                let type = splfile.pop();

                if (type != 'png') {
                    resolve({status: 500, message: 'Please Select a Valid file Type', response: null})  
                    fs.unlink(file.path);
                }
            });


            form.on('file', function(field, file) {
                //rename the incoming file to the file's name
                rawfile = file;
                orgfilename = file.originalFilename
                filename = genFileName(file.originalFilename);
                const fileContent = fs.readFileSync(file.filepath);

                const s3Params = {
                    Bucket:  config.BUCKET,
                    Key: config.DEFAULT_PATH+'icons/' + filename,
                    Body: fileContent,
                    ContentType: file.type,
                };
                s3.upload(s3Params,(err,data)=>{
                    if(err){
                        resolve({ status: 500, message: 'Error uploading to S3', response: null });
                    }
                });
                // fs.rename(file.filepath, filePath + lastPath + "/" + filename, (err) => {

                // });
            });


            form.parse(req, async (err, fields, files) => {
                const data = fields;
                let userId = data.userId
                let clientId = data.clientId

                // lastPath = '/'+clientId+'/'+userId+'';
                let lastPath = '/clkIcons/'+clientId+'/'+userId+'';

                // let exists = folderExists(lastPath);
                let exists = fs.existsSync(filePath + lastPath);

                if (exists) {
                  console.log('Folder exists.');
                } else {
                   let createDir = createFolder(filePath + lastPath);

                }

                fs.rename(rawfile.filepath, filePath + lastPath + "/" + filename, (err) => {

                });

                data['fileName'] = lastPath + '/' + filename;
                data['orgfilename'] = orgfilename;
                if(filename !== '') {

                    const file = files.image === undefined ? files.file : files.image;
                    const fileType =file.mimetype;

                    if (!allowedMimeTypes.includes(fileType)) {

                        resolve({status: 500, message: 'Please Select a Valid File Type', response: null})

                    }else{
                        resolve({status: 200, message: 'Icon uploaded successfully', response: await util.encryptResponse(data)});
                    }
                } else {
                    resolve({status: 200, message: 'Icon uploaded successfully', response: await util.encryptResponse(data)});
                }
            });  
        } catch (e) {

            resolve({status: 500, message: 'Internal server error', response: null})
        }
    })
}


module.exports.uploadIconFile_prev = async (req, type) => {
    return new Promise((resolve, reject) => {
        try {

            let lastPath0 = ''

            const form = formidable({multiples: true, uploadDir: filePath + lastPath0});
            let filename = '';
            let rawfile = '';
            let orgfilename = '';

            form.on('fileBegin', function (field, file) {
                let splfile = file.originalFilename.split(".");
                let type = splfile.pop();

                if (type != 'png') {

                    resolve({status: 500, message: 'Please Select a Valid file Type', response: null})  
                    fs.unlink(file.path);
                }
            });


            form.on('file', function(field, file) {
                //rename the incoming file to the file's name
                rawfile = file;
                orgfilename = file.originalFilename
                filename = genFileName(file.originalFilename);

                // fs.rename(file.filepath, filePath + lastPath + "/" + filename, (err) => {

                // });
            });


            form.parse(req, async (err, fields, files) => {
                const data = fields;
                let userId = data.userId
                let clientId = data.clientId

                // lastPath = '/'+clientId+'/'+userId+'';
                let lastPath = '/clkIcons/'+clientId+'/'+userId+'';

                // let exists = folderExists(lastPath);
                let exists = fs.existsSync(filePath + lastPath);


                if (exists) {
                  console.log('Folder exists.');
                } else {
                   let createDir = createFolder(filePath + lastPath);

                }

                fs.rename(rawfile.filepath, filePath + lastPath + "/" + filename, (err) => {

                });

                data['fileName'] = lastPath + '/' + filename;
                data['orgfilename'] = orgfilename;
                if(filename !== '') {
                    const pythonProcess = spawn('python3',[config.BASEPATH + "/src/utility/fileValidation.py", filePath + lastPath + '/' + filename]);

                    pythonProcess.stdout.on('data', async (pyres) => {

                        if(pyres.toString().trim() !== '1') {

                            resolve({status: 500, message: 'Please Select a Valid File Type', response: null})
                        } else {

                            resolve({status: 200, message: 'Icon uploaded successfully', response: await util.encryptResponse(data)});
                        }
                    });
                    pythonProcess.stderr.on('data', (error) => {

                        resolve({status: 500, message: 'Please Select a Valid File Type', response: null})
                    });
                } else {
                    resolve({status: 200, message: 'Icon uploaded successfully', response: await util.encryptResponse(data)});
                }
            });  
        } catch (e) {

            resolve({status: 500, message: 'Internal server error', response: null})
        }
    })
}


/**
 * @author : Sourav Bhoumik
 * @date : 11/07/2023
 * @description : upload user target data
 * @argument : 
 * @returns
 */
// implement file upload in AWS S3 Bucket and local path 01-03-2024

module.exports.uploadUserTargetFile = async (req, type) => {
    return new Promise((resolve, reject) => {
        try {
            const allowedMimeTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
            const lastPath = type === 'image' ? '/images' : '/files';
            const form = formidable({multiples: true, uploadDir: filePath + lastPath});


            let lastPath0 = ''
            let filename = '';
            let rawfile = '';
            let orgfilename = '';

            form.on('fileBegin', function (field, file) {
                let splfile = file.originalFilename.split(".");

                let type = splfile.pop();

                if (type !== 'xlsx' && type !== 'xls') {

                    resolve({status: 500, message: 'Please Select a Valid file Type', response: null})  
                    fs.unlink(file.path);
                }
            });

            form.on('file', function(field, file) {
                //rename the incoming file to the file's name
                rawfile = file;
                orgfilename = file.originalFilename
                filename = genFileName(file.originalFilename);


                const fileContent = fs.readFileSync(file.filepath);

                const s3Params = {
                    Bucket:  config.BUCKET,
                    Key: config.DEFAULT_PATH+'files/' + filename,
                    Body: fileContent,
                    ContentType: file.type,
                };
                
                s3.upload(s3Params,(err,data)=>{
                    if(err){
                        resolve({ status: 500, message: 'Error uploading to S3', response: null });
                    }
                });
            });

            form.parse(req, async (err, fields, files) => {
                const data = fields;
                // let userId = data.userId
                // let clientId = data.clientId

                fs.rename(rawfile.filepath, filePath + lastPath + "/" + filename, (err) => {
                });

                data['fileName'] = lastPath + '/' + filename;
                data['orgfilename'] = orgfilename;
                if(filename !== '') {
                    const file = files.image === undefined ? files.file : files.image;
                    const fileType =file.mimetype;

                    if (!allowedMimeTypes.includes(fileType)) {

                        resolve({status: 500, message: 'Please Select a Valid File Type', response: null})

                    }else{
                        resolve({status: 200, message: 'File uploaded successfully', response: await util.encryptResponse(data)});
                    }
                } else {
                    resolve({status: 500, message: 'File uploaded successfully', response: await util.encryptResponse(data)});
                }
            });  
        } catch (e) {

            resolve({status: 500, message: 'Internal server error', response: null})
        }
    })
}


module.exports.uploadUserTargetFile_prev = async (req, type) => {
    return new Promise((resolve, reject) => {
        try {

            const lastPath = type === 'image' ? '/images' : '/files';
            const form = formidable({multiples: true, uploadDir: filePath + lastPath});

            let lastPath0 = ''
            let filename = '';
            let rawfile = '';
            let orgfilename = '';

            form.on('fileBegin', function (field, file) {
                let splfile = file.originalFilename.split(".");
                let type = splfile.pop();
                if (type !== 'xlsx' && type !== 'xls') {
                    resolve({status: 500, message: 'Please Select a Valid file Type', response: null})  
                    fs.unlink(file.path);
                }
            });


            form.on('file', function(field, file) {
                //rename the incoming file to the file's name
                rawfile = file;
                orgfilename = file.originalFilename
                filename = genFileName(file.originalFilename);
            });


            form.parse(req, async (err, fields, files) => {
                const data = fields;
                // let userId = data.userId
                // let clientId = data.clientId

                fs.rename(rawfile.filepath, filePath + lastPath + "/" + filename, (err) => {
                });


                data['fileName'] = lastPath + '/' + filename;
                data['orgfilename'] = orgfilename;
                if(filename !== '') {
                    const pythonProcess = spawn('python3',[config.BASEPATH + "/src/utility/fileValidation.py", filePath + lastPath + '/' + filename]);

                    pythonProcess.stdout.on('data', async (pyres) => {

                        if(pyres.toString().trim() !== '1') {

                            resolve({status: 500, message: 'Please Select a Valid File Type', response: null})
                        } else {

                            resolve({status: 200, message: 'File uploaded successfully', response: await util.encryptResponse(data)});
                        }
                    });
                    pythonProcess.stderr.on('data', (error) => {

                        resolve({status: 500, message: 'Please Select a Valid File Type', response: null})
                    });
                } else {
                    resolve({status: 200, message: 'File uploaded successfully', response: await util.encryptResponse(data)});
                }
            });  
        } catch (e) {

            resolve({status: 500, message: 'Internal server error', response: null})
        }
    })
}


/**
 * @author : Sourav Bhoumik
 * @date : 07/08/2023
 * @description : upload company's promotional banners
 * @argument : 
 * @returns
 */

// implement upload file upload AWS S3 Bucket and local path 01-03-2024


module.exports.uploadCompanyBanners = async (req, type) => {
    return new Promise((resolve, reject) => {
        try {
            const allowedMimeTypes = ['image/jpeg', 'image/png'];

            const lastPath = type === 'image' ? '/images' : '/files';
            const form = formidable({multiples: true, uploadDir: filePath + lastPath});

            let lastPath0 = ''
            let filename = '';
            let rawfile = '';
            let orgfilename = '';

            let rawFileArr = [];
            let finalSuccessFileArr = [];
            let finalErrorFileArr = [];

            form.on('fileBegin', function (field, file) {
                let splfile = file.originalFilename.split(".");
                let type = splfile.pop();
                if (type != 'jpeg' && type != 'JPEG' && type != 'JPG' && type != 'jpg' && type != 'png' ) {
                    resolve({status: 500, message: 'Please Select a Valid file Type', response: null})  
                    fs.unlink(file.path);
                }
            });


            form.on('file', function(field, file) {
                //rename the incoming file to the file's name
                rawfile = file;
                orgfilename = file.originalFilename
                filename = genFileName(file.originalFilename);

                rawFileArr.push({"rawfile":rawfile, "filename":filename, "orgfilename":orgfilename})
            });


            form.parse(req, async (err, fields, files) => {
                const data = fields;
                let userId = data.userId
                let clientId = data.clientId
                let currentDateTime = data.currentDateTime

                // let finalSuccessFileArr = []
                for(let img = 0; img < rawFileArr.length; img++){

                    const fileContent = fs.readFileSync(rawFileArr[img].rawfile.filepath);

                    let respData = {};
                    const s3Params = {
                        Bucket: config.BUCKET,
                        Key: config.DEFAULT_PATH+'banners/' + rawFileArr[img].filename,
                        Body: fileContent,
                        // ContentType: file.type,
                    };
                    s3.upload(s3Params,(err,data)=>{
                        if(err){
                            resolve({ status: 500, message: 'Error uploading to S3', response: null });
                        }
                    });


                    fs.rename(rawFileArr[img].rawfile.filepath, filePath + lastPath + "/" + rawFileArr[img].filename, (err) => {

                    });
            
                    data['fileName'] = lastPath + '/' + rawFileArr[img].filename;
                    data['orgfilename'] = rawFileArr[img].orgfilename;
                
                    if(rawFileArr[img].filename !== '') {

                        const fileType =rawFileArr[img].rawfile.mimetype

                        if (!allowedMimeTypes.includes(fileType)) {

                            resolve({status: 500, message: 'Please Select a Valid File Type', response: null})

                        }else{
                            resolve({status: 200, message: 'File uploaded successfully', response: await util.encryptResponse(data)});
                        }
                    } else {
                        // finalSuccessFileArr.push(lastPath + '/' + rawFileArr[img].filename);
                        finalSuccessFileArr.push({"fileName":lastPath + '/' + rawFileArr[img].filename, "orgfilename":rawFileArr[img].orgfilename, "userId":userId, "clientId":clientId, "currentDateTime":currentDateTime});

                        if(finalSuccessFileArr.length + finalErrorFileArr.length == rawFileArr.length){

                            resolve({status: 200, message: 'File uploaded successfully', response: {"success":finalSuccessFileArr, "error":finalErrorFileArr}});
                        }
                    }
                }
            });  
        } catch (e) {

            resolve({status: 500, message: 'Internal server error', response: null})
        }
    })
}

module.exports.uploadCompanyBanners_prev = async (req, type) => {
    return new Promise((resolve, reject) => {
        try {

            const lastPath = type === 'image' ? '/images' : '/files';
            const form = formidable({multiples: true, uploadDir: filePath + lastPath});

            let lastPath0 = ''
            let filename = '';
            let rawfile = '';
            let orgfilename = '';

            let rawFileArr = [];
            let finalSuccessFileArr = [];
            let finalErrorFileArr = [];

            form.on('fileBegin', function (field, file) {
                let splfile = file.originalFilename.split(".");
                let type = splfile.pop();

                if (type != 'jpeg' && type != 'JPEG' && type != 'JPG' && type != 'jpg' && type != 'png' ) {
                    resolve({status: 500, message: 'Please Select a Valid file Type', response: null})  
                    fs.unlink(file.path);
                }
            });


            form.on('file', function(field, file) {
                //rename the incoming file to the file's name
                rawfile = file;
                orgfilename = file.originalFilename
                filename = genFileName(file.originalFilename);

                rawFileArr.push({"rawfile":rawfile, "filename":filename, "orgfilename":orgfilename})
            });


            form.parse(req, async (err, fields, files) => {
                const data = fields;
                let userId = data.userId
                let clientId = data.clientId
                let currentDateTime = data.currentDateTime

                // let finalSuccessFileArr = []

                for(let img = 0; img < rawFileArr.length; img++){

                    let respData = {};

                    fs.rename(rawFileArr[img].rawfile.filepath, filePath + lastPath + "/" + rawFileArr[img].filename, (err) => {

                    });

                    data['fileName'] = lastPath + '/' + rawFileArr[img].filename;
                    data['orgfilename'] = rawFileArr[img].orgfilename;
                    if(rawFileArr[img].filename !== '') {

                        const pythonProcess = spawn('python3',[config.BASEPATH + "/src/utility/fileValidation.py", filePath + lastPath + '/' + rawFileArr[img].filename]);

                        pythonProcess.stdout.on('data', async (pyres) => {


                            if(pyres.toString().trim() !== '1') {

                                // finalErrorFileArr.push(lastPath + '/' + rawFileArr[img].filename);
                                finalErrorFileArr.push({"fileName":lastPath + '/' + rawFileArr[img].filename, "orgfilename":rawFileArr[img].orgfilename, "userId":userId, "clientId":clientId, "currentDateTime":currentDateTime});

                                if(finalSuccessFileArr.length + finalErrorFileArr.length == rawFileArr.length){

                                    resolve({status: 500, message: 'Please Select a Valid File Type', response: {"success":finalSuccessFileArr, "error":finalErrorFileArr}})
                                }
                            } else {


                                // finalSuccessFileArr.push(lastPath + '/' + rawFileArr[img].filename)
                                finalSuccessFileArr.push({"fileName":lastPath + '/' + rawFileArr[img].filename, "orgfilename":rawFileArr[img].orgfilename, "userId":userId, "clientId":clientId, "currentDateTime":currentDateTime})

                                if(finalSuccessFileArr.length + finalErrorFileArr.length == rawFileArr.length){

                                    resolve({status: 200, message: 'File uploaded successfully', response: {"success":finalSuccessFileArr, "error":finalErrorFileArr}});

                                }
                            }
                        });
                        pythonProcess.stderr.on('data', (error) => {

                            // finalErrorFileArr.push(lastPath + '/' + rawFileArr[img].filename);
                            finalErrorFileArr.push({"fileName":lastPath + '/' + rawFileArr[img].filename, "orgfilename":rawFileArr[img].orgfilename, "userId":userId, "clientId":clientId, "currentDateTime":currentDateTime});

                            if(finalSuccessFileArr.length + finalErrorFileArr.length == rawFileArr.length){

                                resolve({status: 500, message: 'Please Select a Valid File Type', response: {"success":finalSuccessFileArr, "error":finalErrorFileArr}})
                            }
                        });
                    } else {
                        // finalSuccessFileArr.push(lastPath + '/' + rawFileArr[img].filename);
                        finalSuccessFileArr.push({"fileName":lastPath + '/' + rawFileArr[img].filename, "orgfilename":rawFileArr[img].orgfilename, "userId":userId, "clientId":clientId, "currentDateTime":currentDateTime});

                        if(finalSuccessFileArr.length + finalErrorFileArr.length == rawFileArr.length){

                            resolve({status: 200, message: 'File uploaded successfully', response: {"success":finalSuccessFileArr, "error":finalErrorFileArr}});
                        }
                    }
                }
            });  
        } catch (e) {

            resolve({status: 500, message: 'Internal server error', response: null})
        }
    })
}



/**
 * @author : Sourav Bhoumik
 * @date : 10/04/2024
 * @description : upload csv for cliky magic analytics
 * @argument : 
 * @returns
 */
// implement file upload in AWS S3 Bucket and local path 01-03-2024

var genFileNameClikyMgic = (filename) =>{
    let splfile = filename.split(".");
    let ext = splfile.pop();
    let onlyfile = splfile.join('').replace(/[^a-zA-Z ]/g, "").replace(" ","_").trim();
    return onlyfile+"clikyMagic"+Date.now()+"."+ext;
}

module.exports.uploadClikyMagicCsvFile = async (req, type) => {
    return new Promise((resolve, reject) => {
        try {
            const allowedMimeTypes = ['application/csv', 'text/csv'];
            const lastPath = type === 'image' ? '/images' : '/files';
            const form = formidable({multiples: true, uploadDir: filePath + lastPath});


            let lastPath0 = ''
            let filename = '';
            let rawfile = '';
            let orgfilename = '';

            form.on('fileBegin', function (field, file) {
                let splfile = file.originalFilename.split(".");

                let type = splfile.pop();

                if (type !== 'csv') {

                    // console.log("1111")

                    resolve({status: 500, message: 'Please select a valid csv file', response: null})  
                    fs.unlink(file.path);
                }
            });

            form.on('file', function(field, file) {
                //rename the incoming file to the file's name
                rawfile = file;
                orgfilename = file.originalFilename
                filename = genFileNameClikyMgic(file.originalFilename);


                const fileContent = fs.readFileSync(file.filepath);

                const s3Params = {
                    Bucket:  config.BUCKET,
                    Key: config.DEFAULT_PATH+'files/' + filename,
                    Body: fileContent,
                    ContentType: file.type,
                };
                
                s3.upload(s3Params,(err,data)=>{
                    if(err){
                        resolve({ status: 500, message: 'Error uploading to S3', response: null });
                    }
                });
            });

            form.parse(req, async (err, fields, files) => {
                const data = fields;
                // let userId = data.userId
                // let clientId = data.clientId

                fs.rename(rawfile.filepath, filePath + lastPath + "/" + filename, (err) => {
                });

                data['fileName'] = lastPath + '/' + filename;
                data['orgfilename'] = orgfilename;
                if(filename !== '') {
                    const file = files.image === undefined ? files.file : files.image;
                    const fileType =file.mimetype;

                    // console.log("fileType", fileType)

                    if (!allowedMimeTypes.includes(fileType)) {

                        // console.log("222")

                        resolve({status: 500, message: 'Please select a valid csv file', response: null})

                    }else{
                        resolve({status: 200, message: 'File uploaded successfully', response: await util.encryptResponse(data)});
                    }
                } else {
                    resolve({status: 500, message: 'File uploaded successfully', response: await util.encryptResponse(data)});
                }
            });  
        } catch (e) {

            resolve({status: 500, message: 'Internal server error', response: null})
        }
    })
}