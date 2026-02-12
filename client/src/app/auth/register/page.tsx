"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { protectSignUpAction } from "@/actions/auth";
import { toast } from "sonner"
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Props = {}

const RegisterPage = (props: Props) => {

  const {register, isLoading} = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const checkFristLevelOfValidation = await protectSignUpAction(formData.email);
    if (!checkFristLevelOfValidation.success) {
      toast.error(checkFristLevelOfValidation.error || "An error occurred during registration.");
      return;
    }
    
    const userId = await register(formData.name, formData.email, formData.password);
    if(userId) {
      toast.success("Registration successful.");
      window.location.href = "/home"; 
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
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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
            <Button type="submit" disabled={isLoading} className="w-full rounded-full text-lg text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90">
              {isLoading ? <Loader2 className="animate-spin" /> : "Register" }
            </Button>
            <p className="text-center text-[#3f3d56] text-sm">
              Already have an account? <Link href={"/auth/login"} className="text-[#000] hover-underline font-bold">Login</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterPage