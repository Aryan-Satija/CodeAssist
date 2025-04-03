const mongoose = require('mongoose');
const User = require('../models/Users.js');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const bcrypt = require('bcrypt');
const util = require('util');
const promisify = util.promisify;
const {sendEmail} = require('./sendEmail.js')
dotenv.config();
exports.signup = async (req, res) => {
    try {
        const { firstName, 
                lastName, 
                email, 
                password, 
                lc_username,
                cf_username } = req.body;
        let cf_rating = 800, lc_rating = 1500, problemsSolved = 0
        if(!firstName || !lastName || !password || !lc_username || !cf_username){
            return res.status(400).json(
                { message: "Please fill in all fields" }
            );
        }
        try{
            let url = `https://codeforces.com/api/user.rating?handle=${cf_username}`
            const response = await axios.get(url)
            cf_rating = response.data.result.pop().newRating
        } catch(err){
            console.log(err);
            return res.status(400).json(
                { message: "Invalid Codeforces username" }
            );
        }
        try{
            let url = "https://leetcode.com/graphql"
            const ratingQuery = `
            query {
              userContestRanking(username: "${lc_username}") {
                rating
              }
            }
          `;
        
            const problemsQuery = `
                query {
                matchedUser(username: "${lc_username}") {
                    submitStats: submitStatsGlobal {
                    acSubmissionNum {
                        difficulty
                        count
                    }
                    }
                }
                }
            `;
            const ratingResponse = await axios.post(
              url,
              { query: ratingQuery },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            lc_rating = ratingResponse.data.data.userContestRanking?.rating || 0;
            const problemsResponse = await axios.post(
                url,
                { query: problemsQuery },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
            );
            problemsSolved = problemsResponse.data.data.matchedUser.submitStats.acSubmissionNum.find(
                (item) => item.difficulty === "All"
            )?.count || 0;
        } catch(err){
            console.log(err);
            return res.status(400).json(
                { message: "Invalid Leetcode username" }
            );
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            lc_username,
            cf_username,
            lc_rating,
            cf_rating,
            problemsSolved
        });
        await sendEmail(email,firstName);
        return res.status(200).json({
            success: true,
            message: 'User registered successfully'
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            success: true,
            message: "Something went wrong"
        })
    }
}
exports.sync = async(req, res) => {
    try {
        const {  email, 
                lc_username,
                cf_username } = req.body;
        let cf_rating = 800, lc_rating = 1500, problemsSolved = 0
        if(!email || !lc_username || !cf_username){
            return res.status(400).json(
                { message: "Please fill in all fields" }
            );
        }
        try{
            let url = `https://codeforces.com/api/user.rating?handle=${cf_username}`
            const response = await axios.get(url)
            cf_rating = response.data.result.pop().newRating
        } catch(err){
            console.log(err);
            return res.status(400).json(
                { message: "Invalid Codeforces username" }
            );
        }
        try{
            let url = "https://leetcode.com/graphql"
            const ratingQuery = `
            query {
              userContestRanking(username: "${lc_username}") {
                rating
              }
            }
          `;
        
            const problemsQuery = `
                query {
                matchedUser(username: "${lc_username}") {
                    submitStats: submitStatsGlobal {
                    acSubmissionNum {
                        difficulty
                        count
                    }
                    }
                }
                }
            `;
            const ratingResponse = await axios.post(
              url,
              { query: ratingQuery },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            lc_rating = ratingResponse.data.data.userContestRanking?.rating || 0;
            const problemsResponse = await axios.post(
                url,
                { query: problemsQuery },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
            );
            problemsSolved = problemsResponse.data.data.matchedUser.submitStats.acSubmissionNum.find(
                (item) => item.difficulty === "All"
            )?.count || 0;
        } catch(err){
            console.log(err);
            return res.status(400).json(
                { message: "Invalid Leetcode username" }
            );
        }

        const existingUser = await User.findOne({email});

        if(!existingUser){
            return res.status(400).json({
                success: false,
                message: "User doesn't exists"
            })
        }

        existingUser.lc_rating = lc_rating;
        existingUser.problems_solved = problemsSolved;
        existingUser.cf_rating = cf_rating;
        existingUser.save();

        return res.status(200).json({
            success: true,
            lc_rating: lc_rating,
            cf_rating: cf_rating,
            problems_solved: problemsSolved,
            message: 'Sync successful'
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            success: true,
            message: "Something went wrong"
        })
    }
}

exports.login = async(req, res)=>{
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: 'Please Fill up All the Required Fields'
            })
        } 
        
        const user = await User.findOne({ email });
        
        if(!user){
            return res.status(400).json({
                success: false,
                message: 'User doesn\'t exist.'
            })
        }
        
        const tmp = await bcrypt.compare(password, user.password)
        
        if(tmp){
            const token = jwt.sign(
                {email: user.email, id: user._id},
                process.env.SECRET_KEY,
                {
                    expiresIn: "24h"
                }
            );
            
            user.password = undefined;

            return res.status(200).json({
                success: true,
                user,
                token,
                message: "User login success"
            });
        }
        return res.status(400).json({
            success: false,
            message: "Wrong password"
        })
    } catch(err){
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}
exports.validateToken = async(req, res)=>{
    try{
        const token = req.header("Authorization")?.replace("Bearer ", "");
        console.log(token);
        if(!token){
            return res.status(400).json({
                success: false,
                message: 'Token is missing'
            });
        }

        try{
            const decode = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
            return res.status(200).json({
                success: true,
                message: 'Token is valid'
            })
        } catch(err){
            console.log(err);
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });        
        }
        next();
    } catch(err){
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}