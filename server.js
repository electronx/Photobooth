const app = require('./app');
const dotenv = require('dotenv');
const { mongo, default: mongoose } = require('mongoose');

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`I am listening on the port ${port}`);
});

const main = async () => {
  const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
  );

  await mongoose.connect(DB);

  console.log('DB connection successful');
};

main();
