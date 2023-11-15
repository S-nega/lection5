var express = require('express');
var router = express.Router();
var filePath = './public/docs/';
const fs = require("fs");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/read', async(req, res) => {
  console.log('reads')
  // readAndPrintFile(filePath);
  directoryPath = './public/docs';
  fs.readdir(directoryPath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Ошибка при чтении файла ${directoryPath}: ${err.message}`);
    } else {
      console.log(`Содержимое директории ${directoryPath}:`);
        console.log(data);
        data.forEach((file) => {
            console.log(file);
            const filePath = directoryPath + file;

            // if (file.isDirectory()) {
                // console.log(`[Поддиректория] ${file}`);
                // Рекурсивно читаем поддиректории
                // readDirectory(filePath);
            // } else {
              console.log('[Файл]   ' + file);
                
            // }
          });
        
        res.status(200).render('read', {data: data})
        // console.log(data);
        // res.status(200).render('read', {data: data})
    }
});
  // res.sendFile(path.join(__dirname, "./public/docs/test.txt"));
});

router.get('/read/:name', async(req, res) => {
  console.log('reads')
  // readAndPrintFile(filePath);
  const {name} = req.params;
  filePath = './public/docs/' + name;
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Ошибка при чтении файла ${filePath}: ${err.message}`);
    } else {
        console.log(data);
        res.status(200).render('readf', {data: data})
    }
});
  // res.sendFile(path.join(__dirname, "./public/docs/test.txt"));
});

router.get('/write', async(req, res) => {
  console.log('writes')
  res.render('write');
})

router.post('/add', async(req, res) => {
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
        
        // console.error(`Ошибка при чтении файла ${filePath}: ${err.message}`);
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

// function readAndPrintFile(filePath) {
  
// }

module.exports = router;
