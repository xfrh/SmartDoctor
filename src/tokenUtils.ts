
import { jwtDecode,JwtPayload } from "jwt-decode";

interface DecodedToken extends JwtPayload {
  exp: number;
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
     const decoded = jwtDecode(token);
     return decoded;
  } catch (error) {
    // token解码失败，可能是因为格式不正确等原因
    console.error('Error decoding token:', error.message);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decodedToken = decodeToken(token);
 

  if (!decodedToken || !decodedToken.exp) {
    return true; // 没有有效的过期时间信息，视为过期
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const expirationTime = decodedToken.exp;
  console.log("相差",expirationTime - currentTimestamp)
  // 检查token是否在60分钟内过期
  return expirationTime - currentTimestamp < 0;
};
