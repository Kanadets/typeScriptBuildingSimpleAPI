import { MongoClient } from "https://deno.land/x/mongo@v0.13.0/mod.ts";
import { Context } from 'https://deno.land/x/oak/mod.ts'

import { UserSchema } from '../Schemas/userSchema.ts'

const client = new MongoClient;

const db = client.database('test')
const users = db.collection<UserSchema>("users")

export const addUser = async ({ request, response }: Context) => {
  const body = await request.body();

  const { username, password } = await body.value;

  try {
    if (!!username && !!password){
      await users.insertOne({
        username,
        password,
        createdAt: new Date()
      })  
       response.body = {
        success: true,
        body: `Contact information was created for: ${username}`,
      }
      response.status = 201
    } else {
      throw "You didn't provide username or password"
    } 
  } catch (error) {
    response.status = 500
    response.body = error
  }
}

export const getAllUsers = async ({ response }: Context) => {
  const data: UserSchema[] = await users.find();

  if (data) {
    response.body = data,
    response.status = 200
  } else {
    response.body = 'not found',
    response.status = 204
  }
}

export const deleteUser = async ({ response, params }: Context | any) => {
  try {
    const { id } = params
    const fetchUser = await users.findOne({
      _id: { $oid: id }
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