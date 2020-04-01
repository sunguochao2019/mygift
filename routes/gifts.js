const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router();

const { token } = require('../helpers/auth')

//引入模型
require("../models/Gift");
const Gift = mongoose.model('gifts');


// create application/json parser
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

//查询愿望
router.get('/', token, (req, res) => {

    Gift.find({ user: req.user.id })
        .sort({ date: "desc" })
        .then((gifts) => {
            //console.log(gift);
            // create context Object with 'usersDocuments' key
            const context = {
                giftDocuments: gifts.map(document => {
                    return {
                        _id: document._id,
                        giftTitle: document.giftTitle,
                        giftDetails: document.giftDetails,
                        getDate: document.getDate
                    }
                })
            }
            res.render('gifts/index', {
                giftList: context.giftDocuments
            });
        })
        .catch(error => res.status(500).send(error))
})

//添加礼物页面
router.get('/add', token, (req, res) => {
    res.render('gifts/add');
})

//编辑礼物页面
router.get("/edit/:id", token, (req, res) => {
    Gift.findOne({
        _id: req.params.id
    }).then(gift => {
        if (gift.user != req.user.id) {
            req.flash("error_msg", "非法操作！");
            res.redirect('/users/login')

        } else {
            const context = {
                giftTitle: gift.giftTitle,
                giftDetails: gift.giftDetails,
                id: gift._id
            }
            res.render("gifts/edit", {
                giftEdit: context
            });
        }


    })

})

//实现创建
router.post('/', urlencodedParser, (req, res) => {
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

        const newGift = {
            giftTitle: req.body.giftTitle,
            giftDetails: req.body.giftDetails,
            user: req.user.id
        }
        new Gift(newGift)
            .save()
            .then(idea => {
                req.flash("success_msg", "数据添加成功!");
                res.redirect('/gifts')
            })
    }
})

//实现删除
router.delete("/:id", token, (req, res) => {
    Gift.remove({
        _id: req.params.id
    }).then(() => {

        req.flash("success_msg", "数据删除成功！");
        res.redirect('/gifts')

    }).catch(error => res.status(500).send(error))


})

//实现编辑
router.put("/:id", urlencodedParser, (req, res) => {
    //res.send('PUT');
    Gift.findOne({
        _id: req.params.id
    })
        .then(gift => {
            gift.giftTitle = req.body.giftTitle,
                gift.giftDetails = req.body.giftDetails;
            gift.save()
                .then(gift => {

                    req.flash("success_msg", "数据保存成功！");
                    res.redirect("/gifts")
                })
        })
})


module.exports = router;
