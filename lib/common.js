const crypto =  require('crypto');



module.exports={
    MD5_SUFFIX:'!@#adasda!@#asdad!!asdasd!dasda#!',
    md5:function(str){
        var obj = crypto.createHash('md5');
        obj.update('str'+this.MD5_SUFFIX);
        return obj.digest('hex');
    }
}