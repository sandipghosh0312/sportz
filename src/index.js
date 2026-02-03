import express from 'express';
import { MatchesRouter } from './routes/matches.js';

const app = express();

// Use JSON middleware
app.use(express.json());

// Simple GET route
app.get('/', (req, res) => {
  res.send('Hello! Express server is running.');
});

app.use("/matches", MatchesRouter);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
