import { Suspense } from "react";
import SuperAdminAddProductClient from "./SuperAdminAddProductClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <SuperAdminAddProductClient />
    </Suspense>
  );
}