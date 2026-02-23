const otpFlowMiddlewre = (flow) => (req, res, next) => {
  req.flow = flow;
  next();
};

export default otpFlowMiddlewre;
