"use client"

import { protectProductFormAction } from "@/actions/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProductStore } from "@/store/useProductStore";
import { brands } from "@/utils/config";
import { categories, colors, sizes } from "@/utils/config";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {}

interface FormState {
  name: string;
  brand: string;
  description: string;
  category: string;
  gender: string;
  price: string;
  stock: string;
}


const SuperAdminAddProductPage = (props: Props) => {
  const [formState, setFormState] = useState({
    name: "",
    brand: "",
    description: "",
    category: "",
    gender: "",
    price: "",
    stock: "",
  });

  const [selectedSizes, setSelectSizes] = useState<string[]>([]);
  const [selectedColors, setSelectColors] = useState<string[]>([]);
  const [selectedfiles, setSelectFiles] = useState<File[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const getCurrentEditedProductId = searchParams.get("id");  // if there is an id in the url, then we are in edit mode

  const isEditMode = !!getCurrentEditedProductId;

  const { createProduct, updateProduct, getProductById, isLoading, error } = useProductStore();

  useEffect(() => {
    if (isEditMode) {
      getProductById(getCurrentEditedProductId).then((product) => {
        if (product) {
          setFormState({
            name: product.name || "",
            brand: product.brand || "",
            description: product.description || "",
            category: product.category || "",
            gender: product.gender || "",
            price: product.price?.toString() || "0",
            stock: product.stock?.toString() || "0",
          });
          setSelectSizes(product.sizes || []);
          setSelectColors(product.colors || []);
        }
      });
    }
  }, [isEditMode, getCurrentEditedProductId, getProductById]);


  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  }

  const handleToggleSize = (size: string) => {
    setSelectSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleToggleColor = (color: string) => {
    setSelectColors((prev) => prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]);
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectFiles(Array.from(event.target.files));
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const checkFristlevelFormvalidation = await protectProductFormAction();

    if (!checkFristlevelFormvalidation) {
      toast.error("Please fill all the fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", formState.name);
    formData.append("brand", formState.brand);
    formData.append("description", formState.description);
    formData.append("category", formState.category);
    formData.append("gender", formState.gender);
    formData.append("price", formState.price);
    formData.append("stock", formState.stock);

    formData.append("sizes", selectedSizes.join(","));
    formData.append("colors", selectedColors.join(","));

    selectedfiles.forEach((file) => {
      formData.append("images", file);
    });

    if (isEditMode && getCurrentEditedProductId) {
      await updateProduct(getCurrentEditedProductId, formData);
    } else {
      await createProduct(formData);
    }

    if (!error) {
      router.push("/super-admin/products/list");
    } else {
      toast.error("Something went wrong");
    }
  };




  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Add Product</h1>
        </header>
        <form onSubmit={handleFormSubmit} className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          <div className="mt-2 w-full flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-400 p-12">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4 flex text-sm leadin-6 text-gray-600">
                <Label>
                  <span>Click to browse</span>
                  <input
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={handleFileChange}
                  />
                </Label>
              </div>
            </div>
            {selectedfiles.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedfiles.map((file, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      width={80}
                      height={80}
                      className="h-20 w-20 object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <Label>Product Name</Label>
              <Input
                name="name"
                placeholder="Product Name"
                className="mt-1.5"
                onChange={handleInputChange}
                value={formState.name}
              />
            </div>
            <div>
              <Label>Brand</Label>
              <Select
                value={formState.brand}
                onValueChange={(value) => handleSelectChange("brand", value)}
                name="brand"
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((item) => (
                    <SelectItem key={item} value={item.toLowerCase()}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Product Description</Label>
              <Textarea
                name="description"
                className="mt-1.5 min-h-[150px]"
                placeholder="Product description"
                onChange={handleInputChange}
                value={formState.description}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={formState.category}
                onValueChange={(value) => handleSelectChange("category", value)}
                name="category"
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((item) => (
                    <SelectItem key={item} value={item.toLowerCase()}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Gender</Label>
              <Select
                value={formState.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
                name="gender"
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="kids">Kids</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Size</Label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {sizes.map((item) => (
                  <Button
                    onClick={() => handleToggleSize(item)}
                    variant={
                      selectedSizes.includes(item) ? "default" : "outline"
                    }
                    key={item}
                    type="button"
                    size={"sm"}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label>Colors</Label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {colors.map((color) => (
                  <Button
                    key={color.name}
                    type="button"
                    className={`h-8 w-8 rounded-full ${color.class} ${selectedColors.includes(color.name)
                      ? "ring-2 ring-primary ring-offset-2"
                      : ""
                      }`}
                    onClick={() => handleToggleColor(color.name)}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label>Product Price</Label>
              <Input
                name="price"
                className="mt-1.5"
                placeholder="Enter Product Price"
                value={formState.price}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label>Stock</Label>
              <Input
                name="stock"
                className="mt-1.5"
                placeholder="Enter Product Stock"
                value={formState.stock}
                onChange={handleInputChange}
              />
            </div>
            <Button
              disabled={isLoading}
              type="submit"
              className="mt-1.5 w-full"
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SuperAdminAddProductPage