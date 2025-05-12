import bcrypt from "bcryptjs";
import mongoose, {Schema, Document} from "mongoose";
import { messageI, messageSchema } from "./message";

interface userI extends Document {
    userName: string,
    email: string,
    password: string,
    avatar?: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isverified: boolean,
    isMessageAccepted: boolean,
    message: messageI[] ;
   createdAt: Date,
   updatedAt: Date
};

const userSchema : Schema <userI> = new Schema({
      userName: {
        type: String,
        required:[true, "username is required"],
        trim: true,
        unique: true
      },
      email: {
        type: String,
        required:[true, "Email address is required"],
        trim: true,
        unique: true,
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "Please enter a valid email address"
        ]
      },
      password: {
        type: String,
        required:[true, "Password is required"],
      },
      avatar: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtRs_rWILOMx5-v3aXwJu7LWUhnPceiKvvDg&s"
      },
      verifyCode: {
        type: String,
        required: true,
        maxlength: 6
      },
      verifyCodeExpiry: {
        type: Date,
        required: true
      },
      message:  [messageSchema],
      isMessageAccepted: {
        type: Boolean,
        default: true
    
      },
      isverified: {
        type: Boolean,
        default: false
      }
}, {timestamps: true})

userSchema.pre("save", async function (next) {
  if(this.isModified("password")) {
    const hashpassword =  await bcrypt.hash(this.password, 10)
    this.password = hashpassword;
  }
  next();
})
export const userModel = (mongoose.models.User as mongoose.Model<userI>) || mongoose.model("User", userSchema);
