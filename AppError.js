class AppError extends Error{
    constructor(st,msg){
        super();
        this.message=msg;
        this.status=st;
    }
}

module.exports=AppError;