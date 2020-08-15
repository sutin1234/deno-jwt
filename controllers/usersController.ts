import { IUser } from './../models/user.interface.ts';
import { Response, Context } from "https://deno.land/x/oak/mod.ts";
import { users } from './../mock/users.ts';

import { validateJwt } from "https://deno.land/x/djwt/validate.ts";
import { makeJwt, setExpiration, Jose, Payload } from "https://deno.land/x/djwt/create.ts";

const key = 'werwerwertwt456734523423';
const header: Jose = {
    alg: "HS256",
    typ: "JWT",
};

export const getUsers = ({ response }: { response: Response }) => {
    response.body = users;
}
export const getUser = ({ params, response }: { params: any, response: Response }) => {
    const hasUser = users.find((user) => user.id == params.id)
    let status = 200;

    if (hasUser) {
        response.body = hasUser
    } else {
        response.body = [];
        status = 404;
    }
}
export const getUserLogin = async (ctx: Context) => {
    const body = await ctx.request.body();
    const userInfo: IUser = await body.value;

    if (userInfo.hasOwnProperty("username") && userInfo.hasOwnProperty("password")) {
        ctx.response.body = 'found'
        const payload: Payload = {
            iss: userInfo.username,
            exp: setExpiration(new Date().getTime() * 60 * 60 * 24)
        }
        const token = await makeJwt({ header, payload, key })

        if (token) {
            ctx.response.body = {
                user: userInfo,
                jwt: token
            };
            ctx.response.status = 200
        } else {
            ctx.response.body = { "error": "server internal error!" };
            ctx.response.status = 500;
        }

    } else {
        ctx.response.body = { "error": "Invalid request body!" };
        ctx.response.status = 400;
    }

}
export const authMiddleware = async (ctx: Context, next: any) => {
    const headers = ctx.request.headers;
    const authorization = headers.get('Authorization')
    if (!authorization) {
        ctx.response.body = {
            error: 'authorization header inavlid!'
        }
        ctx.response.status = 401
        return;
    }
    const jwt = authorization.split(' ')[1]
    if ((await validateJwt({ jwt, key, algorithm: header.alg })).isValid) {
        await next();
        return;
    }

    ctx.response.body = {
        error: 'invalid jwt token'
    }
    ctx.response.status = 401

}