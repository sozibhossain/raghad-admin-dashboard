"use client"

import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { dashboardAPI } from "@/lib/api"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Package, TrendingUp, Users, ShoppingCart } from "lucide-react"

const COLORS = ["#FF9500", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6"]

function StatCard({ icon: Icon, label, value, loading }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{label}</p>
            {loading ? (
              <Skeleton className="h-8 w-24 mt-2" />
            ) : (
              <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
            )}
          </div>
          <div className="bg-[#8e9e2836] p-3 rounded-lg">
            <Icon className="w-6 h-6 text-[#8E9E28]" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { data: session } = useSession()

  const { data, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      if (!session?.accessToken) throw new Error("No token")
      const response = await dashboardAPI.getOverview(session.accessToken)
      return response.data.data
    },
    enabled: !!session?.accessToken,
  })

  return (
    <div>
      <Header title="Over View" breadcrumbs={[{ label: "Dashboard" }]} />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard icon={Package} label="Total Products" value={data?.totalProducts || 0} loading={isLoading} />
          <StatCard icon={TrendingUp} label="Total Revenue" value={`$${data?.totalRevenue || 0}`} loading={isLoading} />
          <StatCard icon={Users} label="Total Seller" value={data?.totalSellers || 0} loading={isLoading} />
          <StatCard icon={Users} label="Total User" value={data?.totalUsers || 0} loading={isLoading} />
          <StatCard icon={ShoppingCart} label="Total Orders" value={data?.totalOrders || 0} loading={isLoading} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Report */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Report</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data?.charts?.revenueChart || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#FF9500" name="Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Active Users */}
          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data?.charts?.activeUsers || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="activeUsers" fill="#FF9500" stroke="#FF9500" name="Active Users" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Products by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Selling Products by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data?.productsByCategory || []}
                      dataKey="productCount"
                      nameKey="categoryName"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {(data?.productsByCategory || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Product</th>
                      <th className="text-left py-3 px-4 font-semibold">Price</th>
                      <th className="text-left py-3 px-4 font-semibold">Delivery Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.recentOrders || []).map((order: any) => (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{order.name}</td>
                        <td className="py-3 px-4">${order.totalPrice}</td>
                        <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
