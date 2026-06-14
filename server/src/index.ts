import { startServer } from "./server.ts";
import { env } from "../env.ts";

const app = await startServer();

app.listen(env.PORT, () => {
  console.log(`🚀 Server ready at http://${env.HOST}:${env.PORT}/graphql`);
});
