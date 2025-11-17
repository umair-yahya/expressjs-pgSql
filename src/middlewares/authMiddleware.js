import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { users } from "../models/user.js";
import { eq } from "drizzle-orm";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.id));

    if (!user) return res.status(401).json({ message: "User not found" });
    const { password, ...userDetails } = user;

    req.user = userDetails;
    console.log('req.user :', req.user)
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;