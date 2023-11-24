const USER = require('../model/userModel');
const POST = require('../model/postModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const randtoken = require('rand-token').generator();
const multer = require('multer');
const constant = require('../utils/constant');
const path = require('path')
const mongoose = require('mongoose');
const fs = require('fs'); // Add this line

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, `../uploads/images`));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname)
    },
  });
  
  const upload = multer({ storage: storage });
  
  // Multer middleware to handle file upload
  const uploadMiddleware = upload.single('image');


module.exports = {
    createUser: async (data, callback) => {
        try {
            // Check Email
            let checkUserEmail = await USER.findOne({ email: data.email });

            // Check Username
            let checkUsername = await USER.findOne({ nickname: data.nickname });

            if (checkUserEmail) {
                callback({
                    status: constant.error_code,
                    message: 'Email is already exist with this email',
                }, null);
            } else if (checkUsername) {
                callback({
                    status: constant.error_code,
                    message: 'Username is already exist with this username',
                }, null);
            } else {
                let hash = bcrypt.hashSync(data.password, 10);
                data.password = hash;

                let saveUser = await new USER(data).save();

                if (!saveUser) {
                    callback({
                        status: constant.error_code,
                        message: 'Unable to signup the user',
                    }, null);
                } else {
                    const jwtToken = jwt.sign(
                        {
                            _id: saveUser._id,
                            nickname: saveUser.nickname,
                            firstname: saveUser.firstname,
                            lastname: saveUser.lastname,
                            email: saveUser.email,
                            status: saveUser.status,
                        },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: '365d' }
                    ); let criteria = { _id: saveUser._id };
                    let newValue = {
                        $set: {
                            jwtToken: jwtToken,
                        },
                    };
                    let option = { new: true };
                    let updateUser = await USER.findOneAndUpdate(criteria, newValue, option, { password: 0 }); // Exclude password from the result
                    let checkDetail = await USER.findOne({ email: data.email }, { password: 0 }); // Exclude password from the result

                    if (!updateUser) {
                        callback({
                            status: constant.error_code,
                            message: 'Unable to create the user token',
                        }, null);
                    } else {
                        const result = {
                            _id: checkDetail._id,
                            nickname: checkDetail.nickname,
                            firstname: checkDetail.firstname,
                            lastname: checkDetail.lastname,
                            email: checkDetail.email,
                            status: checkDetail.status,
                            jwtToken: checkDetail.jwtToken,
                        };
                        callback(null, {
                            data: result,
                        });
                    }
                }
            }
        } catch (err) {
            callback({
                status: constant.error_code,
                message: err.message,
            }, null);
        }
    },
    loginUser: async (data, callback) => {
        try {
            // Find the user by email
            const user = await USER.findOne({ email: data.email });
            if (!user) {
                callback({
                    status: constant.error_code,
                    message: 'Invalid email or password',
                }, null);
            } else {

                const isValidPassword = await bcrypt.compare(data.password, user.password);

                if (!isValidPassword) {

                    callback({
                        status: constant.error_code,
                        message: 'Invalid email or password',
                    }, null);
                } else {
                    // Password is correct, generate a JWT token
                    const jwtToken = jwt.sign(
                        {
                            _id: user._id,
                            nickname: user.nickname,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            email: user.email,
                            status: user.status,
                        },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: '365d' }
                    );

                    // Update user with the new JWT token (excluding password from the result)
                    const updateUser = await USER.findOneAndUpdate(
                        { _id: user._id },
                        { $set: { jwtToken } },
                        { new: true, projection: { password: 0 } }
                    );

                    if (!updateUser) {
                        callback({
                            status: constant.error_code,
                            message: 'Unable to create the user token',
                        }, null);
                    } else {
                        callback(null, {
                            data: updateUser,
                        });
                    }
                }
            }
        } catch (err) {
            callback({
                status: constant.error_code,
                message: err.message,
            }, null);
        }
    },
    createPost: async (req, res, callback) => {
        try {
          
          uploadMiddleware(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
              // A Multer error occurred when uploading.
              callback({
                status: constant.error_code,
                message: 'Error uploading image',
              }, null);
            } else if (err) {
              // An unknown error occurred when uploading.
              callback({
                status: constant.error_code,
                message: 'Unknown error uploading image',
              }, null);
            } else {
              // Successfully uploaded image
              const imagePath = req.file.filename;
              const data = req.body;

              if (!mongoose.Types.ObjectId.isValid(data.userID)) {
                fs.unlinkSync(req.file.path);
                callback({
                  status: constant.error_code,
                  message: 'UserId is not valid',
                }, null);
              }
            
              // Find the user by userID
              const user = await USER.findOne({ _id: data.userID });
                // Create a new post
                const newPost = new POST({
                  userId: user._id,
                  title: data.title,
                  subject: data.subject,
                  summary: data.summary,
                  youtubeLink: data.youtubeLink,
                  image: imagePath,
                });
      
                // Save the post to the database
                const savedPost = await newPost.save();
      
                callback(null, {
                  status: constant.success_code,
                  message: 'Post created successfully',
                  data: savedPost,
                });
              
            }
          });
        } catch (err) {
          callback({
            status: constant.error_code,
            message: err.message,
          }, null);
        }
      },
      
      
};
