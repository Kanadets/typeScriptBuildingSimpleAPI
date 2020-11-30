import { serve } from "https://deno.land/std@0.79.0/http/server.ts";
import { Application, Context, Router, send } from 'https://deno.land/x/oak/mod.ts'
import { MongoClient } from "https://deno.land/x/mongo@v0.13.0/mod.ts";

import "https://deno.land/x/dotenv/load.ts";

import {addUser, getAllUsers, deleteUser} from './controllers/userControllers.ts'

export const client = new MongoClient;
client.connectWithUri(`mongodb+srv://Kanadets:${Deno.env.get("DB_PASSWORD")}@cluster0.cntyh.mongodb.net/test?retryWrites=true&w=majority`);

const app = new Application();
const router = new Router();

router.post('/addUser', addUser)
  .get('/getUsers', getAllUsers)
  .delete('/deleteUser/:id', deleteUser)

router.get('/',  (context: Context) => {
  context.response.body = "Hello Deno"
})

app.use(router.routes());
app.use(router.allowedMethods());


await app.listen({ port: 8000 })