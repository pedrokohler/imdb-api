import UserController from "./controllers/user.controller";

const routeControllerPairs = [["/user", UserController]];

const routes = (app) => {
  routeControllerPairs.forEach((route) => {
    const [url, controller] = route;
    app.use(url, controller);
  });
};

export default routes;
