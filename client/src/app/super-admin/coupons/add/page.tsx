"use client"

import React from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCouponStore } from '@/store/useCouponStore';
import { toast } from 'sonner';
import { protectCouponFormAction } from '@/actions/coupon';

type Props = {}

const SuperAdminAddCouponPage = (props: Props) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: 0,
    startDate: "",
    endDate: "",
    usageLimit: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleCreateUniqueCoupon = async () => {
    const uniqueCode = 'COUPON-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setFormData((prev) => ({ ...prev, code: uniqueCode }));
  } 

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error("End date must be after start date");
      return;
    }

    const checkForCouponValidation = await protectCouponFormAction();
    if(!checkForCouponValidation) {
      toast.error("You are not allowed to perform this action");
      return;
    } 

     const couponData = {
      ...formData,
      discountPercentage: parseFloat(formData.discountPercentage.toString()),
      usageLimit: parseInt(formData.usageLimit.toString()),
    };

    await addCoupon(couponData);
    if(!error){
      toast.success("Coupon created successfully");
      router.push("/super-admin/coupons/list");
    }
  }


  const { isLoading, addCoupon, error } = useCouponStore();

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1>Create New Coupon</h1>
        </header>
        <form
          onSubmit={handleCouponSubmit}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-1"
        >
          <div className="space-y-4">
            <div>
              <Label>Start Date</Label>
              <Input
                value={formData.startDate}
                onChange={handleInputChange}
                name="startDate"
                type="date"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                value={formData.endDate}
                onChange={handleInputChange}
                name="endDate"
                type="date"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label>Coupon Code</Label>
              <div className="flex justify-between items-center gap-2">
                <Input
                  type="text"
                  name="code"
                  placeholder="Enter coupon code"
                  className="mt-1.5"
                  required
                  value={formData.code}
                  onChange={handleInputChange}
                />
                <Button type="button" onClick={handleCreateUniqueCoupon}>
                  Create Unique Code
                </Button>
              </div>
            </div>
            <div>
              <Label>Discount Percentage</Label>
              <Input
                type="number"
                name="discountPercentage"
                placeholder="Enter discount percentage"
                className="mt-1.5"
                required
                value={formData.discountPercentage}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label>Usage Limits</Label>
              <Input
                type="number"
                name="usageLimit"
                placeholder="Enter usage limits"
                className="mt-1.5"
                required
                value={formData.usageLimit}
                onChange={handleInputChange}
              />
            </div>
            <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading ? "creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SuperAdminAddCouponPage