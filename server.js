const express = require('express');
const mongoose = require('mongoose');
const app = express();
const questionRouter = require('./src/routes/addQuestions')
const cors = require('cors');

app.use(express.json())

app.use(cors());

app.use('/questions' , questionRouter)


const URI = "mongodb://0.0.0.0:27017/Questions";

mongoose.connect(URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Add any additional logic here

  })
  .catch((error) => {
    console.error('Error connecting to MongoDB here:', error);
  });
  app.get('/', (req, res) => {
    res.send("hellllo")
})
 

    const port = 8000;
app.listen(port, () => {
    console.log('Server started on port ' + port);
});

