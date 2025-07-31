import { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { product } from "../../../model/product";
import { user, UserRole } from "../../../model/user";
import Joi from "joi";


const productRepository = AppDataSource.getRepository(product);
const userRepository = AppDataSource.getRepository(user);

const { successResponse, errorResponse,validationResponse } = require('../../../utils/response');

 
  

export const getAllProduct = async (req: Request, res: Response) => {
  try {
    const { nameProduct, minPrice, maxPrice,quantity } = req.query;

    const query = productRepository
      .createQueryBuilder("product")
      .orderBy("product.createdAt", "DESC");

    if (nameProduct) {
      query.andWhere("product.nameProduct LIKE :name", {
        name: `%${nameProduct}%`,
      });
    }

    if (quantity) {
      query.andWhere("product.quantity LIKE :name", {
        quantityProduct: `%${quantity}%`,
      });
    }

    if (minPrice && maxPrice) {
      query.andWhere("CAST(product.price AS UNSIGNED) BETWEEN :min AND :max", {
        min: Number(minPrice),
        max: Number(maxPrice),
      });
    }

    const result = await query.getMany();
    return res.status(200).send(successResponse("Get Product Success", { data: result }, 200));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await productRepository.findOneBy({ id });
    if (!result) return res.status(404).json({ msg: "Produk tidak ditemukan" });
    return res.status(200).send(successResponse("Get Product by ID Success", { data: result }, 200));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
const createProductSchema = (input) =>Joi.object({
    nameProduct: Joi.string().required(),
    descriptionProduct: Joi.string().required(),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().min(0).required(),

  }).validate(input);
  try {
    const body = req.body;
    const schema = createProductSchema(req.body)
     if ('error' in schema) {
            return res.status(422).send(validationResponse(schema))
        }


    const userAccess = await userRepository.findOneBy({ id: req.jwtPayload.id });
    if (!userAccess || userAccess.role !== UserRole.ADMIN) {
      return res.status(403).send(errorResponse("Access Denied: Only ADMIN can create product", 403));
    }
 const newProduct = new product();
    newProduct.nameProduct = body.nameProduct;
    newProduct.descriptionProduct = body.descriptionProduct;
    newProduct.price = body.price;
    newProduct.quantity = body.quantity;
    await productRepository.save(newProduct);



    return res.status(201).send(successResponse("Product created successfully", { data: newProduct }, 201));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
    const updateroductSchema = (input) =>Joi.object({
    nameProduct: Joi.string().required(),
    descriptionProduct: Joi.string().required(),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().min(0).required(),
  }).validate(input);
  try {
    const { id } = req.params;
    const body = req.body;
    const schema = updateroductSchema(req.body)

    if ('error' in schema) {
           return res.status(422).send(validationResponse(schema))
       }


    const userAccess = await userRepository.findOneBy({ id: req.jwtPayload.id });
    if (!userAccess || userAccess.role !== UserRole.ADMIN) {
      return res.status(403).send(errorResponse("Access Denied: Only ADMIN can update product", 403));
    }

    const productToUpdate = await productRepository.findOneBy({ id });
    if (!productToUpdate) {
      return res.status(404).json({ msg: "Produk tidak ditemukan" });
    }

    productToUpdate.nameProduct = body.nameProduct;
    productToUpdate.descriptionProduct = body.descriptionProduct;
    productToUpdate.price = body.price;
    productToUpdate.quantity = body.quantity;


    await productRepository.save(productToUpdate);

    return res.status(200).send(successResponse("Update Product Success", { data: productToUpdate  }, 200));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userAccess = await userRepository.findOneBy({ id: req.jwtPayload.id });
    if (!userAccess || userAccess.role !== UserRole.ADMIN) {
      return res.status(403).send(errorResponse("Access Denied: Only ADMIN can delete product", 403));
    }

    const productToDelete = await productRepository.findOneBy({ id });
    if (!productToDelete) {
      return res.status(404).json({ msg: "Produk tidak ditemukan" });
    }

    // Hapus permanen dari database
    await productRepository.remove(productToDelete);

    return res.status(200).send(successResponse("Product permanently deleted", { data: productToDelete }, 200));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
