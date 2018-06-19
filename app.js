let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let cors = require('cors');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/mean-chat')
    .then(() =>  console.log('connection successful'))
    .catch((err) => console.error(err));

let chat = require('./routes/chat');
let app = express();

// app.set('view engine', 'html');
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
// app.use(express.static(path.join(__dirname, 'dist/mean-chat')));
// app.use(express.static(path.join(__dirname, 'src')));

app.use('/chat', chat);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;