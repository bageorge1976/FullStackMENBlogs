const BlogPost = require('../models/BlogPost');

module.exports = async (req, res) => {
  const blogposts = await BlogPost.find({}).populate('userid');
  console.log("req.session.userId:", req.session.userId);
  console.log("res.session:", req.session);
  res.render('index', { blogposts: blogposts });
};