import { toast } from "sonner";
import supabase from "../config/helper";

export const resendVerificationEmail = async (email) => {
  try {
    const { error } = await supabase.auth.resend({ email, type: "signup" });

    if (error) {
      toast.error(error.message);
      console.error("Error resending verification email:", error.message);
    } else {
      toast.success(
        "Verification email resent successfully! Kindly check your Email",
      );
    }
  } catch (err) {
    console.error("An error occurred:", err.message);
  }
};
