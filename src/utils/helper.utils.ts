import crypto from "crypto";
const SECRET_KEY = "miirshe-rest-api";
export const random = () => crypto.randomBytes(126).toString("base64");
export const authentication = (salt: string, password: string) => {
    return crypto.createHmac("sha256", [salt, password].join("/")).update(SECRET_KEY).digest("hex");
}