"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SellerDetailsModalProps {
  seller: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SellerDetailsModal({ seller, open, onOpenChange }: SellerDetailsModalProps) {
  if (!seller) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Seller Details</DialogTitle>
          <DialogDescription>View complete seller information</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {seller.avatar?.url && (
              <img
                src={seller.avatar.url || "/placeholder.svg"}
                alt={seller.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div>
              <h3 className="font-semibold text-lg">{seller.name}</h3>
              <p className="text-sm text-gray-600">{seller.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{seller.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="font-medium">{seller.totalProducts}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="font-medium">{seller.totalOrders}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="font-medium">${seller.totalRevenue}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Join Date</p>
              <p className="font-medium">{new Date(seller.joinDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
