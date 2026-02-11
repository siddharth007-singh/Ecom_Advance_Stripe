"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProductStore } from "@/store/useProductStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { ImageIcon, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Props = {}

const SuperAdminSettingPage = (props: Props) => {
  const [uploadedFiles, setuploadedFiles] = useState<File[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const pageLoadRef = useRef(false);

  const { banners, isLoading, fetchBanners, updateFeatureProducts, fetchFeatureProducts, featureProducts, addBanners } = useSettingsStore();
  const { products, fetchAllProductsForAdmin } = useProductStore();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setuploadedFiles((prevFiles) => [...prevFiles, ...fileArray]);
    }
  }

  const removeImage = (index: number) => {
    setuploadedFiles((prevFiles) =>
      prevFiles.filter((_, i) => i !== index)
    );
  }

  //1st 
  useEffect(() => {
    if (!pageLoadRef.current) {
      fetchBanners();
      fetchFeatureProducts();
      fetchAllProductsForAdmin();
      pageLoadRef.current = true;
    }
  }, [fetchBanners, fetchFeatureProducts, fetchAllProductsForAdmin]);


  const handleProductSelection = (productId: string) => {
      setSelectedProducts((prevSelected) => {
        if (prevSelected.includes(productId)) {
          return prevSelected.filter(id => id !== productId);
        }

        if (prevSelected.length >= 5) {
          toast.error("You can select up to 5 products only");
          return prevSelected;
        }

        return [...prevSelected, productId]
      })
  }

  const handleSaveChanges = async () => {
    if (uploadedFiles.length > 0) {
      const result = await addBanners(uploadedFiles);
      if (result) {
        setuploadedFiles([]);
        fetchBanners();
      }
    }

    const result = await updateFeatureProducts(selectedProducts);
    if (result) {
      toast.success("Settings updated successfully");
      fetchFeatureProducts();
    } else {
      toast.error("Failed to update settings");
    }
  }

  useEffect(() => {
  if (featureProducts) {
    setSelectedProducts(featureProducts.map(fp => fp.id));
  }
}, [featureProducts]); 

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Settings & Features</h1>
        </header>
        <div className="space-y-6">
          <div>
            <h2 className="mb-2">Feature Images</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label
                  htmlFor="image-upload"
                  className="flex items-center justify-center w-full h-32 px-4 transition border-2 border-gray-200 border-dashed rounded-md appearance-none cursor-pointer"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className="h-7 w-7 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Click to upload Feature Images
                    </span>
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </Label>
              </div>
            </div>
            {/* uploadeFile Preview */}
            <div className="grid grid-cols-4 gap-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Uploaded image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size={"icon"}
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 hidden group-hover:flex"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <h2 className="mb-2 font-bold text-sm">Current Banners</h2>
          <div className="grid grid-cols-4 gap-4">
            {banners.length === 0 ? (
              <p className="col-span-4 text-center text-gray-500">No banners available</p>
            ) : (
              banners.map((banner, index) => (
                <div key={banner.id} className="relative group">
                  <img
                    src={banner.imageUrl}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              ))
            )}
          </div>
          <div>
            <h2 className="mb-4">
              Select up to 5 products to feature on client panel
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <div
                  className={`relative p-4 border rounded-lg ${selectedProducts.includes(product.id)
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200"
                    }`}
                  key={product.id}
                >
                  <div className="absolute top-2 right-2">
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => handleProductSelection(product.id)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-gray-500" />
                      )}
                    </div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <p className="font-bold">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Button
              disabled={isLoading}
              onClick={handleSaveChanges}
              className="w-full"
            >
              {isLoading ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminSettingPage