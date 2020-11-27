import { serve } from "https://deno.land/std@0.79.0/http/server.ts";
import { Application, Context, Router, send } from 'https://deno.land/x/oak/mod.ts'
import { MongoClient } from "https://deno.land/x/mongo@v0.13.0/mod.ts";
import { viewEngine, engineFactory, adapterFactory, ViewConfig } from 'https://deno.land/x/view_engine/mod.ts';

import "https://deno.land/x/dotenv/load.ts";

import {addUser, getAllUsers, deleteUser} from './controllers/userControllers.ts'

const app = new Application();
const router = new Router();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();

app.use(viewEngine(oakAdapter, ejsEngine));




router.post('/addUser', addUser)
  .get('/getUsers', getAllUsers)
  .delete('/deleteUser/:id', deleteUser)

  // app.use(async (context, next) => {
  //   await send(context, context.request.url.pathname, {
  //   root: `${Deno.cwd()}/client`
  //    })
  //   next()
  // });

router.get('/', async (context: any, next) => {
  context.render('client/index.html')
})

app.use(router.routes());
app.use(router.allowedMethods());


await app.listen({ port: 8000 })