import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import Joi from "joi";
import { user, UserRole } from "../../model/user";
import { product } from "../../model/product";
import { transaction } from "../../model/transaction";

const { successResponse, errorResponse, validationResponse } = require("../../utils/response");

const userRepository = AppDataSource.getRepository(user);
const productRepository = AppDataSource.getRepository(product);
const transactionRepository = AppDataSource.getRepository(transaction);

export const createTransaction = async (req: Request, res: Response) => {
  const createTransactionSchema = (input) =>
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().min(1).required()
    }).validate(input);

  try {
    const body = req.body;
    const schema = createTransactionSchema(body);

    if ('error' in schema) {
      return res.status(422).send(validationResponse(schema));
    }

    const userAccess = await userRepository.findOneBy({ id: req.jwtPayload.id });
    if (!userAccess || userAccess.role !== UserRole.CUSTOMER) {
      return res.status(403).send(errorResponse("Access Denied: Only CUSTOMER can make transactions", 403));
    }

    const productToOrder = await productRepository.findOneBy({ id: body.productId });
    if (!productToOrder) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    const currentStock = productToOrder.quantity;
    const orderedQty = body.quantity;

    if (orderedQty > currentStock) {
      return res.status(400).json({ message: `Stok tidak mencukupi. Stok tersedia: ${currentStock}` });
    }

    // Hitung total harga
    const pricePerItem = parseFloat(productToOrder.price.toString());
    const totalAmount = pricePerItem * orderedQty;

    // Kurangi stok produk
    productToOrder.quantity = currentStock - orderedQty;
    await productRepository.save(productToOrder);

    // Simpan transaksi
    const newTransaction = new transaction();
    newTransaction.user = userAccess;
    newTransaction.product = productToOrder;
    newTransaction.nameProduct = productToOrder.nameProduct;
    newTransaction.descriptionProduct = productToOrder.descriptionProduct;
    newTransaction.price = productToOrder.price;
    newTransaction.quantityOrder = orderedQty;
    newTransaction.maxAmount = totalAmount;

    await transactionRepository.save(newTransaction);

    return res.status(201).send(successResponse("Transaksi berhasil dibuat", {
      transaction: newTransaction,
      sisaStok: productToOrder.quantity
    }, 201));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


