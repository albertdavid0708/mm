import { NextFunction, Request, Response, Router } from "express";
import { IUserService } from "../../services/IUserService";
import { IWalletService } from "../../services/IWalletService";
import { WalletCreatePayload, WalletParams } from "../../schema/wallet.schema";
import { body, param, validationResult } from "express-validator";
import { Chain } from "../../helper/enum";

export class WalletRouter {
  private readonly _router = Router();
  private readonly walletService: IWalletService;

  constructor(walletService: IWalletService) {
    this.walletService = walletService;
    this._configure();
  }

  get router() {
    return this._router;
  }

  private _configure() {
    this._router.post(
      "",
      [
        body("chain").notEmpty().isIn(Object.values(Chain)),
        body("numberOfWallet").notEmpty().isInt({ min: 0 }),
      ],
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
          const body: WalletCreatePayload = req.body;
          res.status(200).json(await this.walletService.createMultiple(body));
        } catch (error) {
          next(error);
        }
      }
    );

    this._router.get(
      "",
      // [
      //   param
      // ],
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
          const params: WalletParams = req.params as unknown as WalletParams;
          res.status(200).json(await this.walletService.getWallet(params));
        } catch (error) {
          next(error);
        }
      }
    );
  }
}
