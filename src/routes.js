import SimpleController from "./controllers/simple.controller";

const routeControllerPairs = [["/", SimpleController]];

const routes = (app) => {
  routeControllerPairs.forEach((route) => {
    const [url, controller] = route;
    app.use(url, controller);
  });
};

export default routes;
