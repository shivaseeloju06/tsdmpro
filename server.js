var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  morgan = require('morgan'),

  // Include models here
  Project = require('./api/models/ProjectModel'), 
  Testsuite = require('./api/models/TestsuiteModel'), 
  // Scenario = require('./api/models/ScenarioModel'),
  bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(morgan('dev'));

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/tsdmDB', {useNewUrlParser: true})
  .then(() => console.log("MongoDb Connected"))
  .catch(err => console.log(err)); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Import and register all routes here
var ProjectRoutes = require('./api/routes/ProjectRoutes');
ProjectRoutes(app);
var TestsuiteRoutes = require('./api/routes/TestsuiteRoutes');
TestsuiteRoutes(app);
//var ScenarioRoutes = require('./api/routes/ScenarioRoutes');
//ScenarioRoutes(app);

// Error handling
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.listen(port);

console.log('TSDM RESTful API server started on: ' + port);