import UserController from "./controllers/user.controller";
import MovieController from "./controllers/movie.controller";

const routeControllerPairs = [
  ["/movie", MovieController],
  ["/user", UserController],
];

const routes = (app) => {
  routeControllerPairs.forEach((route) => {
    const [url, controller] = route;
    app.use(url, controller);
  });
};

export default routes;
