const mongoose = require('mongoose');
const uri = 'mongodb+srv://admin123:password12345@cluster0.vrn8bkq.mongodb.net/interntrack?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri)
  .then(() => {
    console.log('SUCCESS_DB');
    process.exit(0);
  })
  .catch(err => {
    console.error('FAILED_DB', err.message);
    process.exit(1);
  });
