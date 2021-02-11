import app from "./app";
import connect from "./services/mongo.connection.service";

(async () => {
  await connect();
})();

app.listen(3000);
