import express from 'express';
 
const registerMiddleware = (req, res, next) => {
  console.log("Register middleware executed");
    next();
};
 
export default registerMiddleware;