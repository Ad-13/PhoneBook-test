exports.getUserProfileDataCtrl = async (req, res, next) => {
  try {
    res.send({ data: req.user });
  } catch (error) {
    next(error);
  }
};
