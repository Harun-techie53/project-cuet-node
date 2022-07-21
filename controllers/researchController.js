const User = require('../models/userModel');
const Research = require('../models/researchModel');
const multer = require('multer');
const sharp = require('sharp');
const {v4} = require('uuid');
const {fromPath} = require('pdf2pic');

const multerPdfStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/pdfs');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];

        // user-userId-currenttimestamp.ext
        cb(null, `pdf-${v4()}-${Date.now()}.${ext}`);
    }
});

const multerImageStorage = multer.memoryStorage();

const multerImageFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Forbidden extension!'), false);
    }
}

const multerPdfFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('application')) {
        cb(null, true);
    } else {
        cb(new Error('Forbidden extension!'), false);
    }
}

const uploadImage = multer({
    storage: multerImageStorage,
    fileFilter: multerImageFilter
});

const uploadPdf = multer({
    storage: multerPdfStorage,
    fileFilter: multerPdfFilter
});

exports.uploadPdfFile = uploadPdf.array('pdf', 5);

exports.uploadPdfThumbnail = uploadImage.single('thumbnail');

exports.resizePdfThumbnail = (req, res, next) => {
    const mimetype = req.file.mimetype.split('/')[0];

    if(mimetype !== 'image') next();

    req.file.filename = `thumbnail-${v4()}-${Date.now()}.jpg`;

    sharp(req.file.buffer)
        .resize(480, 360)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/thumbnails/${req.file.filename}`);
    
    next();
}

exports.getPdfFile = async (req, res) => {
    try {
        const {files} = req.body;

        const research = await Research.findById(req.params.researchId);

        const allFoundFiles = [];

        research.pdf.forEach((file) => allFoundFiles.unshift(file));

        

        res.status(200).json({
            status: 'success',
            results: allFoundFiles.length,
            files: allFoundFiles
        });
    } catch (err) {
        res.status(404).json({
            message: err.message
        });
    }
}

exports.getAllResearches = async (req, res) => {
    try {
        const researches = await Research.find();
        res.status(200).json({
            status: 'success',
            data: {
                researches
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.getResearch = (req, res) => {
    try {
        res.status(200).json({
            status: 'success',
            data: {
                research: 'The specific research ID ' + req.params.researchId
            }
        });;
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.createResearch = async (req, res) => {
    const {
        title,
        slug,
        description
    } = req.body;
    const uploadedFiles = [];

    req.files.forEach((file) => uploadedFiles.unshift(file.filename));
    try {
        const newResearch = new Research({
            userId: req.user.id,
            title,
            slug,
            description,
            pdf: uploadedFiles
        });

        await newResearch.save();

        res.status(200).json({
            status: 'success',
            data: {
                research: newResearch
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.updateResearch = async (req, res) => {
    try {
        const research = await Research.findByIdAndUpdate(
            req.params.researchId,
            {
                title: req.body.title,
                slug: req.body.slug,
                description: req.body.description,
                thumbnail: req.file.filename,
                pdf: req.file.filename
            },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            status: 'success',
            data: {
                research
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}