const AccessTokenOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
  // sameSite: "Strict",
  maxAge: 24 * 60 * 60 * 1000,
};
const RefreshTokenOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
  // sameSite: "Strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
export {AccessTokenOptions,RefreshTokenOptions};
