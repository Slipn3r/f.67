"use strict";
const sqlite3 = require('sqlite3').verbose();

class Db {
	constructor(file) {
		this.db = new sqlite3.Database(file);
		this.createPostsTable()
		this.createUsersTable()
	}

	createPostsTable() {
		const sql = `
			CREATE TABLE IF NOT EXISTS posts (
				id integer PRIMARY KEY,
				link text,  
				title text, 
				timestamp integer, 
				last_changed integer,
				author text, 
				cover_image text,
				html text, 
				json text, 
				views integer, 
				comments integer)`
		return this.db.run(sql);
	}

	createUsersTable() {
		const sql = `
			CREATE TABLE IF NOT EXISTS users (
				id integer PRIMARY KEY, 
				name text, 
				email text UNIQUE, 
				user_pass text,
				is_admin integer,
				is_disabled integer)`
		return this.db.run(sql);
	}

	selectByEmail(email, callback) {
		return this.db.get(
			`SELECT * FROM users WHERE email = ?`,
			[email],function(err,row){
				callback(err,row)
			})
	}

	insertAdmin(user, callback) {
		return this.db.run(
			'INSERT INTO users (name,email,user_pass,is_admin) VALUES (?,?,?,?)',
			user, (err) => {
				callback(err)
			})
	}

	selectAll(callback) {
		return this.db.all(`SELECT * FROM users`, function(err,rows){
			callback(err,rows)
		})
	}

	insert(user, callback) {
		return this.db.run(
			'INSERT INTO users (name,email,user_pass) VALUES (?,?,?)',
			user, (err) => {
				callback(err)
			})
	}

	selectAllPosts(callback) {
		return this.db.all(`SELECT * FROM posts`, function(err,rows){
			callback(err,rows)
		})
	}

	selectByLink(link, callback) {
		return this.db.get(
			`SELECT * FROM posts WHERE link = ?`,
			[link],function(err,row){
				callback(err,row)
			})
	}

	selectById(id, callback) {
		return this.db.get(
			`SELECT * FROM posts WHERE id = ?`,
			[id],function(err,row){
				callback(err,row)
			})
	}

	insertPost(post, callback) {
		return this.db.run(
			'INSERT INTO posts (title, timestamp, author, link, cover_image, html, json) VALUES (?,?,?,?,?,?,?)',
			post, (err) => {
				callback(err)
			})
	}

	updatePost(post, callback) {
		return this.db.run(
			`UPDATE posts 
				SET title = ?, 
				last_changed = ?,
				cover_image = ?,
				html = ?,
				json = ?,
				link = ?
				WHERE id = ?`,
			post, (err) => {
				callback(err)
			})
	}

	deletePost(post, callback) {
		return this.db.run(
			'DELETE FROM posts WHERE id = ?',
			post, (err) => {
				callback(err)
			})
	}

	updateUser(user, callback) {
		return this.db.run(
			`UPDATE users 
				SET is_admin = ?, is_disabled = ?
				WHERE id = ?`,
			user, (err) => {
				callback(err)
			})
	}

	deleteUser(user, callback) {
		return this.db.run(
			'DELETE FROM users WHERE id = ?',
			user, (err) => {
				callback(err)
			})
	}
}

module.exports = Db