var express = require('express'),
  cors = require('cors'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  morgan = require('morgan'),

  // Include models here
  Project = require('./api/models/ProjectModel'),
  Testsuite = require('./api/models/TestsuiteModel'),
  Workflow = require('./api/models/WorkflowModel'),
  Scenario = require('./api/models/ScenarioModel'),
  Transaction = require('./api/models/TransactionModel'),
  Gherkinstep = require('./api/models/GherkinstepModel'),
  Stepaction = require('./api/models/StepactionModel'),
  Action = require('./api/models/ActionModel'),
  Instruction = require('./api/models/InstructionModel'),
  Environment = require('./api/models/EnvironmentModel'),
  Keyvaluepair = require('./api/models/KeyvaluepairModel'),
  Dayaiteration = require('./api/models/DataiterationModel'),
  Tokenname = require('./api/models/TokennameModel'),
  bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/tsdmDB', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log("MongoDb Connected"))
  .catch(err => console.log(err));

// Import and register all routes here
var ProjectRoutes = require('./api/routes/ProjectRoutes');
ProjectRoutes(app);
var TestsuiteRoutes = require('./api/routes/TestsuiteRoutes');
TestsuiteRoutes(app);
var WorkflowRoutes = require('./api/routes/WorkflowRoutes');
WorkflowRoutes(app);
var ScenarioRoutes = require('./api/routes/ScenarioRoutes');
ScenarioRoutes(app);
var TransactionRoutes = require('./api/routes/TransactionRoutes');
TransactionRoutes(app);
var GherkinstepRoutes = require('./api/routes/GherkinstepRoutes');
GherkinstepRoutes(app);
var ImportRoutes = require('./api/routes/ImportRoutes');
ImportRoutes(app);
var ActionRoutes = require('./api/routes/ActionRoutes');
ActionRoutes(app);
var StepactionRoutes = require('./api/routes/StepactionRoutes');
StepactionRoutes(app);
var InstructionRoutes = require('./api/routes/InstructionRoutes');
InstructionRoutes(app);
var EnvironmentRoutes = require('./api/routes/EnvironmentRoutes');
EnvironmentRoutes(app);
var KeyvaluepairRoutes = require('./api/routes/KeyvaluepairRoutes');
KeyvaluepairRoutes(app);
var DataiterationRoutes = require('./api/routes/DataiterationRoutes');
DataiterationRoutes(app);
var TokennameRoutes = require('./api/routes/TokennameRoutes');
TokennameRoutes(app);
var DownloadRoutes = require('./api/routes/DownloadRoutes');
DownloadRoutes(app);

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