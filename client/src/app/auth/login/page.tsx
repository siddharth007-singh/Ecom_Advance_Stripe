"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner"
import { Loader2 } from "lucide-react";
import { protectLoginAction } from "@/actions/auth";

type Props = {}

const LoginPage = (props: Props) => {
  const {login, isLoading} = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const checkFristLevelOfValidation = await protectLoginAction(formData.email);
    if(!checkFristLevelOfValidation.success) return toast.error(checkFristLevelOfValidation.error || "Invalid email");

    const success = await login(formData.email, formData.password);
    if(success) {
      toast.success("Login successful!");

      // getting user role from zustand store directly
      const user = useAuthStore.getState().user;
      router.push(user?.role === "SUPER_ADMIN" ? "/super-admin" : "/home");
    }

    console.log("Form Submitted:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Advance Ecommerce</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full rounded-full text-lg text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90">
              Login
            </Button>
            <p className="text-center text-[#3f3d56] text-sm">
              New Here? <Link href={"/auth/register"} className="text-[#000] hover-underline font-bold">SignUp</Link>
            </p>
          </form>
        </CardContent>
      </Card> 
    </div>
  )
}

export default LoginPage