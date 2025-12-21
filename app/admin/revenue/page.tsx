"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { revenueAPI } from "@/lib/api"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination } from "@/components/ui/pagination"
import { useSession } from "next-auth/react"

export default function RevenuePage() {
  const [page, setPage] = useState(1)
  const limit = 10
  const { data: session } = useSession()

  const { data, isLoading } = useQuery({
    queryKey: ["revenue", page],
    queryFn: async () => {
      if (!session?.accessToken) throw new Error("No token")
      const response = await revenueAPI.getRevenueFromSellers(session?.accessToken, page, limit)
      return response.data.data
    },
    enabled: !!session?.accessToken,
  })

  return (
    <div>
      <Header title="Revenue from Seller" breadcrumbs={[{ label: "Dashboard" }, { label: "Revenue from Seller" }]} />

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue from Sellers</CardTitle>
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
                        <th className="text-left py-3 px-4 font-semibold">Seller ID</th>
                        <th className="text-left py-3 px-4 font-semibold">Product ID</th>
                        <th className="text-left py-3 px-4 font-semibold">Revenue from Seller</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.revenueData || []).map((item: any, index: number) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{item.sellerId}</td>
                          <td className="py-3 px-4">111111111</td>
                          <td className="py-3 px-4">${item.totalRevenue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, data?.pagination?.total || 0)} of{" "}
                    {data?.pagination?.total || 0} results
                  </p>
                  <Pagination currentPage={page} totalPages={data?.pagination?.pages || 1} onPageChange={setPage} />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
