// routes/transaction.route.ts
import { Router } from "express";
import { createTransaction } from "../../controller/transaction/transactionController";
import { checkJwt } from '../../utils/checkJwt'

const router = Router();

router.post("/create-transaction", [checkJwt,createTransaction]);

export default router;
