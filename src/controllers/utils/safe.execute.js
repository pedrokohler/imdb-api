export default (callback) => async (req, res, next) => {
  try {
    return next(await callback(req, res, next));
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
