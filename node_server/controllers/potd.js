const axios = require("axios");
const data = require('../data.json');
const rdmp = require('../roadmap.json');
const Users = require("../models/Users.js");
const query = `#graphql
query fetchQuestionsByTags(
  $categorySlug: String, 
  $limit: Int, 
  $skip: Int, 
  $filters: QuestionListFilterInput
) {
  problemsetQuestionList: questionList(
    categorySlug: $categorySlug
    limit: $limit
    skip: $skip
    filters: $filters
  ) {
    total: totalNum
    questions: data {
      acRate
      difficulty
      freqBar
      frontendQuestionId: questionFrontendId
      isFavor
      paidOnly: isPaidOnly
      status
      title
      titleSlug
      topicTags {
        name
        id
        slug
      }
      hasSolution
      hasVideoSolution
    }
  }
}`;

exports.fetchProblems = async (req, res) => {
  try {
    let { tags, limit=1000, skip = 0, email, rating = 1500 } = req.body;

    if (!tags || !Array.isArray(tags) || !email) {
      return res.status(400).json({ error: "Tags must be provided as an array." });
    }

    const user = await Users.findOne({email : email});
    if(!user){
      return res.status(401).json({error : "User not found."});
    }
    
    const oneDayInMillis = 24 * 60 * 60 * 1000; 
    const currentTime = new Date();
    const lastSolvedTime = new Date(user.lastSolved);
    if(currentTime - lastSolvedTime <= oneDayInMillis){
      return res.status(200).json({
        success: true,
        data: user.problemsOfTheDay
      })
    }
    for(let topic of rdmp){
      if(topic.topic === tags[0]){
        if(topic.p <= user.recentSolved){
          user.step += 1;
          user.recentSolved = 0;
        }
        break
      }
    }
    
    const filters = {
      tags,
    };
    const response = await axios.post(
      "https://leetcode.com/graphql",
      {
        query,
        variables: {
          categorySlug: "",
          limit,
          skip,
          filters,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Referer: "https://leetcode.com",
        },
      }
    );

    const result = response.data;

    if (result.errors) {
      return res.status(400).json({ errors: result.errors });
    }

    let formattedData = result.data.problemsetQuestionList.questions.map((question) => ({
      id: question.frontendQuestionId,
      title: question.title,
      slug: question.titleSlug,
      difficulty: question.difficulty,
      solved: false,
      rating: 0
    }));
    
    const difficultyMapping = {};
    data.forEach((item) => {
      difficultyMapping[item.ID] = item.Rating;
    });
    
    formattedData = formattedData.filter((question) => {
      const questionRating = difficultyMapping[question.id];
      return (
        questionRating === undefined || (
        questionRating >= rating - 200 &&
        questionRating <= rating + 200 )
      );
    });

    const shuffled = formattedData.sort(() => 0.5 - Math.random());
    const randomProblems = shuffled.slice(0, 5);
    user.problemsOfTheDay = randomProblems;
    user.lastSolved = new Date();
    await user.save();
    return res.status(200).json({ success: true, total: randomProblems.length, data: randomProblems });
  } catch (err) {
    console.error("Error:", err);

    if (err.response) {
      return res.status(err.response.status).json({
        error: err.response.data || "Error from LeetCode server",
      });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.increment = async(req, res) => {
    try {
      const {problem, timeTaken, email} = req.body;
      if(!problem || !timeTaken || !email){
        return res.status(400).json({
          success: false,
          message: 'All fields are mandatory'
        });
      }
      const user = await Users.findOneAndUpdate({email}, 
        {
          $inc:{
            recentSolved: 1
          }
        },
        {
          new: true
        }
      );
      return res.status(200).json({
        success: true, message: 'updated successfully'
      })
    } catch(err){
      return res.status(500).json({
        success: false,
        message: 'something went wrong'
      })
    }
}