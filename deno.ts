import { serve } from "https://deno.land/std@0.79.0/http/server.ts";
import { Application, Context, Router } from 'https://deno.land/x/oak/mod.ts'
import { MongoClient  } from "https://deno.land/x/mongo@v0.13.0/mod.ts";

import "https://deno.land/x/dotenv/load.ts";

const router = new Router();

const client = new MongoClient;
client.connectWithUri(`mongodb+srv://Kanadets:${Deno.env.get("DB_PASSWORD")}@cluster0.cntyh.mongodb.net/test?retryWrites=true&w=majority`);

interface UserSchema  {
  _id: {
    $oid: string
  };
  username: string;
  password: string;
} 

const db = client.database('test')
const users = db.collection("users")

const addUser = async ({ request, response }: Context) => {
  const body = await request.body();

  if (!request.hasBody) {
    response.status = 404
    response.body = {
      success: false,
      message: 'No data provided',
    }
  }

  try {
    const { username, password } = await body.value;
    console.log(username, password)
    await users.insertOne({
      username,
      password,
    })
     response.body = {
      success: true,
      body: `Contact information was created for: ${username}`,
    }
    response.status = 201
  } catch (error) {
    console.log(error.message)
    response.body = error.message
    response.status = 500
  }
}

const getAllUsers = async ({ response }: Context) => {
  const data = await users.find()

  if (data) {
    response.body = data,
    response.status = 200
  } else {
    response.body = 'not found',
    response.status = 204
  }
}

const deleteUser = async ({ response, params }: Context | any) => {
  try {
    const { id } = params
    const fetchUser = await users.findOne({
      $oid: id
    })

    if (fetchUser) {
      await users.deleteOne({
        _id: { $oid: id }
      })

      response.body = {
        success: true,
        body: `User with id: ${id} was deleted`
      }
    }

    response.status = 204
  } catch (error) {
    response.body = {
      success: false,
      body: error.message,
    }

    response.status = 500
  }
}


router.post('/addUser', addUser).get('/getUsers', getAllUsers).delete('/deleteUser/:id', deleteUser)

router.get('/', (context: Context) => {
  context.response.body = 'Hello Deno!'
})

console.log(users)

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 })
console.log("LETS GOOOO")