const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const passport = require('passport');
const router = express.Router();


// create application/json parser
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

//加载model
require('../models/User');
const User = mongoose.model('users');


//user login & register
router.get('/login', (req, res) => {
    res.render('users/login');
})

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash("success_msg", "退出登录成功！")
    res.redirect('/users/login')
})

router.post("/login", urlencodedParser, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/gifts',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
    // // 查询数据库
    // User.findOne({email:req.body.email})
    //     .then((user) => {
    //       if(!user){
    //         req.flash("error_msg","用户不存在!");
    //         res.redirect("/users/login");
    //         return;
    //       }

    //       // 密码验证
    //       bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
    //         if(err) throw err;

    //         if(isMatch){
    //           req.flash("success_msg","登录成功!");
    //           res.redirect("/ideas");
    //         }else{
    //           req.flash("error_msg","密码错误!");
    //           res.redirect("/users/login");
    //         }
    //       });
    //     })
})

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', urlencodedParser, (req, res) => {
    //console.log(req.body);
    // res.send('register');
    let errors = [];

    if (req.body.password != req.body.password2) {
        errors.push({
            message: "两次密码不一致！"
        })
    }

    if (req.body.password.length < 4) {
        errors.push({
            message: "密码格式有误！"
        })
    }

    if (errors.length > 0) {
        //res.send('dddd')
        res.render('users/register', {
            errors: errors,
            userName: req.body.userNamem,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    } else {


        User.findOne({ email: req.body.email })
            .then((user) => {
                if (user) {
                    req.flash("error_msg", "邮箱已存在，请重新输入！")
                    res.redirect('/users/register')
                } else {
                    const newUser = new User({
                        userName: req.body.userName,
                        email: req.body.email,
                        password: req.body.password,
                    })
                    //密码加密
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, function (err, hash) {
                            if (err) throw err;
                            newUser.password = hash;
                            //存储密码
                            newUser.save()
                                .then(
                                    (user) => {
                                        //rconsole.log(user)
                                        req.flash("success_msg", "账号注册成功！");
                                        res.redirect('/users/login')
                                    }
                                ).catch(error => {
                                    req.flash("error_msg", "账号注册失败！" + error);
                                    res.redirect('/users/register')
                                })
                        });
                    });



                }
            })


    }
})
module.exports = router;