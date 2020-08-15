
import { Application } from "https://deno.land/x/oak/mod.ts";
import router from './routes/routes.ts';

const port = 3000;
const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.use((ctx) => {
  ctx.response.body = "Hello World!";
});



app.addEventListener("listen", () => {
  console.log(`Listening on localhost:${port}`);
});

app.listen({ port: port });