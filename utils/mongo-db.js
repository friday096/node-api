const mongoose = require('mongoose');

const connect = "mongodb+srv://santoshkonclick:PivPFtpxwuoU3BXE@cluster0.6yljbuc.mongodb.net/social?retryWrites=true&w=majority";

mongoose.connect(connect, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => { console.log('MongoDB connected'); })
  .catch((error) => console.error(`Error connecting to MongoDB: ${error}`));
