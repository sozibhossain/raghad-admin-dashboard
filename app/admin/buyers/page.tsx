"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { buyerAPI } from "@/lib/api";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Pagination } from "@/components/ui/pagination";
import { BuyerDetailsModal } from "@/components/modals/buyer-details-modal";
import { DeleteConfirmDialog } from "@/components/modals/delete-confirm-dialog";
import { useAuth } from "@/lib/auth-context";
import { useSession } from "next-auth/react";

export default function BuyersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedBuyer, setSelectedBuyer] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const limit = 10;
  const { data: session } = useSession();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["buyers", page],
    queryFn: async () => {
      if (!session?.accessToken) throw new Error("No token");
      const response = await buyerAPI.getBuyers(
        session?.accessToken,
        page,
        limit
      );
      return response.data.data;
    },
    enabled: !!session?.accessToken,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (!session?.accessToken) throw new Error("No token");
      return buyerAPI.deleteBuyer(id, session?.accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyers"] });
      toast.success("Buyer deleted successfully");
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Failed to delete buyer");
    },
  });

  const handleViewDetails = async (buyerId: string) => {
    try {
      if (!session?.accessToken) throw new Error("No token");

      const response = await buyerAPI.getBuyerDetails(
        buyerId,
        session.accessToken
      );

      setSelectedBuyer(response.data.data); // ✅ correct
      setIsDetailsOpen(true); // ✅ open modal
    } catch (error) {
      toast.error("Failed to load buyer details");
    }
  };

  return (
    <div>
      <Header
        title="Buyer Profile"
        breadcrumbs={[{ label: "Dashboard" }, { label: "User Profile" }]}
      />

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>All Buyers</CardTitle>
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
                        <th className="text-left py-3 px-4 font-semibold">
                          User ID
                        </th>
                        <th className="text-left py-3 px-4 font-semibold">
                          User Name
                        </th>
                        <th className="text-left py-3 px-4 font-semibold">
                          Total Order
                        </th>
                        <th className="text-left py-3 px-4 font-semibold">
                          Delivered Order
                        </th>
                        <th className="text-left py-3 px-4 font-semibold">
                          Pending Order
                        </th>
                        <th className="text-left py-3 px-4 font-semibold">
                          Cancel Order
                        </th>
                        <th className="text-left py-3 px-4 font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.buyers || []).map((buyer: any) => (
                        <tr
                          key={buyer._id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">{buyer._id.slice(-6)}</td>
                          <td className="py-3 px-4 flex items-center gap-3">
                            {buyer.avatar?.url && (
                              <img
                                src={buyer.avatar.url || "/placeholder.svg"}
                                alt={buyer.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            )}
                            {buyer.name}
                          </td>
                          <td className="py-3 px-4">{buyer.totalOrders}</td>
                          <td className="py-3 px-4">{buyer.deliveredOrders}</td>
                          <td className="py-3 px-4">{buyer.pendingOrders}</td>
                          <td className="py-3 px-4">{buyer.cancelledOrders}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-orange-500 hover:text-orange-600"
                                onClick={() => handleViewDetails(buyer._id)}
                              >
                                See Details
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteId(buyer._id)}
                              >
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
                    Showing {(page - 1) * limit + 1} to{" "}
                    {Math.min(page * limit, data?.pagination?.total || 0)} of{" "}
                    {data?.pagination?.total || 0} results
                  </p>
                  <Pagination
                    currentPage={page}
                    totalPages={data?.pagination?.pages || 1}
                    onPageChange={setPage}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <BuyerDetailsModal
        buyer={selectedBuyer?.buyer}
        orderStats={selectedBuyer?.orderStats}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
