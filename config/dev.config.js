module.exports = {
  mongodb: {
    uri: 'mongodb://localhost:27017/phoneBook',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
  },
  confirmationMail: {
    service: 'gmail',
    sender: 'ad13.test@gmail.com',
    pass: 'xqmleacfpcyashoa',
    tokenSecret: 'confirmationMailTokenSecret',
    tokenExpiration: '1d'
  },
};
