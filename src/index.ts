import express, { Express, Request, Response } from 'express'
import { PORT } from './secret';
import { rootRouter } from './routes';

const app: Express = express();

app.use(express.json())
app.use('/api', rootRouter)

app.listen(PORT, () => {
  console.log('working!')
})