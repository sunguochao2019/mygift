const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();

//引入操作类
var mongoose = require('mongoose');
//设置数据库连接字符串
var DB_CONN_STR = "mongodb://127.0.0.1/gift";
//连接到数据库
mongoose.connect(DB_CONN_STR)
    .then(() => {
        console.log("数据库连接成功！")
    })
    .catch(err => {
        console.log("连接数据库失败！" + err)
    })

//引入模型
require("./models/Gift");
const Gift = mongoose.model('gifts');

//handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


const port = 5000;

//配置路由
app.get('/', (req, res) => {
    const title = '赶快打开宝箱'
    res.render('index', {
        title: title
    });
})

app.get('/about', (req, res) => {
    res.render('about');
})

app.get('/gifts', (req, res) => {
    Gift.find({}).then((gift) => {
        console.log(gift);
        res.render('gifts/index', {
            giftList: gift
        })
    })
    // Gift.find({})
    //     .sort({ date: "desc" })
    //     .then((gifts) => {

    //         res.render('gifts/index', {
    //             giftList: gifts
    //         });
    //     })
})
//添加
app.get('/gifts/add', (req, res) => {
    res.render('gifts/add');
})
//编辑
app.get("/gifts/edit/:id", (req, res) => {
    Gift.findOne({
        _id: req.params.id
    }).then(gift => {

        res.render("gifts/edit", {
            giftEdit: gift
        });
    })

})

app.post('/gifts', urlencodedParser, (req, res) => {
    //console.log(req.body)
    let errors = [];

    if (!req.body.giftTitle) {
        errors.push({ errMessage: '请输入标题！' })
    }

    if (!req.body.giftDetails) {
        errors.push({ errMessage: '请输入详情' })
    }

    if (errors.length > 0) {
        res.render("gifts/add", {
            errors: errors,
            giftTitle: req.body.giftTitle,
            giftDetails: req.body.giftDetails
        })
    } else {
        // res.send('OK')
        const newUser = {
            giftTitle: req.body.giftTitle,
            giftDetails: req.body.giftDetails
        }
        new Gift(newUser)
            .save()
            .then(gift => {
                //console.log(gift + '222222')
                res.redirect('/gifts')
            })
    }


    //res.render('gift');
})

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})