"use client"

import { Fragment, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "sonner"

import { categoryAPI, itemTypeAPI } from "@/lib/api"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryModal } from "@/components/modals/category-modal"
import { DeleteConfirmDialog } from "@/components/modals/delete-confirm-dialog"
import { ItemTypeModal } from "./_components/item-type-modal"

export interface ItemTypeConfig {
  _id: string
  productCategory: {
    _id: string
    name: string
  }
  itemType: string[]
  brand: string[]
  condition: string[]
  color: string[]
}


export default function CategoriesPage() {
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)

  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null)
  const [showItemTypeModal, setShowItemTypeModal] = useState(false)
  const [editingItemType, setEditingItemType] = useState<any>(null)

  /* ===========================
      CATEGORIES
  ============================ */

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!session?.accessToken) throw new Error("No token")
      const res = await categoryAPI.getCategories(session.accessToken)
      return res.data.data
    },
    enabled: !!session?.accessToken,
  })

  const createCategory = useMutation({
    mutationFn: (formData: FormData) =>
      categoryAPI.createCategory(formData, session!.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success("Category created")
      setShowCategoryModal(false)
    },
  })

  const updateCategory = useMutation({
    mutationFn: ({ id, formData }: any) =>
      categoryAPI.updateCategory(id, formData, session!.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success("Category updated")
      setShowCategoryModal(false)
      setEditingCategory(null)
    },
  })

  const deleteCategory = useMutation({
    mutationFn: (id: string) =>
      categoryAPI.deleteCategory(id, session!.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success("Category deleted")
      setDeleteCategoryId(null)
    },
  })

  /* ===========================
      ITEM TYPES
  ============================ */

const { data: itemTypeConfig, isLoading: itemTypeLoading } = useQuery<ItemTypeConfig | null>({
  queryKey: ["itemTypes", expandedCategoryId],
  queryFn: async () => {
    if (!session?.accessToken || !expandedCategoryId) return null

    const res = await itemTypeAPI.getItemTypeByCategory(
      expandedCategoryId,
      session.accessToken
    )

    return res.data.data // 👈 whole object, not array
  },
  enabled: !!expandedCategoryId && !!session?.accessToken,
})


  const createItemType = useMutation({
    mutationFn: (body: any) =>
      itemTypeAPI.createItemType(body, session!.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itemTypes", expandedCategoryId] })
      toast.success("Item type created")
      setShowItemTypeModal(false)
    },
  })

  const updateItemType = useMutation({
    mutationFn: ({ body }: any) =>
      itemTypeAPI.updateItemType(
        expandedCategoryId!,
        body,
        session!.accessToken
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itemTypes", expandedCategoryId] })
      toast.success("Item type updated")
      setShowItemTypeModal(false)
      setEditingItemType(null)
    },
  })

  const deleteItemType = useMutation({
    mutationFn: (name: string) =>
      itemTypeAPI.deleteItemType(name, session!.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itemTypes", expandedCategoryId] })
      toast.success("Item type deleted")
    },
  })

  /* ===========================
      RENDER
  ============================ */

  return (
    <>
      <Header
        title="Categories List"
        breadcrumbs={[{ label: "Dashboard" }, { label: "Categories" }]}
      />

      <div className="p-6">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>All Categories</CardTitle>
            <Button onClick={() => setShowCategoryModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full mb-2" />
              ))
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category: any) => (
                    <Fragment key={category._id}>
                      {/* CATEGORY ROW */}
                      <tr
                        className="border-b cursor-pointer hover:bg-gray-50"
                        onClick={() =>
                          setExpandedCategoryId(
                            expandedCategoryId === category._id
                              ? null
                              : category._id
                          )
                        }
                      >
                        <td className="px-4 py-3 flex items-center gap-2">
                          {expandedCategoryId === category._id ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                          {category.name}
                        </td>

                        <td className="px-4 py-3">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingCategory(category)
                                setShowCategoryModal(true)
                              }}
                            >
                              <Edit2 size={16} />
                            </Button>

                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                setDeleteCategoryId(category._id)
                              }}
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>

                      {/* ITEM TYPE DROPDOWN */}
                      {expandedCategoryId === category._id && (
  <tr className="bg-gray-50">
    <td colSpan={3} className="px-6 py-4">
      {itemTypeLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : !itemTypeConfig ? (
        <Button
          size="sm"
          onClick={() => {
            setEditingItemType(null)
            setShowItemTypeModal(true)
          }}
        >
          + Add Item Type
        </Button>
      ) : (
        <div className="flex justify-between items-center bg-white border rounded p-3">
          <div className="text-sm">
            <p><b>Item Types:</b> {itemTypeConfig.itemType.join(", ")}</p>
            <p><b>Brands:</b> {itemTypeConfig.brand.join(", ")}</p>
            <p><b>Conditions:</b> {itemTypeConfig.condition.join(", ")}</p>
            <p><b>Colors:</b> {itemTypeConfig.color.join(", ")}</p>
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setEditingItemType(itemTypeConfig)
              setShowItemTypeModal(true)
            }}
          >
            <Edit2 size={16} />
          </Button>
        </div>
      )}
    </td>
  </tr>
)}

                    </Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* MODALS */}
      <CategoryModal
        open={showCategoryModal}
        onOpenChange={setShowCategoryModal}
        category={editingCategory}
        onSave={(formData) =>
          editingCategory
            ? updateCategory.mutate({
                id: editingCategory._id,
                formData,
              })
            : createCategory.mutate(formData)
        }
        isLoading={createCategory.isPending || updateCategory.isPending}
      />

      <ItemTypeModal
        open={showItemTypeModal}
        onOpenChange={setShowItemTypeModal}
        initialData={editingItemType}
        onSave={(values) =>
          editingItemType
            ? updateItemType.mutate({ body: values })
            : createItemType.mutate({
                ...values,
                productCategory: expandedCategoryId,
              })
        }
        isLoading={createItemType.isPending || updateItemType.isPending}
      />

      <DeleteConfirmDialog
        open={!!deleteCategoryId}
        onOpenChange={(open) => !open && setDeleteCategoryId(null)}
        onConfirm={() =>
          deleteCategoryId && deleteCategory.mutate(deleteCategoryId)
        }
        isLoading={deleteCategory.isPending}
      />
    </>
  )
}
