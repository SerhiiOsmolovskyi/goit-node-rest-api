import express from "express";
import authControllers from "../controllers/authControllers.js";
import { isEmptyBody } from "../middlewares/isEmptyBody.js";
import validateBody from "../decorators/validateBody.js";
import { authSignupSchema, authSigninSchema } from "../schemas/authSchema.js";
import authenticate from "../middlewares/authenticate.js";
import { updateSubscriptionSchema } from "../schemas/authSchema.js";
const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(authSignupSchema),
  authControllers.signup
);

authRouter.post(
  "/login",
  isEmptyBody,
  validateBody(authSigninSchema),
  authControllers.signin
);

authRouter.patch(
  "/users",
  authenticate,
  isEmptyBody,
  validateBody(updateSubscriptionSchema),
  authControllers.updateSubscription
);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.signout);

export default authRouter;
