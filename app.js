const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const logger = require('./logger');
const postRouter = require('./routes/post');


const app = express();

if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
    app.use(helmet());
    app.use(hpp());
} else {
    app.use(morgan('dev'));
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8001);
app.use(express.static(path.join(__dirname, 'public')));
app.engine('pug', require('pug').__express)


app.use(postRouter);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    logger.info('hello');
    logger.error(err.message);
    next(err);
});
  
app.get((err, req, res, next) => {
    res.render('error');
})

app.listen(app.get('port'), () => {
    console.log('waiting on',app.get('port'),'port' );
});