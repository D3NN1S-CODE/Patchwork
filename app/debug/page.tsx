"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function DebugPage() {
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("patchwork_current_user")
    const allUsers = localStorage.getItem("patchwork_users")
    setUserData({
      currentUser: currentUser ? JSON.parse(currentUser) : null,
      allUsers: allUsers ? JSON.parse(allUsers) : null,
    })
  }, [])

  const clearData = () => {
    localStorage.removeItem("patchwork_current_user")
    localStorage.removeItem("patchwork_users")
    window.location.reload()
  }

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Debug Page</h1>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Current User Data</h2>
          <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(userData?.currentUser, null, 2)}
          </pre>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">All Users</h2>
          <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(userData?.allUsers, null, 2)}
          </pre>
        </Card>

        <div className="flex gap-4">
          <Button onClick={clearData} variant="destructive">
            Clear All Data
          </Button>
          <Link href="/auth/signup">
            <Button>Go to Signup</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
