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
});


//add page
router.get('/write', async(req, res) => {
  actualData = null;
  console.log('writes')
  res.render('write');
})

//edit page
router.get('/edit/:name', async(req, res) => {// to fix folder 
  console.log('edit')
  const {name} = req.params;
  filePath = './public/docs/' + name;

  readFile(res, filePath);
  console.log("actual data: " + actualData)
  if (actualData == null){
    sendData(res, '/files/edit/' + name);
  }
  else{
    res.status(200).render('edit', {data: actualData, name:  name})
  }
});


//adding
router.post('/add', async(req, res) => {
  actualData = null;
  console.log(req.body.name);
  filePath = './public/docs/' + req.body.name
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
  
})

//edit
router.post('/edit/:name', async(req, res) => {
  actualData = null;
  const name = req.body.name
  filePath = './public/docs/' + name

  const newData = req.body.data;

  updateFileSync(filePath, newData);
  res.redirect('/files/edit/' + name);

})

//delete
router.post('/del/:name', async(req,res) => {
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
      directoryPath = './public/docs/' + name;
      readDirectory(res, directoryPath);
    } else {
      actualData = data; 
      console.log( "read data: " + data);
      console.log('act in read data: ' + actualData)
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


function updateFileSync(filePath, newData) {
  try {
    fs.writeFileSync(filePath, newData, 'utf8');
    console.log(`Данные успешно обновлены в файле ${filePath}.`);

  } catch (err) {
      console.error(`Ошибка при записи в файл ${filePath}: ${err.message}`);
  }
}


module.exports = router;
