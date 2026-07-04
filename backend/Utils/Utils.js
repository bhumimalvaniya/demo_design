/*export const generateToken=(user,message,statusCode,res)=>{
    const token=user.generateJsonWebToken();
    const cookieName=user.role==='Admin'?'adminToken':'userToken';

    res
    .status(statusCode)
    .cookie(cookieName,token,{
        expires:new Date(
            Date.now()+process.env.COOKIE_EXPIRE *24 *60*60*1000
        ),
        httpOnly:true,
    })
    .json({
        success:true,
        message,
        user,
        token,
    });
};
*/


import jwt from "jsonwebtoken";

const generateToken = (user, message, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res
    .cookie("accessToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    })
    .status(statusCode)
    .json({
      success: true,
      message,
      token,
    });
};

export default generateToken;