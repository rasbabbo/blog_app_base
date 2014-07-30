var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  //add the handle to the 'db' model/index
  db = require('./models/index.js'),
  app = express();



app.set('view engine', 'ejs');


// Middleware

app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(express.static(_dirname + 'public'));
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
app.get('/authors' function(req, res) {
  db.author.findAll()
    .success(function(allAuthors) {
    res.render('authors/index', {authors: allAuthors})
  })
});


//find by id
app.get('/authors/:id', function (req, res) {
  //designate user supplied id
  var id = req.params.id;
  db.author.find(id)
  .success(function(foundAuthor) {
    //on completion of finding author; supply corroborating posts
    foundAuthor.getPosts()
    .success(function(foundPosts) {
      //redirect to show page queried info:
      res.render('authors/show', {
        author: foundAuthor,
        posts: foundPosts
      })
    })
  })
});


app.get('/')




app.post("/article/new", function(req, res){
  var content = req.body.content;
  var writerId = req.body.author;

  db.post.create({
    content: musings
  }).success(function (postObj) {
    db.author.find(writerId).success(function (authorObj) {
      authorObj.addPost(postObj);
      res.redirect('/');
    });
  });
});
