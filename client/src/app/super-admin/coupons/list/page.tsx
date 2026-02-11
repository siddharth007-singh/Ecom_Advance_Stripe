"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { useCouponStore } from "@/store/useCouponStore";
import { toast } from "sonner";



type Props = {}

const SuperAdminCouponsListPage = (props: Props) => {

  const { couponList, fetchCoupons, deleteCoupon, isLoading } = useCouponStore();
  const router = useRouter();
  

  useEffect(() => {

  }, []);


  const handleDeleteCoupon = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this coupon?");
    if (!confirmed) return;
    const res = await deleteCoupon(id);
    if (res) {
      toast.success("Coupon deleted successfully");
      fetchCoupons();
    }

  }

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-bold">All Coupons</h1>
          <Button onClick={() => router.push("/super-admin/coupons/add")}>
            Add New Coupon
          </Button>
        </header>

        {isLoading ? (
          <p>Loading coupons...</p>
        ) : couponList.length === 0 ? (
          <p>No coupons found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {couponList.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <p className="font-semibold">{coupon.code}</p>
                  </TableCell>
                  <TableCell>
                    <p>{coupon.discountPercentage}%</p>
                  </TableCell>
                  <TableCell>
                    <p>
                      {coupon.usageCount}/{coupon.usageLimit}
                    </p>
                  </TableCell>
                  <TableCell>
                    {format(new Date(coupon.startDate), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(coupon.endDate), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        new Date(coupon.endDate) > new Date() ? "default" : "secondary"
                      }
                    >
                      {new Date(coupon.endDate) > new Date() ? "Active" : "Expired"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}

export default SuperAdminCouponsListPage