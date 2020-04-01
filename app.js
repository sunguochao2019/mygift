const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const app = express();

//引入路由
const gifts = require('./routes/gifts');
const users = require('./routes/users');
require("./config/passport")(passport);

const db = require("./config/database")
//连接到数据库
mongoose.connect(db.mongoURL)
    .then(() => {
        console.log("MongoDB connected....");
    })
    .catch(err => {
        console.log(err);
    })

//引入模型
require("./models/Gift");
const Gift = mongoose.model('gifts');

//handlebars middlewaress
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// create application/json parser
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

//使用静态文件
app.use(express.static(path.join(__dirname, 'public')))

//method-override用法
app.use(methodOverride('_method'));

//session & flash
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//配置全局变量;
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

//首页
app.get('/', (req, res) => {
    const title = '添加你的愿望吧！'
    res.render('index', {
        title: title
    });
})

//关于我们
app.get('/about', (req, res) => {
    res.render('about');
})

//r使用outer
app.use('/gifts', gifts);
app.use('/users', users);

const port = process.eventNames.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})