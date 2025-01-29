require("dotenv").config();

const token = process.env.TOKEN;

if (!token) {
  console.error("Token is missing from environment variables.");
} else {
  console.log("Token loaded:", token.slice(0, 10) + "...");
}
