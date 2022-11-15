import express, {Request, Response, NextFunction} from 'express'
import path from 'path';

const app = express();

app.get('*', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({message: "frontend server online!"})
})

app.listen(3000, () => {
  console.log('serving frontend on port 3000...');
})