import { initServer } from "./app";
import serverConfig from "./config/serverConfig";

const init = async () => {
  const app = await initServer();
  app.listen(serverConfig.PORT, () =>
    console.log(`sever is listening to the port ${serverConfig.PORT}`)
  );
};

init();
