const express = require('express');
const router = express.Router();
const { Url } = require('../models/urlModels');
const validateToken = require('../middlewares/validateToken');

router.post('/save-url', validateToken,async (req, res) => {
    try {
   
        const { url,metadata } = req.body;
   
    
        const newUrl = new Url({ url, userId: req.user.id,metadata,startedAt:Date.now() });
        await newUrl.save();
        console.log('Url Saved Succesfully')
        res.status(201).json(newUrl);
    } catch (error) {
        console.error('Error saving URL:', error);
        res.status(500).json({ message: error.message });
    }
});

router.put('/update-url', validateToken,async (req, res) => {
    try {
      
        const { urlId } = req.body;
        const { completedAt } = req.body;
      
        await Url.findByIdAndUpdate(urlId, { completedAt });
        console.log('URL updated successfully');
        res.status(200).json({ message: 'URL updated successfully' });
    } catch (error) {
        console.error('Error updating URL:', error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/get-url-by-id/:url', validateToken,async (req, res) => {
    try {
     
        const { url } = req.params;
     
        const urlData = await Url.findOne({ url });
        
        res.status(200).json(urlData);
    } catch (error) {
        console.error('Error getting URL by ID:', error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/get-urls', validateToken,async (req, res) => {
    try {
    
        const urls = await Url.find({ userId: req.user.id });

        res.status(200).json({
            urls:urls,
            qty:urls.length
        });
    } catch (error) {
        console.error('Error getting URLs:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
