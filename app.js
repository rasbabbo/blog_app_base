var express = require("express"),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  //add the handle to the 'db' model/index
  db = require('./models/index.js'),
  app = express();



app.set('view engine', 'ejs');


// Middleware

app.use(bodyParser.urlencoded());
app.use(methodOverride());
// app.use(express.static(_dirname + 'public'));
// app.set('views', __dirname + '/views')


//setup a route to listen for GET:
// app.get('/', function(req, res) {
//   res.send("Hola Ninos");
// })
//note a route requires both a method and a path

// app.get('/', function(req, res) {
//   //res.render will look for a file in the views folder - ie index
//   res.render('index', {
//     message: 'hola Mundo'
//   });
// });
    
//post and author values;

//just GETting values; nothing to amend
app.get('/authors', function(req, res) {
  db.author.findAll()
    .success(function(allAuthors) {
    res.render('authors/index', {authors: allAuthors});
  });
});


//find by id
app.get('/authors/:id', function (req, res) {
  //designate user supplied id
  var id = req.params.id;
  //where do we find id? - in the DB
  db.author.find(id)
  .success(function(foundAuthor) {//param name indicative of search
    //on completion of finding author; supply corroborating posts
    foundAuthor.getPosts()
    .success(function(foundPosts) {
      //redirect to show page queried info:
      res.render('authors/show', {
        author: foundAuthor,
        posts: foundPosts
      });
    });
  });
});


//find post by id (num?)
app.get('/posts/:id', function(req, res) {
  var id = req.params.id;
  //where do we find id - DB so:
  db.post.find(id)
  .success(function(foundPost){
    //what do we want it to do? - show results
    res.render('posts/show', {
      post: foundPost
    });
  });
});


//find author by user supplied id and author's post
app.get('authors/:id/posts/new', function(req, res){
  var id = req.params.id;
  //get author
  db.author.find(id)
  .success(function(foundAuthor){
    //direct to posts/new
    res.render('posts/new', {
      author: foundAuthor
    });
  });
});


//POST to the server a new blog post prganized by author id
//else how could you organize?
app.post('authors/:id/posts', function(res, req){
  var id = req.params.id;
  db.author.find(id)
  .success(function(foundAuthor){
    //need to import blog
    // var newPost = req.params.post - nope- just go to DB
    db.post.create(req.body.post) //creating new DB post w. bodyparser MW
    .success(function(newPost){ //newPost = db.post.create+req.body.post
      foundAuthor.addPost(newPost)
      .success(function(){
        res.redirect('/posts/' + newPost.dataValues.id);//sig of dataValues
      });
    });
  })
  .error(function(err){
    res.redirect('/authors');
  });
});




// app.post("/article/new", function(req, res){
//   var content = req.body.content;
//   var writerId = req.body.author;

//   db.post.create({
//     content: musings
//   }).success(function (postObj) {
//     db.author.find(writerId).success(function (authorObj) {
//       authorObj.addPost(postObj);
//       res.redirect('/');
//     });
//   });
// });

app.listen(3000, function(){
    console.log("CRAZY ASS SERVER on localhost:3000");
    });
