import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title:{type:String, required:true},
    subTitle:{type:String},
    description:{type:String, required:true},
    category:{type:String, required:true},
    image:{type:String, required:true},
    imageFileId:{type:String, default:""},
    attachments:{
        type:[{
            name:{type:String, required:true},
            url:{type:String, required:true},
            fileId:{type:String, default:""},
            size:{type:Number, default:0},
        }],
        default:[],
    },
    isPublished:{type:Boolean, required:true},
}, {timestamps:true});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
