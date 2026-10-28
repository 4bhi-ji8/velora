import app from './src/app.js';
import connectDB from './src/config/database.js';

const PORT = process.env.PORT || 3000;

try {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
} catch (error) {
  console.log('server failed to start', error.message);
}
