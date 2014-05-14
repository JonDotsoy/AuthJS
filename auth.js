/**
* este modulo permite el control de sessiones basadas en un login
* Elementos requeridos:
*					- express
*					- jade
*					- monk
*					- fs
*					- cookie-parser
*/
(function(t,app,db,jade,cookieParser,fs,bodyParser){

	t.config = {
		alerts: true,
		user: null,
		panel: {
			login: "/Auth/login",
			regis: "/Auth/regis"
		},
		src: {
			login: "./view/login.jade",
			regis: "./view/regis.jade"
		},
		view: {
			login: null,
			regis: null
		},
		nameCookie: "session",
		nameSessionDB: "AuthSession",
		nameAccountDB: "AuthAccount"
	}
	//** Collecion de la Base de datos

	// Eventos al cargar App
	var loadApp = function(){
		app.use(cookieParser());
		app.use(bodyParser());
		session = db.get(t.config.nameSessionDB);
		account = db.get(t.config.nameAccountDB);
		account.index({user:1},{ unique: true });
		app.use(function(req,res,next){
			next();
		});
		if (!t.config.view.login)
			fs.readFile(t.config.src.login,function(err,src){
				if (!err)
					t.config.view.login = jade.compile(src);
			});
		if (!t.config.view.regis)
			fs.readFile(t.config.src.regis,function(err,src){
				if (!err)
					t.config.view.regis = jade.compile(src);
			});
		app.get(t.config.panel.login,function(req,res){
			if (t.config.view.login)
				res.send(t.config.view.login({msj:{},link: t.config.panel}));
		});
		app.post(t.config.panel.login,function(req,res){
			msj = {}

			account.findOne({
				user: req.body.user,
				active: true
			},function(err,dt){
				view = function(){
					if (t.config.view.login)
						res.send(t.config.view.login({msj:msj,link: t.config.panel}));
				}
				if (dt) {
					if (dt.pass != req.body.pass) {
						msj.danger = "La cuenta no coincide";
						view();
					}
					else {
						session.insert({
							user: dt.user,
							borwser: req.headers['user-agent'],
							date: new Date().getTime()
						},function(err,dt){
							if (!err) {	
								if (dt) {
									res.cookie(t.config.nameCookie, dt._id, { maxAge: 12990000, httpOnly: true });
									msj.warning = "Se inicio sesion correctamente";
									msj.linkReturn = req.cookies["___old_page___"];
									view();
								}else {
									msj.warning = "Tenemos problemas por ahora intentelo nuevamente mas tarde";
									view();
								}
							}
							else {
								msj.warning = "No hemos podido crear la session intentelo nuevamente mas tarde";
								view();
							}
						});
					}
				} else {
					msj.danger = "No existe la cuenta";
					view();
				}
			});
		});
		
		app.get(t.config.panel.regis,function(req,res){
			if (t.config.view.regis)
				res.send(t.config.view.regis({msj:{},link: t.config.panel}));
		});

		app.post(t.config.panel.regis,function(req,res){
			msj = {}

			account.insert({
				user: req.body.user,
				pass: req.body.pass,
				email: req.body.email,
				active: true
			},function(err,dt){
				if (!err) {
					msj.warning = "La cuenta se ha inscrito correctamente";
				} else {
					msj.warning = "hubo un error no hemos podido registrar tu cuenta. Intentelo nuevamente mas tarde";
				}

				if (t.config.view.regis)
					res.send(t.config.view.regis({msj:msj,link: t.config.panel}));
			});
		});
	};

	// Permite proteger con login siertas URI que requieren login
	t.reg = function(uri){
		app.use(uri,function(req,res,next){
			session.findOne({
				_id: req.cookies[t.config.nameCookie]
			},function(err,dt){
				if (!dt) {
					res.cookie("___old_page___",req.url);
					res.redirect(t.config.panel.login);
					res.send("Sitio require session ir a " + t.config.panel.login);
				} else {
					t.config.user = dt.user;
					next();
				};
			});
		});
	}

	// Permite asignar una utilidad a la herramienta
	t.use = function(type,elem){
		if (type == "express") {
			app = elem;
			if (t.config.alerts)
				console.log("Auth: Express is loading.");
		};
		if (type == "monk") {
			db = elem;
			if (t.config)
				console.log("Auth: DB is loading.");
		};
		loadApp();
	};

	loadApp();
})(
	this,
	require("express")(),
	require("monk")('localhost/Auth'),
	require('jade'),
	require('cookie-parser'),
	require('fs'),
	require('body-parser')
)