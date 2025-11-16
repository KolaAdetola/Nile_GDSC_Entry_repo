const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const { validateSubmission } = require('../middleware/validation');

// Create new submission
router.post('/', validateSubmission, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const submission = new Submission({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim()
    });

    await submission.save();

    res.status(201).json({
      success: true,
      message: 'Your feedback has been submitted',
      data: submission
    });
  } catch (error) {
    console.error('Submission creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get all submissions (for dashboard)
router.get('/', async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions',
      error: error.message
    });
  }
});

module.exports = router;