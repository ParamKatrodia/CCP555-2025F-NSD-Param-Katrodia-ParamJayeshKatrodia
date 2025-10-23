const Fragment = require('../../model/fragment');

module.exports = async (req, res, next) => {
  try {
    const ids = await Fragment.byUser(req.user);
    res.status(200).json({ status: 'ok', fragments: ids });
  } catch (err) {
    next(err);
  }
};