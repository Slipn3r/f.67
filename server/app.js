"use strict";
const express = require('express');
const DB = require('./db');
const config = require('./config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const db = new DB("sqlitedb")
const app = express();
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', '*');
	res.header('Access-Control-Allow-Headers', '*');
	next();
}

app.use(allowCrossDomain)

router.post('/register', function(req, res) {
	db.insert([
		req.body.name,
		req.body.email,
		bcrypt.hashSync(req.body.password, 8)
	],
	function (err) {
		if (err) return res.status(500).send("There was a problem registering the user.")
		db.selectByEmail(req.body.email, (err,user) => {
			if (err) return res.status(500).send("There was a problem getting user")
			let token = jwt.sign({ id: user.id }, config.secret, {expiresIn: 86400});
			res.status(200).send({ auth: true, token: token, user: user });
		}); 
	}); 
});

router.post('/register-admin', function(req, res) {
	db.insertAdmin([
		req.body.name,
		req.body.email,
		bcrypt.hashSync(req.body.password, 8),
		1
	],
	function (err) {
		if (err) return res.status(500).send("There was a problem registering the user.")
		db.selectByEmail(req.body.email, (err,user) => {
			if (err) return res.status(500).send("There was a problem getting user")
			let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400});
			res.status(200).send({ auth: true, token: token, user: user });
		}); 
	}); 
});

router.post('/login', (req, res) => {
	db.selectByEmail(req.body.email, (err, user) => {
		if (err) return res.status(500).send('Error on the server.');
		if (!user) return res.status(404).send('No user found.');
		let passwordIsValid = bcrypt.compareSync(req.body.password, user.user_pass);
		if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
		let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400});
		res.status(200).send({ auth: true, token: token, user: user });
	});
})

router.get('/v1/getusers', (req, res) => {
	db.selectAll((err, rows) => {
		let response = rows
		res.status(200).send({ rows: rows });
	});
})

router.get('/v1/getposts', (req, res) => {
	db.selectAllPosts((err, rows) => {
		let response = rows
		res.status(200).send({ rows: rows });
	});
})

router.post('/v1/editor/save', function(req, res) {
	db.insertPost([
		req.body.title, 
		req.body.timestamp, 
		req.body.author, 
		req.body.link, 
		req.body.cover_image,
		req.body.html, 
		req.body.json
	],
	function (err) {
		if (err) { 
			console.error(err.message)
			return res.status(500).send("There was a problem saving your post.")
		}
		return res.send("Saved succesfully")
	}); 
})

router.post('/v1/editor/update', function(req, res) {
	db.updatePost([
		req.body.title, 
		req.body.last_changed, 
		req.body.cover_image, 
		req.body.html, 
		req.body.json,
		req.body.link,
		req.body.id
	],
	function (err) {
		if (err) {
			console.error(err.message)
			return res.status(500).send("There was a problem updating your post.");
		}
		res.status(200).send("200 OK");
	}); 
});

router.post('/v1/deletepost', function(req, res) {
	db.deletePost([
		req.body.id
	],
	function (err) {
		if (err) {
			console.error(err.message)
			return res.status(500).send("There was a problem deleting your post.");
		}
		res.status(200).send("200 OK");
	}); 
});

router.post('/v1/getpostbylink', (req, res) => {
	db.selectByLink(req.body.link, (err, post) => {
		if (err) return res.status(500).send('Error on the server.');
		if (!req.body.link) return res.status(404).send('Empty query.');
		res.status(200).send({post: post});
	});
})

router.post('/v1/update-user', function(req, res) {
	db.updateUser([
		req.body.is_admin,
		req.body.is_disabled,
		req.body.id,
	],
	function (err) {
		if (err) return res.status(500).send("There was a problem updating the user.");
		res.status(200).send("200 OK");
	}); 
});

router.post('/v1/delete-user', function(req, res) {
	db.deleteUser([
		req.body.id
	],
	function (err) {
		if (err) return res.status(500).send("There was a problem deleting the user.");
		res.status(200).send("200 OK");
	}); 
});

app.use(router)

app.use(fileUpload({
    createParentPath: true
}));

app.post('/upload', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let file = req.files.file;
  let timestamp = Math.floor(Date.now()/60000);
  file.mv('./public/uploads/' + timestamp + '-' + file.name, function(err) {
    if (err)
      return res.status(500).send(err);
    res.send({
        status: true,
        src: 'http://185.209.31.165:8080/uploads/' + timestamp + '-' + file.name        
    });
  });
});

let port = process.env.PORT || 3000;

let server = app.listen(port, function() {
	console.log('Express server listening on port ' + port)
});