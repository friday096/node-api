const USER = require('../model/userModel')
const constant = require('../utils/constant')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const multer = require('multer')
var randtoken = require('rand-token').generator();
const dotenv = require('dotenv');


exports.signup = async (req, res) => {
    try {
        let data = req.body
        console.log('req.body', data)
    } catch (err) {
        res.send({
            status: constant.error_code,
            message: err.message
        })
    }
}