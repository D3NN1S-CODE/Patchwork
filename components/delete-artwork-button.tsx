"use client"

import type React from "react"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteArtworkButton({ artworkId }: { artworkId: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this artwork?")) return

    setIsDeleting(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("artworks").delete().eq("id", artworkId)
      if (error) throw error
      router.refresh()
    } catch (err) {
      alert("Failed to delete artwork")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={handleDelete}
      disabled={isDeleting}
      className="bg-destructive/90 hover:bg-destructive"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
