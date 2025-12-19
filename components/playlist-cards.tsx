"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music } from "lucide-react"
import Link from "next/link"

interface Playlist {
  id: string
  name: string
  description: string | null
  mood_tag: string | null
  cover_color: string | null
  playlist_songs: { count: number }[]
}

export function PlaylistCards({ playlists }: { playlists: Playlist[] }) {
  if (playlists.length === 0) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
          <Music className="w-16 h-16 text-muted-foreground" />
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">No playlists yet</h3>
            <p className="text-muted-foreground">Create your first playlist to organize your favorite tracks</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {playlists.map((playlist) => (
        <Link key={playlist.id} href={`/app/playlist/${playlist.id}`}>
          <Card className="group hover:shadow-xl transition-all duration-300 hover:border-primary/50 cursor-pointer h-full">
            <CardHeader>
              <div
                className="w-full aspect-square rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center"
                style={{
                  background:
                    playlist.cover_color || "linear-gradient(135deg, oklch(0.75 0.15 85), oklch(0.85 0.18 75))",
                }}
              >
                <Music className="w-16 h-16 text-black/20" />
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">{playlist.name}</CardTitle>
              {playlist.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{playlist.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{playlist.playlist_songs?.[0]?.count || 0} songs</span>
                {playlist.mood_tag && (
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">{playlist.mood_tag}</span>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
