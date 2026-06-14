import { app } from "./server.ts";
import { env } from "../env.ts";

app.listen(env.PORT, () => {
  console.log(
    `🚀 Server running in ${env.NODE_ENV} mode at http://${env.HOST}:${env.PORT}`,
  );
});
