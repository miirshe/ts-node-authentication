import express from "express";
import { createUser, getUserByEmail } from "../models/user.model";
import { authentication, random } from "../utils/helper.utils";

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields ' })
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(200).json({ message: "User already exist" })
        }
        const salt = random();
        const user = await createUser({
            username, email, authentication: {
                salt,
                password: authentication(salt, password)
            }
        })

        if (!user) {
            return res.status(404).json({ message: "User not create! " });
        }
        return res.status(200).json({ message: "User created successfully " });

    } catch (error) {
        console.log("Error registering user : ", error);
        res.status(500).json({ message: error.message });
    }
}

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Missing required fields ' });
        }
        const existingUser = await getUserByEmail(email).select('+authentication.salt + authentication.password');
        if(!existingUser){
            return res.status(403).json({ message: 'Invalid email or  password!' });
        }
        const expectedHash = authentication(existingUser.authentication.salt, password);
        if(existingUser.authentication.password !== expectedHash){
            return res.status(403).json({ message: 'Invalid email or  password!' });
        }
        const salt = random();
        existingUser.authentication.sessionToken = authentication(salt , existingUser._id.toString());
        await existingUser.save();
        res.cookie("userToken", existingUser.authentication.sessionToken , {
            domain : "localhost",
            path : "/"
        });
        return res.status(200).json(existingUser).end(); 
    } catch (error) {
        console.log("Error login user : ", error);
        res.status(500).json({ message: error.message });
    }
}