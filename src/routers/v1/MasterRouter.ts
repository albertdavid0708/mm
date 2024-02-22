import { Router } from "express";
import { UserRouter } from "./UserRouter";
import { WalletRouter } from "./WalletRouter";

export class MasterRouter {
  private readonly _router = Router();

  constructor(
    private readonly _userRouter: UserRouter,
    private readonly _walletRouter: WalletRouter
  ) {
    this._configure();
  }

  get router() {
    return this._router;
  }

  /**
   * Connect routes to their matching routers.
   */
  private _configure() {
    this._router.use("/user", this._userRouter.router);
    this._router.use("/wallets", this._walletRouter.router);
  }
}
