const express = require('express');
const router = express.Router();
const { 
    getAllResearches, 
    createResearch,
    getResearch,
    updateResearch,
    uploadPdfThumbnail,
    resizePdfThumbnail,
    uploadPdfFile,
    getPdfFile,
    getResearchesByUserId
    // uploadFiles
} = require('../controllers/researchController');
const { protectRoute } = require('../middlewares/authMiddleware');

router
    .route('/')
    .get(getAllResearches)
    .post(
        protectRoute,
        uploadPdfFile, 
        uploadPdfThumbnail,
        createResearch
    );

router.route('/user').get(protectRoute, getResearchesByUserId);

    
// router
// .route('/')
// .get(getAllResearches)
// .post(
//     protectRoute,
//     uploadFiles,
//     createResearch
// );

router
    .route('/:researchId')
    .get(getResearch)
    .patch(
        protectRoute, 
        // uploadPdfThumbnail, 
        // resizePdfThumbnail,
        uploadPdfFile,
        updateResearch
    );
router.route('/:researchId/pdf-files').get(getPdfFile);

module.exports = router;