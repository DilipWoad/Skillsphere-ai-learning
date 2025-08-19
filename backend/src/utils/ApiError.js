export class ApiError extends Error {
    constructor(statusCode,message="Somthing went wrong!!",errors=[]){
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;
    }
}