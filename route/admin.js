const express = require('express');
const common = require('../lib/common.js');
const mysql = require('mysql');

var db = mysql.createPool({host:'localhost',user:'root',password:'zhangy123',database:'learn'})

module.exports=()=>{
    let router = express.Router();


    router.use((req,res,next)=>{
        if(!req.session.admin_id&&req.url!='/login'){
            res.redirect('/admin/login');
        }else{
            next();
        }
    })
    router.get('/login',(req,res)=>{
        res.render('admin/login.ejs',{});
    });
    router.post('/login',(req,res)=>{
        let username = req.body.username;
        let password = common.md5(req.body.password);
        console.log(password);
        db.query(`SELECT * FROM admin_table WHERE username = '${username}'`,(err,data)=>{
            if(err){
                console.log(err);
                res.status(500).send().end();
            }else{
                console.log('数据库查询返回数据',data);
                if(data.length == 0){
                    res.status(400).send('no this admin').end();
                }else{
                    if(data[0].password == password){
                        req.session['admin_id'] = data[0].ID;
                        res.redirect('/admin/');
                    }else{
                        res.status(400).send('password err').end();
                    }
                }
            }
        });
    });
    router.get('/',(req,res)=>{
        res.render('admin/index.ejs',{});
    })
    router.get('/banners',(req,res)=>{
        console.log(req.query.act);
        switch(req.query.act){
            case 'mod':
                db.query(`SELECT * FROM banner_table WHERE id=${req.query.id}`, (err, data)=>{
                if(err){
                    console.error(err);
                    res.status(500).send('database error').end();
                }else if(data.length==0){
                    res.status(404).send('data not found').end();
                }else{
                    db.query('SELECT * FROM banner_table', (err, banner)=>{
                    if(err){
                        console.error(err);
                        res.status(500).send('database error').end();
                    }else{
                        res.render('admin/banners.ejs', {banner, mod_data: data[0]});
                    }
                    });
                }
                });
            break;
            case 'del':
            db.query(`DELETE FROM banner_table WHERE ID='${req.query.id}'`,(err,data)=>{
                if(err){
                    res.status(400),send('database errr').end();
                }else{
                    res.redirect('/admin/banners');
                }
            })
            break;
            default:
            db.query(`SELECT * FROM banner_table`,(err,banner)=>{
                if(err){
                    res.status(400).send('data err').end();
                }else{
                    res.render('admin/banners.ejs',{banner});
                }
            });
            break;
        };
 
    })
    router.post('/banners',(req,res)=>{
        let title = req.body.title;
        let description = req.body.description;
        let href = req.body.href;

        if(!title||!description||!href){
            res.status(400).send('arg err').end();
        }else{
            db.query(`INSERT INTO banner_table(title,description,href) VALUE('${title}','${description}','${href}')`,(err,data)=>{
              if(err){
                  console.log(err);
                  res.status(500).send('database err').end();
              }else{
                res.redirect('/admin/banners');
              } 
            })
        }
    })
    router.get('/custom',(req,res)=>{
        res.render('admin/custom.ejs',{});
    })

    return router;
}