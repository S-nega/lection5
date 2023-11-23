var express = require('express');
var router = express.Router();
var filePath = './public/docs/';
const fs = require("fs");
var actualData = null;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  actualData = null;

});


//look all 
router.get('/read', async(req, res) => {
  actualData = null;
  directoryPath = './public/docs';
  readDirectory(res, directoryPath);
});


//read one 
router.get('/read/:name', async(req, res) => {// to fix folder
  console.log('reads')
  const {name} = req.params;
  
  if(name.indexOf('.') <= -1){
    directoryPath = './public/docs/' + name 
    readDirectory(res, directoryPath)
  }

  else{
    filePath = './public/docs/' + name;
    readFile(res, filePath);
    console.log("actual data: " + actualData)
    if (actualData == null){
      sendData(res, '/files/read/' + name);
    }
    else{
      res.status(200).render('readf', {data: actualData, name:  name})
      actualData = null;
      console.log('deleted actual data')
    }
  }
  
});


//add page
router.get('/write/:type', async(req, res) => {
  const {type} = req.params; 
  console.log(type);
  try{
    if (currentuser != null){
      actualData = null;
      console.log('writes')
      if(type === 'fold'){
        res.render('writefolder');
      }
      else{
        res.render('write');
      }
        // res.status(200).render(`edituser`, {currentuser: user});
    }
    else{
      console.log("you are not registered")
      res.status(200).render(`user`, {user: user});
    }
  } catch(error){
    currentuser = null;
    res.status(500).redirect('/users/auth');
  }
})

//edit page
router.get('/edit/:name', async(req, res) => {// to fix folder 
  console.log('edit page')
  const {name} = req.params;
  console.log(name)
  
  if(name.indexOf('.') <= -1){//directory
    directoryPath = './public/docs/' + name 

    console.log("edit page ")
    fs.readdir(directoryPath, 'utf8', (err, data) => {
      if (err) { 
        console.log('no such file or directory')
        res.render('read')
      }
      else{//rename directory

        res.render('editfolder', {name: name} )
        // try {
        //   fs.renameSync(oldPath, newPath);
        //   console.log(`Файл или директория успешно переименованы.`);
        // } catch (err) {
        //     console.error(`Ошибка при переименовании: ${err.message}`);
        // }
      }
    });
  }

  else{//file
    filePath = './public/docs/' + name;
    
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.log('no such file or directory')
        res.render('read')
      }
      else{
        res.render('edit', {name: name, data: data} )

        // updateFileSync(filePath, newData, newPath);
      }
    });
    
    console.log("actual data: " + actualData)
    if (actualData == null){
      sendData(res, '/files/read/' + name);
    }
    else{
      res.status(200).render('readf', {data: actualData, name:  name})
      actualData = null;
      console.log('deleted actual data')
    }
  }
  


  // try{
  //   if (currentuser !== null){
  //     console.log('edit')
  //     const {name} = req.params;
  //     filePath = './public/docs/' + name;

  //     readFile(res, filePath);

  //     console.log("actual data: " + actualData)
  //     if (actualData == null){
  //       sendData(res, '/files/edit/' + name);
  //     }
  //     else{
  //       res.status(200).render('edit', {data: actualData, name:  name, currentuser: currentuser})
  //     }
  //   }
  //   else{
  //     console.log("you are not registered")
  //     res.status(200).render(`user`, {user: user});
  //   }
  // } catch(error){
  //   currentuser = null;
  //   res.status(500).redirect('/users/auth');
  // }
});


//adding
router.post('/add', async(req, res) => {
  try{
    if (currentuser !== null){
      actualData = null;
      const name = req.body.name 
      console.log(name);
      if (!name || name.length < 5 || name.substr(name.length - 4) !== '.txt'){
        
        if(name.indexOf('.') <= -1){
          directoryPath = './public/docs/' + name 

          try{
            fs.readdir(directoryPath, 'utf8', (err, data) => {
              if (err) {
        
                fs.mkdir(directoryPath, { recursive: true }, (err) => {
                  if (err) {
                      console.error(`Ошибка при создании директории ${directoryPath}: ${err.message}`);
                  } else {
                      console.log(`Директория ${directoryPath} успешно создана.`);
                      res.redirect('/files/read');
                  }
              });
                
              } else {
                console.log("such name is already added");
                res.redirect('/files/write/ford');
            }
            })
          }catch(error){
            console.log(error)
            res.status(500).json({message: error.message})
          }

        }
        else{
          console.log("uncorrect name of format. It should be .txt for file and none for folder")
          res.redirect('/files/write');  
        }
      
      }
      else{
        filePath = './public/docs/' + name
        try{
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
      
              fs.writeFile(filePath, req.body.text, (err) => {
                if (err) {
                    console.error(`Ошибка при записи в файл ${filePath}: ${err.message}`);
                } else {
                    console.log(`Данные успешно записаны в файл ${filePath}`);
                    res.redirect('/files/read');
                }
              });
              
            } else {
              console.log("such name is already added");
              res.redirect('/files/write');
          }
          })
        }catch(error){
          console.log(error)
          res.status(500).json({message: error.message})
        }
      }
    }
    else{
      console.log("you are not registered")
      res.status(200).render(`user`, {user: user});
    }
  } catch(error){
    currentuser = null;
    res.status(500).redirect('/users/auth');
  }
})

//edit
router.post('/edit/:name', async(req, res) => {
  try{
    if (currentuser != null){
      actualData = null;
      const {name} = req.params;
      const newname = req.body.name
      const newData = req.body.data;

      //direct edit
      if(name.indexOf('.') <= -1){
        directoryPath = './public/docs/' + name 

        try{
          fs.readdir(directoryPath, 'utf8', (err, data) => {
            if (err) {
      
              fs.mkdir(directoryPath, { recursive: true }, (err) => {
                if (err) {
                    console.error(`Ошибка при создании директории ${directoryPath}: ${err.message}`);
                } else {
                    console.log(`Директория ${directoryPath} успешно создана.`);
                    res.redirect('/files/read');
                }
            });
              
            } else {
              console.log("such name is already added");
              res.redirect('/files/write/ford');
          }
          })
        }catch(error){
          console.log(error)
          res.status(500).json({message: error.message})
        }

      }
      else{
        //file edit
        filePath = './public/docs/' + name
        newPath = './public/docs/' + newname
        updateFileSync(filePath, newData, newPath);
        res.redirect('/files/read/' + newname);
      }
    }
    else{
      console.log("you are not registered")
      res.status(200).render(`user`, {user: user});
    }
  } catch(error){
    currentuser = null;
    res.status(500).redirect('/users/auth');
  }
})

//delete
router.post('/del/:name', async(req,res) => {

try{
  if (currentuser != null){
    actualData = null;
    const {name} = req.params;
    filePath = './public/docs/' + name;
    console.log('delete: ' + filePath);
    fs.unlink(filePath, (err) => {
      if (err) {
          console.error(`Ошибка при удалении файла ${filePath}: ${err.message}`);
      } else {
          console.log(`Файл ${filePath} успешно удален.`);
          res.redirect('/files/read');
      }
    });
  }
  else{
    console.log("you are not registered")
    res.status(200).render(`user`, {user: user});
  }
  } catch(error){
    currentuser = null;
    res.status(500).redirect('/users/auth');
  }
})



function readDirectory(res, directoryPath){
  console.log("Fun rd");
  fs.readdir(directoryPath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Ошибка при чтении директории ${directoryPath}: ${err.message}`);
      res.redirect('/files/read');
    } else {
      console.log(`Содержимое директории ${directoryPath}:`);

      data.forEach((file) => {
        console.log(file);
        const filePath = directoryPath + file;
        console.log('[Файл]   ' + file);
      });
      
      var dir = ""
      for (let i=14; i<directoryPath.length; i++){
        dir += directoryPath[i];
        console.log(directoryPath[i]);
      }
      console.log("dir = ", dir);
      res.status(200).render('read', {data: data, dir: dir})
    }
  });
}

function readFile(res, filePath){
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      directoryPath = filePath;
      readDirectory(res, directoryPath);
    } else {
      // actualData = data; 
      // console.log( "read data: " + data);
      // console.log('act in read data: ' + actualData)
    } 
  });
}

function deleteDirectory(directoryPath) {
  fs.readdirSync(directoryPath).forEach((file) => {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
          deleteDirectory(filePath);
      } else {
          deleteFile(filePath);
      }
  });

  fs.rmdir(directoryPath, (err) => {
      if (err) {
          console.error(`Ошибка при удалении директории ${directoryPath}: ${err.message}`);
      } else {
          console.log(`Директория ${directoryPath} успешно удалена.`);
      }
  });
}


function sendData(res, address){
  res.redirect(address);
}


function updateFileSync(filePath, newData, newPath) {
  try {
    fs.writeFileSync(filePath, newData, 'utf8');
    console.log(`Данные успешно обновлены в файле ${filePath}.`);

    try {
      oldPath = filePath
      fs.renameSync(oldPath, newPath);
      console.log(`Файл или директория успешно переименованы.`);
    } catch (err) {
        console.error(`Ошибка при переименовании: ${err.message}`);
    }

  } catch (err) {
      console.error(`Ошибка при записи в файл ${filePath}: ${err.message}`);
  }
}


module.exports = router;
