import  User  from "../Models/userModel.js";
import Lesson from "../Models/lessonModel.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { sendVerificationEmail } from "../mailtrap/mail.js";
import bcrypt from "bcryptjs";

export const signup = async(req,res)=>{
    const { name, email, password, role } = req.body;
    try {
        if(!name || !email || !password || !role){
            return res.status(400).json({ msg: "All fields are required" });
        }
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({msg:"User already exists"});
        }
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()

        const user = new User({
            name,
            email,
            password,
            role: role || 'student',
            verificationToken,
            verificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000 //24 hours
        })


        generateTokenAndSetCookie(res,user._id);

        sendVerificationEmail(email,verificationToken);

        await user.save();

        res.status(201).json({msg:"User created successfully, please check your email for verification link"})
    } catch (error) {
        console.log("error while signing up",error);
        res.status(500).json({msg:"Internal server error"});
    }
}

export const verifyEmail = async(req,res)=>{
    const {  code } = req.body;
    try {
        const user= await User.findOne({
            verificationToken:code,
            verificationTokenExpireAt:{$gt:Date.now()}});
        if(!user){
            return res.status(400).json({msg:"Invalid or expired verification token"});
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpireAt = undefined;
        await user.save();
        res.status(200).json({msg:"Email verified successfully"});
    } catch (error) {
        console.log("error while verifying email",error);
        res.status(500).json({msg:"Internal server error"});
    }
}

export const login = async(req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg:"User does not exist"});
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({msg:"password is incorrect"});
        }
        generateTokenAndSetCookie(res,user._id);
        res.status(200).json({ success: true, msg: "Login successful" });
    } catch (error) {
        console.log("error while logging in",error);
        res.status(500).json({msg:"Internal server error"});
    }
}

export const logout = async(req,res)=>{
    try {
        res.clearCookie("token");
        res.status(200).json({msg:"Logged out successfully"});
    } catch (error) {
        console.log("error while logging out",error); 
        res.status(500).json({msg:"Internal server error"}); 
    }
}

//checks if a user is authenticated
export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, msg: "User not found" });
        }

        res.status(200).json({ success: true, user: { ...user._doc } });
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};

//gets the profile of the authenticated user
export const getUserProfile = async(req,res)=>{
    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user){
            return res.status(400).json({msg:"User not found"});
        }
        res.status(200).json({
          user: {
            name: user.name,
            email: user.email,
            role: user.role,
            enrolledCourses: user.enrolledCourses,
          },
        });
    } catch (error) {
        console.log("error while getting user profile",error);
        res.status(500).json({msg:"Internal server error"});
    }
}

export const getInstructorDashboard = async (req, res) => {
    const user = await User.findById(req.userId);
  // Loads Middleware to check if the user is an instructor
  // Check if the user is an instructor Get all lessons created by this instructor
  const lessons = await Lesson.find({ instructor: user._id });

  // Calculate total students enrolled
  const totalStudents = lessons.reduce(
    (acc, lesson) => acc + lesson.enrolledStudents.length,
    0
  );

  // Calculate total revenue (simplified)
  const totalRevenue = lessons.reduce((acc, lesson) => {
    return acc + lesson.price * lesson.enrolledStudents.length;
  }, 0);

  res.json({
    sucess: true,
    data: {
      totalLessons: lessons.length,
      totalStudents,
      totalRevenue,
      lessons,
    },
  });
};