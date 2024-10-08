import dbConnect from "@/utils/dbConnect";
import User from "@/app/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  await dbConnect();

  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_SECRET);

    // Find the user in the database
    const user = await User.findById(decoded.userId);
    console.log("user", user);
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Respond with the user data (excluding the password)
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
          verified: user.verified,
          brandInfo: user.brandInfo,
          brandVerified: user.brandVerified,
          brandApplied: user.brandApplied,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Token verification failed:", err);
    return new Response(
      JSON.stringify({
        message: "Forbidden",
        error: err.message,
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
