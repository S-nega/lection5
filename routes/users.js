const express = require('express');
const router = express.Router();
const User = require('..//models/userModel');
const { body, validationResult } = require('express-validator');


//get registration page
router.get('/reg', async(req, res) => {
  try{
      currentuser = null;
      res.status(200).render(`reg`);
  } catch (error){
      res.status(500).json({message: error.message});
  }
})

//get authentification page and logout
router.get('/auth', async(req, res) => {
  try{
      currentuser = null;
      res.status(200).render(`auth`);
  } catch (error){
      res.status(500).json({message: error.message});
  }
})

//check auth user
router.post('/auth', async(req, res) => {
  try{
      const email = req.body.email;
      const users = await User.find({});
      console.log(email);

      users.forEach(user => {
        if(user.email === email){
          currentuser = user;
        }
      });

      try{
        const curid = currentuser.id;
        if(currentuser.password === req.body.password){
          res.status(200).redirect('/users/' + curid);// get one user
        }
        else{
          console.log("uncorrect password");
          res.status(500).redirect('/users/auth');
        }
      }catch (error){
        console.log("uncorrect email");
        res.status(200).redirect('/users/auth');
      }
      
      
  } catch (error){
      res.status(500).json({message: error.message});
  }
})


//get all users
router.get('/', async(req, res) => {
    try{
      const users = await User.find({});
      console.log(users);
      try{
        res.status(200).render(`users`, {users: users, currentuser: currentuser});
      }catch (error){
        res.status(200).render(`users`, {users: users, currentuser: null});
      }

    } catch (error){
      res.status(500).json({message: error.message})
    }
  });

  // get one user
router.get('/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        try{
          if (currentuser != null){
            if (user.id === currentuser.id){
              res.status(200).render(`edituser`, {currentuser: user});
            }
            else{
              console.log("you are not registered")
              res.status(200).render(`user`, {user: user});
            }
          }
          else{
            console.log("you are not registered")
            res.status(200).render(`user`, {user: user});
          }
        } catch(error){
          currentuser = null;
          res.status(500).redirect('/users/' + id);
        }
        

    } catch (error) {
        console.log({message: error.message})
        res.status(500).json({message: error.message})
    }
  })
  
  //create new user registration
router.post('/', async(req, res) => {
    try{
      if(
        req.body.reppas === req.body.password && 
        req.body.email.indexOf('@') < req.body.email.lastIndexOf('.')-1 &&
        req.body.password.length > 5 ){
          
        const users = await User.find({});
        users.forEach(user => {
          if(req.body.email == user.email){
            console.log("this email is already used");
            res.redirect('/users/reg').end();
          }  
        });

        console.log("test");
        const user = await User.create(req.body);
        currentuser = user;
        res.status(200).redirect('/users/' + user.id);// get one user
        
      } else{
        console.log("unallowable email or password")
        res.redirect('/users/reg');
      }
    } catch (error){
      console.log(error)
      res.status(500).json({message: error.message})
    }
  });
  
  //update user
router.post('/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        let newuser = user;
        newuser.name = req.body.name 
        newuser.email = req.body.email

        console.log(req.body);
        if(req.body.password === ''){
          await User.findByIdAndUpdate(id, newuser);
          console.log("null password");
        }
        if (req.body.oldpas === user.password && 
            req.body.password === req.body.reppas && 
            req.body.password.length > 5){
          console.log("change password");
          newuser.password = req.body.password
          await User.findByIdAndUpdate(id, newuser);
        } else{
          console.log("uncorrect passwords");
        }
        
        if(!user){
            return res.status(404).json({message: `cannot find any user with ID ${id}`})
        }
        const updateduser = await User.findById(id);
        res.status(200).redirect('/users/' + id);
        console.log(updateduser);
  
    } catch (error) {
        res.status(500).json({message: error.message})
    }
  })
  
  //delete user
router.post('/del/:id', async(req, res) => {
  if (currentuser == null){
    res.redirect('/users/auth');
  }
  else{
    try{
      const {id} = req.params;
      const user = await User.findByIdAndDelete(id);
      
      if(!user){
          return res.status(404).json({message: `cannot find any user with ID ${id}`})
      }
      currentuser = null;
      res.status(200).redirect('/users/reg');

    } catch (error){
        console.log(error)
        res.status(500).json({message: error.message})
    }
  }
  })
  
module.exports = router;
