const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const BlogPost = require('./models/BlogPost');
const expressSession = require('express-session');
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');
const flash = require('connect-flash');


mongoose.connect('mongodb://localhost/blog_database');


global.loggedIn = null;



const app = new express();
const ejs = require('ejs');
app.set('view engine', 'ejs');
    


app.use(fileUpload());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use( (req, res, next) => {
    loggedIn = req.session.userId;
    next();
});
app.use(flash());

const validationMiddleware = require('./middleware/validationMiddleware');
app.use('/posts/store', validationMiddleware);

/* app.get('/', async (req, res)=> {
  //res.sendFile(path.resolve(__dirname, 'pages/index.html'));
    
  const blogposts = await BlogPost.find({});
  res.render('index', { blogposts: blogposts });
}); */



/* app.get('/about', function (req, res) {
  //res.sendFile(path.resolve(__dirname, 'pages/about.html'));
    res.render('about');
});
app.get('/contact', function (req, res) {
  //res.sendFile(path.resolve(__dirname, 'pages/contact.html'));
    res.render('contact');
}); */

/* app.get('/posts/new', function (req, res) {
    res.render('create');
}); */

const contactController = require('./controllers/contact');
app.get('/contact', contactController);

const aboutController = require('./controllers/about');
app.get('/about', aboutController);

const postController = require('./controllers/post');
app.get('/post', postController);

const newPostController = require('./controllers/newPost');
app.get('/posts/new', authMiddleware,newPostController);

const homeController = require('./controllers/home');
app.get('/', homeController);

const getPostController = require('./controllers/getPost');
app.get('/post/:id', getPostController);

const storePostController = require('./controllers/storePost');
app.post('/posts/store', authMiddleware, storePostController);

const newUserController = require('./controllers/newUser');
app.get('/auth/register',redirectIfAuthenticatedMiddleware, newUserController);

const storeUserController = require('./controllers/storeUser');
app.post('/users/register',redirectIfAuthenticatedMiddleware, storeUserController);

const loginController = require('./controllers/login');
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);

const loginUserController = require('./controllers/loginUser');
app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController);

const logoutController = require('./controllers/logout');
app.get('/auth/logout', authMiddleware, logoutController);

app.use((req, res) => {
    res.status(404).render('notfound');
});

/*
app.post("/posts/store", async (req, res) => {
  console.log("files:", JSON.stringify(req.files));
  console.log("body:", JSON.stringify(req.body));

  try {
    if (!req.files || !req.files.image) {
      return res.status(400).send("No image uploaded. Check form enctype and input name.");
    }

    const image = req.files.image;

    const uploadPath = path.resolve(__dirname, "public/img", image.name);

    await image.mv(uploadPath);

    await BlogPost.create({ ...req.body, image: "/img/" + image.name });

    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Upload failed");
  }
});


app.get ('/post/:id', async (req, res) => {
    const blogpost = await BlogPost.findById(req.params.id)
    res.render('post', { blogpost });
});
*/

app.listen(4000, function () {
  console.log('Server is listening on port 4000');
});