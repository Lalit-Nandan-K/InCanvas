import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendEmail from "../configs/nodeMailer.js";

const getToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const getCookieOptions = () => {
  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.env.RENDER === "true" ||
    Boolean(process.env.RENDER_EXTERNAL_URL);
  return {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

const setAuthCookie = (res, token) => {
  res.cookie("token", token, getCookieOptions());
};

const sanitizeUser = (user) => {
  const safeUser = user.toObject ? user.toObject() : user;
  delete safeUser.password;
  return safeUser;
};

const getWelcomeEmailTemplate = (name) => ({
  subject: "Welcome to InCanvas",
  body: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Hi ${name},</h2>
      <p>Welcome to <b>InCanvas</b>. Your account is ready.</p>
      <p>Start by completing your profile and connecting with people.</p>
      <br/>
      <p>Thanks,<br/>InCanvas Team</p>
    </div>
  `,
});

export const register = async (req, res) => {
  try {
    const { full_name, email, username, password } = req.body;

    if (!full_name || !email || !password) {
      return res.json({
        success: false,
        message: "Full name, email and password are required",
      });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.json({ success: false, message: "Email already exists" });
    }

    let finalUsername =
      username?.trim() || email.split("@")[0].toLowerCase().trim();
    const existingUsername = await User.findOne({ username: finalUsername });
    if (existingUsername) {
      finalUsername = `${finalUsername}${Math.floor(Math.random() * 10000)}`;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email.toLowerCase().trim(),
      full_name: full_name.trim(),
      username: finalUsername,
      password: hashedPassword,
    });

    const token = getToken(user._id);
    setAuthCookie(res, token);

    // Email delivery should not block account creation.
    try {
      const { subject, body } = getWelcomeEmailTemplate(user.full_name);
      await sendEmail({
        to: user.email,
        subject,
        body,
      });
    } catch (mailError) {
      console.error("Welcome email failed:", mailError.message);
    }

    res.json({ success: true, user: sanitizeUser(user), token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user || !user.password) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = getToken(user._id);
    setAuthCookie(res, token);

    res.json({ success: true, user: sanitizeUser(user), token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const logout = async (_req, res) => {
  const { maxAge, ...clearOptions } = getCookieOptions();
  res.clearCookie("token", clearOptions);
  res.json({ success: true, message: "Logged out" });
};

export const me = async (req, res) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization || "").replace("Bearer ", "");

    if (!token) {
      return res.json({ success: true, user: null });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.json({ success: true, user: null });
    }

    if (!decoded?.userId) {
      return res.json({ success: true, user: null });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.json({ success: true, user: null });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
