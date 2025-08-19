import { ApiError } from "../utils/ApiError.js"

const authorizeRole=(...allowedRoles)=>{
    //this will simply check the role of the user login
    //this middleware will come after the verifyJwt
    //then this middleware will run
    //this will get access of req.user.role
    //using this we can create req.userRole and give this role value to it
    
    
    return async(req,res,next)=>{
        console.log(req.user)
        
        //role not included/present in the allowed role
        if(!allowedRoles.includes(req.user?.role?.trim())){
            throw new ApiError(403,"Forbidden: Insufficient rights->You Don't have permission to access this Api");
        }
        return next();
    }

}
export {authorizeRole}