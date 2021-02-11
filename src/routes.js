import UserController from "./controllers/user.controller";
import MovieController from "./controllers/movie.controller";
import LoginController from "./controllers/login.controller";

const routeControllerPairs = [
  ["/movies", MovieController],
  ["/users", UserController],
  ["/login", LoginController],
];

const routes = (app) => {
  routeControllerPairs.forEach((route) => {
    const [url, controller] = route;
    app.use(url, controller);
  });
};

export default routes;
