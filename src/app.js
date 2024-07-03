const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { body } = require('express-validator');

const ExamDash = require('./modules/ExamDashboard/ExamDash');
const userActivity = require('./modules/UserActivityLog/UserActivity'); 
const certificateRouter = require('./modules/DCertificate/Certificate');

const authController = require('./modules/auth/auth-controller'); //check the route

const addQuestionController = require("./routes/AddQuestions_Lehaan");
const viewResult = require("./routes/ViewResult");
const submitQuiz = require("./routes/SubmitQuiz");
const getAttemptedQuizzes = require("./routes/GetQuizAttempt")
const createQuiz = require("./routes/CreateQuiz");
const createCandidate = require("./routes/CreateCandidate")
const authRouter = require("./routes/auth");
const { createCheckoutSession, getSessionStatus } = require('./modules/Payment/stripe-integration');

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' })); //accepting request from cross-origin
app.use(bodyParser.json());

app.use( '/api/auth', authRouter );

app.post('/create-checkout-session', createCheckoutSession);
app.get('/session-status', getSessionStatus);


// Lehaan
app.use('/addQA', addQuestionController);
app.use('/viewResult', viewResult);
app.use('/attempt', submitQuiz);
app.use('/getattempts', getAttemptedQuizzes);
app.use('/newquiz', createQuiz);
app.use('/candidate', createCandidate);

app.use('/certificates', certificateRouter);

//Banu

module.exports = app; 

