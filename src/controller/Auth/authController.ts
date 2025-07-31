import { Request, Response } from "express";
import { user,UserRole } from "../../model/user";
import { AppDataSource } from "../../data-source";
import { JwtPayload } from "../../types/JwtPayload";
import { createJwtToken } from "../../utils/createJwtToken";
import Joi from "joi";
const { joiPasswordExtendCore } = require('joi-password')
const joiPassword = Joi.extend(joiPasswordExtendCore)


const { successResponse, errorResponse,validationResponse } = require('../../utils/response')

const userRepository = AppDataSource.getRepository(user)

export const fetch = async (req: Request, res: Response) => {
    try {
        const userFetch = await userRepository.findOneBy({ id: req.jwtPayload.id })

            return res.status(200).send(successResponse('User Authorized', { data: userFetch }, 200))

    } catch (error) {
        return res.status(400).send(errorResponse(error, 400))
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { userName, password } = req.body

        const user = await userRepository.findOne({
            where: {
                userName: userName
            }
        })

        if (!user) {
            return res.status(409).send(errorResponse('Incorect username', 409))
        }

        if (!user.checkIfPasswordMatch(password)) {
            return res.status(409).send(errorResponse('Incorect password', 409))
        }


        const jwtPayload: JwtPayload = {
            id: user.id,
            userName: user.userName,
            email : user.email,
            createdAt: user.createdAt,
        }

        const token = createJwtToken(jwtPayload)
        const data = { user, token }

        return res.status(200).send(successResponse("Login Success", { data: data }, res.statusCode))
    } catch (error) {
        return res.status(400).send(errorResponse(error, 400))
    }
}

export const register = async (req: Request, res: Response) => {
    const registerSchema = (input) => Joi.object({
        userName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: joiPassword
            .string()
            .minOfSpecialCharacters(1)
            .minOfLowercase(1)
            .minOfUppercase(1)
            .noWhiteSpaces()
            .required(),
        phone: Joi.string().min(10).max(15).required(),

    }).validate(input)
    try {
        const body = req.body
        const schema = registerSchema(req.body)

     if ('error' in schema) {
            return res.status(422).send(validationResponse(schema))
        }
        const user_email = await userRepository.findOneBy({ email: body.email })
        if (user_email) {
            return res.status(409).send(errorResponse("User Already Exists", 409))
        }


        // Create new user
        const newUser = new user();
        newUser.userName = body.userName;
        newUser.email = body.email;
        newUser.password = body.password;
        newUser.role = UserRole.CUSTOMER; // Default role is CUSTOMER
        newUser.hashPassword(); // Hash the password before saving
        await userRepository.save(newUser);

        const data = { user: newUser };

        return res.status(201).send(successResponse("Registration Success", { data: data }, 201));
    } catch (error) {
        return res.status(400).send(errorResponse(error, 400));
    }
};