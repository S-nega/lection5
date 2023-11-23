const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

let currentuser = null;

const indexRouter = require('./routes/index');
const UsersRouter = require('./routes/users', {currentuser: currentuser});
const filesRouter = require('./routes/files', {currentuser: currentuser});

const app = express();

const http = require("http");

// const httpServer = http.createServer(app);

// const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // Отправляем HTTP-заголовок с кодом состояния 200 (OK) и типом контента text/plain
  res.writeHead(200, {'Content-Type': 'text/plain'});
  // res.status(200).render('index');

  res.end('Hello, client!\n');
});

// Слушаем порт 8080
const port = 8080;
server.listen(port, () => {
  console.log(`Сервер слушает порт ${port}`);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', UsersRouter);
app.use('/files', filesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

mongoose.
connect('mongodb+srv://admin:admin@booksdb.9ym73nv.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
console.log('connected to MongoDB')
console.log('Hello, Node.js')
  }).catch((error) => {
    console.log(error)
})


const multer = require("multer");

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!" + err.message);
};

const upload = multer({
  dest: "/public/docs/"
});

module.exports = app;
