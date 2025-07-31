// routes/transaction.route.ts
import { Router } from "express";
import { createTransaction,getTransactionHistoryByCustomer } from "../../controller/transaction/transactionController";
import { checkJwt } from '../../utils/checkJwt'

const router = Router();

router.post("/create-transaction", [checkJwt,createTransaction]);
router.get("/get-transaction", [checkJwt,getTransactionHistoryByCustomer]);

export default router;
