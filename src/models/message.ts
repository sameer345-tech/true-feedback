import mongoose, {Schema} from "mongoose";


export interface messageI  {
  _id?:  mongoose.Types.ObjectId,
   content: string,
   createdAt: Date,
   
};

 export const messageSchema : Schema <messageI> = new Schema({
      
      content: {
        type: String,
        required: true
      },

      createdAt: {
        type: Date,
        required: true
      }
}, {timestamps: true})

export const messageModel = mongoose.models.Message as mongoose.Model<messageI> || mongoose.model("Message", messageSchema);
