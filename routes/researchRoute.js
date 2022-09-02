const express = require('express');
const router = express.Router();
const { 
    getAllResearches, 
    createResearch,
    getResearch,
    updateResearch,
    // uploadPdfThumbnail,
    // uploadPdfFile,
    getPdfFile,
    getResearchesByUserId,
    deleteResearch
    // uploadFiles
} = require('../controllers/researchController');
const { protectRoute } = require('../middlewares/authMiddleware');

router
    .route('/')
    .get(getAllResearches)
    .post(
        protectRoute,
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
        // uploadPdfFile,
        updateResearch
    )
    .delete(
        protectRoute,
        deleteResearch
    );
    
router.route('/:researchId/pdf-files').get(getPdfFile);

module.exports = router;