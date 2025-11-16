const validateSubmission = (req, res, next) => {
  const { name, email, message } = req.body;
  const errors = [];

  // Name validation
  if (!name || name.trim() === '') {
    errors.push('Name is required');
  } else if (name.length > 100) {
    errors.push('Name cannot exceed 100 characters');
  }

  // Email validation
  if (!email || email.trim() === '') {
    errors.push('Email is required');
  } else {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }
  }

  // Message validation
  if (!message || message.trim() === '') {
    errors.push('Message is required');
  } else if (message.length > 1000) {
    errors.push('Message cannot exceed 1000 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = { validateSubmission };