const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
  .then(() => {
    console.log('SUCCESS_DB');
    process.exit(0);
  })
  .catch(err => {
    console.error('FAILED_DB', err.message);
    process.exit(1);
  });
