const User = require('../models/User');

module.exports = async (req, res) => {
  try {
    await User.create(req.body);
    console.log('User created successfully ' + req.body.username);
    return res.redirect('/');
  } catch (err) {
    let validationErrors = [];

    // 1. Handle Duplicate Key Error (MongoDB 11000)
    if (err.code === 11000) {
      // You can get specific by checking err.keyValue, 
      // e.g., "Username is already taken"
      validationErrors.push('The email or username you entered is already in use.');
    }

    // 2. Handle Standard Mongoose Validation Errors
    if (err.errors) {
      const mongooseErrors = Object.keys(err.errors).map(key => err.errors[key].message);
      validationErrors = validationErrors.concat(mongooseErrors);
    }

    // 3. Store in session and redirect
    //req.session.validationErrors = validationErrors;    
    req.flash('validationErrors', validationErrors);
    req.flash('data', req.body);

    // Optional: Log them for debugging
    console.error('Captured Errors:', validationErrors);

    return res.redirect('/auth/register');
  }
};
    /*
    if (err.name === 'ValidationError') {
      return res.status(400).send('Invalid user data');
    }

    console.error(err);
    return res.status(500).send('Server error');
    */


