
import { connectDb } from './database/db.js';
import app from './app.js';


const PORT = process.env.PORT || 7000;

connectDb()
  .then(() => console.log('DB connected'))
  .catch((error) => console.error('DB connection failed:', error));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`);
});