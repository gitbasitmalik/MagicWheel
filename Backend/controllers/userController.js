
import { v4 as uuid } from "uuid";
import UsersSchema from "../model/UsersSchema.js";

export const addNewUserController = async (req, res) => {
  try {
    const { name, email, uid } = req.body;

    await UsersSchema.create({
      id: uuid(),
      name,
      email,
      uid,
      profile_img: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    });

    res.status(201).json({ message: "User Added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const findUserByEmailController = async (req, res) => {
  try {
    const { email } = req.body; 
console.log(email);
    const user = await UsersSchema.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user is found, return user data
    res.status(200).json({ message: "User found", ...user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};