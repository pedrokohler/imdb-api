import { Router } from "express";

const SimpleController = Router();

SimpleController.get("/", async (req, res, next) => {
  try {
    res.status(200).json({ greeting: "Hello World!" });
  } catch (e) {
    next(e);
  }
});

export default SimpleController;
