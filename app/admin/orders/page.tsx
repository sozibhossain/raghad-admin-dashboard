"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { orderAPI } from "@/lib/api"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination } from "@/components/ui/pagination"
import { useSession } from "next-auth/react"

export default function OrdersPage() {
  const [page, setPage] = useState(1)
  const limit = 10
  const { data: session } = useSession()

  const { data, isLoading } = useQuery({
    queryKey: ["orders", page],
    queryFn: async () => {
      if (!session?.accessToken) throw new Error("No token")
      const response = await orderAPI.getOrders(session?.accessToken, page, limit)
      return response.data.data
    },
    enabled: !!session?.accessToken,
  })

  const totalPages = Math.ceil((data?.length || 0) / limit)

  return (
    <div>
      <Header title="Orders" breadcrumbs={[{ label: "Dashboard" }, { label: "Orders" }]} />

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-4 font-semibold">Product</th>
                        <th className="text-left py-3 px-4 font-semibold">Price</th>
                        <th className="text-left py-3 px-4 font-semibold">Delivery Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data || []).map((order: any) => (
                        <tr key={order._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 flex items-center gap-3">
                            {order.products?.[0]?.product?.images?.[0] && (
                              <img
                                src={order.products[0].product.images[0] || "/placeholder.svg"}
                                alt="Product"
                                className="w-8 h-8 rounded object-cover"
                              />
                            )}
                            {order.products?.[0]?.product?.name}
                          </td>
                          <td className="py-3 px-4">${order.totalPrice}</td>
                          <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, data?.length || 0)} of{" "}
                    {data?.length || 0} results
                  </p>
                  <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
