import express from 'express';

import {json} from 'body-parser';

import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@ijchatbotapp/common';
import { createReportRouter } from './routes/report';
// import { showChatsRouter } from './routes/show';
// import { indexChatsRouter } from './routes';

const app = express();

app.set('trust proxy', true);

app.use(json());

app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
)

// * verify user authentication
app.use(currentUser);

// * For handling event-srv routes
app.use(createReportRouter);
// app.use(showChatsRouter);
// app.use(indexChatsRouter);

// * It matches all requests which comes and will throw the NotFoundError class

/* 
* Here if we use async in the function then we have to use next() express
* function as next(new NotFoundError()); else we have to add a new module in import section which is import 'express-async-eerrors'
* to fix this break code

? app.all('*', async(req, res, next) => {
?   next(new NotFoundError());
? });
*/

app.all('*', async() => {
    throw new NotFoundError();
  });
  
  
  // * for handling error handling
  app.use(errorHandler);
  
  export { app };