"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BuyerDetailsModalProps {
  buyer: any
  orderStats: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BuyerDetailsModal({
  buyer,
  orderStats,
  open,
  onOpenChange,
}: BuyerDetailsModalProps) {
  if (!buyer) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Buyer Details</DialogTitle>
          <DialogDescription>
            View complete buyer information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-4">
            <img
              src={buyer.avatar?.url || "/placeholder.svg"}
              alt={buyer.name}
              className="w-16 h-16 rounded-full object-cover"
            />

            <div>
              <h3 className="font-semibold text-lg">{buyer.name}</h3>
              <p className="text-sm text-gray-600">{buyer.email}</p>
              <p className="text-xs text-gray-500">
                ID: ...{buyer._id.slice(-6)}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="font-medium">{orderStats?.totalOrders ?? 0}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="font-medium">{orderStats?.pendingOrders ?? 0}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Processing Orders</p>
              <p className="font-medium">{orderStats?.processingOrders ?? 0}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Delivered Orders</p>
              <p className="font-medium">{orderStats?.deliveredOrders ?? 0}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Cancelled Orders</p>
              <p className="font-medium">{orderStats?.cancelledOrders ?? 0}</p>
            </div>

            <div className="col-span-2">
              <p className="text-sm text-gray-600">Join Date</p>
              <p className="font-medium">
                {new Date(buyer.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
