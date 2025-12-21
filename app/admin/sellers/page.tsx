"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sellerAPI } from "@/lib/api"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Pagination } from "@/components/ui/pagination"
import { SellerDetailsModal } from "@/components/modals/seller-details-modal"
import { DeleteConfirmDialog } from "@/components/modals/delete-confirm-dialog"
import { useSession } from "next-auth/react"

export default function SellersPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [selectedSeller, setSelectedSeller] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const limit = 10
  const { data: session } = useSession()

  const { data, isLoading } = useQuery({
    queryKey: ["sellers", page],
    queryFn: async () => {
      if (!session?.accessToken) throw new Error("No token")
      const response = await sellerAPI.getSellers(session?.accessToken, page, limit)
      return response.data.data
    },
    enabled: !!session?.accessToken,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (!session?.accessToken) throw new Error("No token")
      return sellerAPI.deleteSeller(id, session?.accessToken)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] })
      toast.success("Seller deleted successfully")
      setDeleteId(null)
    },
    onError: () => {
      toast.error("Failed to delete seller")
    },
  })

  const handleViewDetails = async (sellerId: string) => {
    try {
      if (!session?.accessToken) throw new Error("No token")
      const response = await sellerAPI.getSellerDetails(sellerId, session?.accessToken)
      setSelectedSeller(response.data.data)
    } catch (error) {
      toast.error("Failed to load seller details")
    }
  }

  return (
    <div>
      <Header title="Seller Profile" breadcrumbs={[{ label: "Dashboard" }, { label: "Seller Profile" }]} />

      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="">
              <CardTitle>All Sellers</CardTitle>
            </div>
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
                        <th className="text-left py-3 px-4 font-semibold">Seller Name</th>
                        <th className="text-left py-3 px-4 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.sellers || []).map((seller: any) => (
                        <tr key={seller._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{seller._id.slice(-6)}</td>
                          <td className="py-3 px-4 flex items-center gap-3">
                            {seller.avatar?.url && (
                              <img
                                src={seller.avatar.url || "/placeholder.svg"}
                                alt={seller.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            )}
                            {seller.name}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-orange-500 hover:text-orange-600"
                                onClick={() => handleViewDetails(seller._id)}
                              >
                                See Details
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => setDeleteId(seller._id)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
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

      <SellerDetailsModal
        seller={selectedSeller}
        open={!!selectedSeller}
        onOpenChange={(open) => !open && setSelectedSeller(null)}
      />

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
