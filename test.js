const mongoose = require('mongoose');
const BlogPost = require('./models/BlogPost');

mongoose.connect('mongodb://localhost/blog_database');

BlogPost.create({
  title: 'My First Blog Post',
  body: 'This is the content of my first blog post.'
})
.then(blogpost => {
  console.log(blogpost);
})
.catch(error => {
  console.error(error);
});