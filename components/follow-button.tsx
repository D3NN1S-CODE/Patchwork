"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { UserPlus, UserMinus } from "lucide-react"

export function FollowButton({
  artistId,
  isFollowing: initialIsFollowing,
  currentUserId,
}: {
  artistId: string
  isFollowing: boolean
  currentUserId: string
}) {
  const router = useRouter()
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleFollow = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      if (isFollowing) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", currentUserId)
          .eq("following_id", artistId)

        if (error) throw error
        setIsFollowing(false)
      } else {
        const { error } = await supabase.from("follows").insert({
          follower_id: currentUserId,
          following_id: artistId,
        })

        if (error) throw error
        setIsFollowing(true)
      }
      router.refresh()
    } catch (err) {
      alert("Failed to update follow status")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleToggleFollow} disabled={isLoading} variant={isFollowing ? "outline" : "default"} size="lg">
      {isFollowing ? (
        <>
          <UserMinus className="mr-2 w-4 h-4" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="mr-2 w-4 h-4" />
          Follow
        </>
      )}
    </Button>
  )
}
