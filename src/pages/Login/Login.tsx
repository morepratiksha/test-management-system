import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { login } from "../../api/auth.api";
import { setAuth } from "../../utils/storage";

const schema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    try {
      const response = await login(values);
if (response.status !== "success" || !response.data?.token) {
          throw new Error(response.message || "Login failed.");
      }
      setAuth(response.data.token, response.data.user);
      toast.success("Login successful");
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please check your credentials."
      );
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__visual">
        <div className="auth-page__visual-content">
          <div className="brand-mark brand-mark--large">P</div>
          <h1>Manage assessments with confidence.</h1>
          <p>Create, organize and publish tests from one simple workspace.</p>
        </div>
      </div>
      <div className="auth-page__panel">
        <div className="auth-card">
          <div className="auth-card__brand"><div className="brand-mark">P</div><span>PrepRoute</span></div>
          <div className="auth-card__heading">
            <h2>Welcome back</h2>
            <p>Sign in with your company-provided credentials.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className="field">
              <label htmlFor="userId">User ID</label>
              <div className="input-with-icon">
                <UserRound size={18} />
                <input id="userId" placeholder="Enter your user ID" autoComplete="username" {...register("userId")} />
              </div>
              {errors.userId && <span className="field__error">{errors.userId.message}</span>}
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <LockKeyhole size={18} />
                <input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" autoComplete="current-password" {...register("password")} />
                <button type="button" className="input-action" onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="field__error">{errors.password.message}</span>}
            </div>
            <button className="button button--primary button--full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
