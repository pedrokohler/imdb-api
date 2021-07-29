export default (callback) => async (req, res, next) => {
  try {
    await callback(req, res, next);
    next();
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
