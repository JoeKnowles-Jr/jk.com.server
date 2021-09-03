const fs = require('fs');
const router = require('express').Router();

const VIDEOS_DIR = __dirname + '/../../public_html/videos/';
const THUMBS_DIR = __dirname + '/../../public_html/thumbs/';

router.post('/upload', (req, res) => {
    let uploadedFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send('No files were uploaded.');
        return;
    }

    uploadedFile = req.files.file;
    uploadPath = req.body.type === 'video' ? VIDEOS_DIR : THUMBS_DIR;
    uploadPath += uploadedFile.name;

    uploadedFile.mv(uploadPath, function (err) {
        if (err) {
            return res.json({message: err});
        }

        fs.readdir(VIDEOS_DIR, (err, videos) => {
            if (err) {
                throw err;
            }
            fs.readdir(THUMBS_DIR, (err, thumbs) => {
                if (err) {
                    throw err;
                }
                res.json({
                    thumbFiles: thumbs,
                    videoFiles: videos,
                    message: uploadedFile.name + ' was uploaded to ' + uploadPath
                });
            });
        });
    });
});

router.get('/', (req, res) => {
    fs.readdir(VIDEOS_DIR, (err, videos) => {
        if (err) {
            throw err;
        }
        fs.readdir(THUMBS_DIR, (err, thumbs) => {
            if (err) {
                throw err;
            }
            res.json({
                thumbFiles: thumbs,
                videoFiles: videos
            });
        });
    });
});

router.get('/videos', (req, res) => {
    fs.readdir(VIDEOS_DIR, (err, files) => {
        if (err) {
            throw err;
        }
        res.json(files);
    });
});

router.get('/thumbs', (req, res) => {
    fs.readdir(THUMBS_DIR, (err, files) => {
        if (err) {
            throw err;
        }
        res.json(files);
    });
});

// router.post('/videos/upload-video', (req, res) => {
//     try {
//         if (!req.files) {
//             res.send({
//                 status: false,
//                 message: 'No file uploaded'
//             });
//         } else {
//             //Use the name of the input field ("video") to retrieve the uploaded file
//             let video = req.files.video;

//             //Use the mv() method to place the file in video directory
//             video.mv(VIDEOS_DIR + video.name);

//             fs.readdir(VIDEOS_DIR, (err, files) => {
//                 if (err) {
//                     throw err;
//                 }
//                 //send response
//                 res.send({
//                     status: true,
//                     message: 'File is uploaded',
//                     data: {
//                         name: video.name,
//                         mimetype: video.mimetype,
//                         size: video.size,
//                         videofiles: files
//                     }
//                 });
//             });


//         }
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

// router.post('/thumbs/upload-thumb', (req, res) => {
//     try {
//         if (!req.files) {
//             res.send({
//                 status: false,
//                 message: 'No file uploaded'
//             });
//         } else {
//             //Use the name of the input field (i.e. "thumb") to retrieve the uploaded file
//             let thumb = req.files.thumb;

//             //Use the mv() method to place the file in video directory
//             thumb.mv(THUMBS_DIR + thumb.name);

//             fs.readdir(THUMBS_DIR, (err, files) => {
//                 if (err) { throw err; }
//                 //send response
//                 res.send({
//                     status: true,
//                     message: 'File is uploaded',
//                     data: {
//                         name: thumb.name,
//                         mimetype: thumb.mimetype,
//                         size: thumb.size,
//                         thumbfiles: files
//                     }
//                 });
//             });


//         }
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

module.exports = router;
