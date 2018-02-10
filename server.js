const express = require('express');
const static = require('express-static');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const multerObj = multer({dest:'./static/upload'});
const expressRoute = require('express-route');
const consolidate = require('consolidate');


var server = express();
server.listen(8888);


//1.获取请求数据
server.use(multerObj.any());
server.use(bodyParser.urlencoded());


//2.coolie session
server.use(cookieParser());

(function(){
	var keys = [];
	for(var i=0;i<10000;i++){
		keys[i]='key_'+Math.random();
	}
	server.use(cookieSession({
		name:'sess_id',
		keys:keys,
		maxAge:1000*60*20
	}))
})();



//3.模板
server.engine('html',consolidate.ejs);
server.set('views','template');
server.set('view engine','html');

//4.route
server.use('/',require('./route/web.js')());
server.use('/admin',require('./route/admin.js')());

//5.default static