import express from "express";
import { createUser, deleteUserById, getUserByEmail, getusers, updateUserById } from "../models/user.model";
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
        if (!existingUser) {
            return res.status(403).json({ message: 'Invalid email or  password!' });
        }
        const expectedHash = authentication(existingUser.authentication.salt, password);
        if (existingUser.authentication.password !== expectedHash) {
            return res.status(403).json({ message: 'Invalid email or  password!' });
        }
        const salt = random();
        existingUser.authentication.sessionToken = authentication(salt, existingUser._id.toString());
        await existingUser.save();
        res.cookie("userToken", existingUser.authentication.sessionToken, {
            domain: "localhost",
            path: "/"
        });
        return res.status(200).json(existingUser).end();
    } catch (error) {
        console.log("Error login user : ", error);
        res.status(500).json({ message: error.message });
    }
}


export const Users = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getusers();
        if (users.length == 0) {
            return res.status(404).json({ message: "No users found." });
        }

        return res.json({ users });

    } catch (error) {
        console.log("Error getting users", error);
        res.status(500).json({ message: error?.message })
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const id = req.params.id;
        const user = await deleteUserById(id);
        if (!user) {
            return res.status(404).json({ message: "user not deleted" });
        }
        return res.status(404).json({ message: "user deleted successfully " });

    } catch (error) {
        console.log("Error deleting user", error);
        res.status(500).json({ message: error?.message });
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const id = req.params.id;
        const { username, email } = req.body;
        if (!username || !email) {
            return res.status(400).json({ message: 'Missing required fields ' })
        }
        const user = await updateUserById(id, { username, email });
        if (!user) {
            return res.status(404).json({ message: "user not updated" });
        }
        return res.status(404).json({ message: "user updated successfully " });

    } catch (error) {
        console.log("Error user update", error);
        res.status(500).json({ message: error?.message });
    }
}



