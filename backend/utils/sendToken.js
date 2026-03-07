// create token and save into cookie

export const sendToken = async (user, res, statusCode) => {
  const token = user.getJWTToken();

  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // In production (cross-origin: Vercel → Render) cookies MUST be:
    //   sameSite: "none" → allow cross-site requests
    //   secure: true     → required when sameSite is "none"
    // In development (same-origin via Vite proxy) use "lax" without secure
    sameSite: "none",
    secure: true,
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({ success: true, user, token });
};
