"use client"

import type React from "react"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { authAPI } from "@/lib/api"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useSession } from "next-auth/react"
import { Eye, EyeOff } from "lucide-react"

function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled,
}: {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  autoComplete?: string
  disabled?: boolean
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-2 my-auto inline-flex h-8 w-8 items-center justify-center rounded-md"
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [inlineError, setInlineError] = useState<string | null>(null)

  const { data: session, status } = useSession()
  const token = session?.accessToken

  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Not authenticated")
      return authAPI.changePassword(
        oldPassword,
        newPassword,
        confirmPassword,
        token
      )
    },
    onSuccess: () => {
      toast.success("Password changed successfully")
      setInlineError(null)
      setShowPasswordModal(false)
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to change password"
      setInlineError(msg)
      toast.error(msg)
    },
  })

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setInlineError(null)

    if (newPassword !== confirmPassword) {
      const msg = "Passwords do not match"
      setInlineError(msg)
      toast.error(msg)
      return
    }
    if (newPassword.length < 6) {
      const msg = "Password must be at least 6 characters"
      setInlineError(msg)
      toast.error(msg)
      return
    }

    changePasswordMutation.mutate()
  }

  const submitDisabled =
    changePasswordMutation.isPending || status !== "authenticated" || !token

  return (
    <div>
      <Header title="Setting" breadcrumbs={[{ label: "Dashboard" }, { label: "Setting" }]} />

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setShowPasswordModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Change Password
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your current and new password</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {inlineError ? (
              <p className="text-sm text-red-600" role="alert" aria-live="polite">
                {inlineError}
              </p>
            ) : null}

            <PasswordInput
              id="old-password"
              label="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              autoComplete="current-password"
              disabled={changePasswordMutation.isPending}
            />

            <PasswordInput
              id="new-password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              autoComplete="new-password"
              disabled={changePasswordMutation.isPending}
            />

            <PasswordInput
              id="confirm-password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              autoComplete="new-password"
              disabled={changePasswordMutation.isPending}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordModal(false)}
                disabled={changePasswordMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={submitDisabled}
              >
                {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
