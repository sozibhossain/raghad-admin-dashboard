"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any | null;
  isLoading?: boolean;
  onSave: (values: {
    itemType: string[];
    brand: string[];
    condition: string[];
    color: string[];
  }) => void;
}

export function ItemTypeModal({
  open,
  onOpenChange,
  initialData,
  onSave,
  isLoading,
}: Props) {
  const [itemType, setItemType] = useState("");
  const [brand, setBrand] = useState("");
  const [condition, setCondition] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (initialData) {
      setItemType(initialData.itemType?.join(", ") || "");
      setBrand(initialData.brand?.join(", ") || "");
      setCondition(initialData.condition?.join(", ") || "");
      setColor(initialData.color?.join(", ") || "");
    } else {
      setItemType("");
      setBrand("");
      setCondition("");
      setColor("");
    }
  }, [initialData, open]);

  const handleSubmit = () => {
    onSave({
      itemType: itemType.split(",").map((v) => v.trim()),
      brand: brand.split(",").map((v) => v.trim()),
      condition: condition.split(",").map((v) => v.trim()),
      color: color.split(",").map((v) => v.trim()),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Item Type Configuration</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <label className="col-span-2 text-sm font-medium text-gray-700">
              itemType
            </label>
            <Input
              placeholder="Item types"
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
            />
          </div>
          <div>
            <label className="col-span-2 text-sm font-medium text-gray-700">
              brand
            </label>
            <Input
              placeholder="Brands (Nike, Adidas)"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
          <div>
            <label className="col-span-2 text-sm font-medium text-gray-700">
              condition
            </label>
            <Input
              placeholder="Conditions (New, Used)"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            />
          </div>

          <div>
            <label className="col-span-2 text-sm font-medium text-gray-700">
              color
            </label>
            <Input
              placeholder="Colors (Black, White)"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
