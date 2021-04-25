const express = require('express');
const router = express.Router();
const userModel = require('./users');
const passport = require('passport');
const localStratagy = require('passport-local');

passport.use(new localStratagy(userModel.authenticate()));


router.get('/', function(req, res){
  res.status(200).json({message: 'successfull.', page: 'index'});
});

router.get('/profile', (req, res) => {
  userModel.findOne({username: req.session.passport.user})
  .then((foundUser) => {
    res.status(200).json({message: 'successfull.', value: foundUser});
  });
});

router.post('/reg', (req, res) => {
  var newUser = new userModel({
    name: req.body.name,
    username: req.body.username,
  });
  userModel.register(newUser, req.body.password)
  .then((regUser) => {
    passport.authenticate('local')(req, res, () => {
      res.status(200).json({message: 'successfull.', value: regUser});
    });
  });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/'
}), (req, res) => {});

router.get('/logout', (req, res) => {
  req.logOut();
  res.status(200).json({message: 'successfull.'});
});

router.put('/update', (req, res) => {
  userModel.findOneAndUpdate({username: req.session.passport.user}, {name: req.body.name}, {new: true})
  .then((updatedUser) => {
    res.status(200).json({message: 'successfull.', value: updatedUser});
  });
});

module.exports = router;
