module.exports = {
  mongodb: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/prod',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
  },
  SALT_ROUNDS: 10,
  confirmationMail: {
    service: 'gmail',
    sender: 'ad13.test@gmail.com',
    pass: 'xqmleacfpcyashoa',
    tokenSecret: 'confirmationMailTokenSecret',
    tokenExpiration: '1d'
  },
};
