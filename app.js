const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const morgan = require('morgan');
const bodyParser = require('body-parser');
// const helmet = require('helmet');
// const hpp = require('hpp');
const path = require('path');
const { sequelize } = require('./models');

// const RedisStore = require('')

const passportConfig = require('./passport');
const logger = require('./logger');
const pageRouter = require('./routes/page');
const postRouter = require('./routes/post');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');


const app = express();
sequelize.sync();
passportConfig(passport);

// app.engine('pug', require('pug').__express)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8001);


if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
    // app.use(helmet());
    // app.use(hpp());
} else {
    app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());// 이게 있어야 req.body를 쓸 수 있음
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser( process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET, 
    cookie: {
        httpOnly: true,
        secure: false,
    },
    // store: new RedisStore({
    //     host: process.env.REDIS_HOST,
    //     port: process.env.REDIS_PORT,
    //     pass: process.env.REDIS_PASSWORD,
    //     logErrors: true,
    // })
}));
app.use (flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/',pageRouter);
app.use('/post', postRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    logger.info('404 Not Found');
    logger.error(err.message);
    next(err);
});
  
app.get((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log('waiting on',app.get('port'),'port' );
});
