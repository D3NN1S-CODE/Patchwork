import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export async function IndieSpotlight() {
  const supabase = await createClient()

  const { data: indieSongs } = await supabase
    .from("songs")
    .select("*")
    .eq("is_indie_spotlight", true)
    .order("created_at", { ascending: false })
    .limit(6)

  if (!indieSongs || indieSongs.length === 0) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
          <TrendingUp className="w-16 h-16 text-muted-foreground" />
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">No indie tracks available</h3>
            <p className="text-muted-foreground">Check back soon for new rising artists</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {indieSongs.map((song) => (
        <Card
          key={song.id}
          className="group hover:shadow-xl transition-all duration-300 hover:border-accent/50 cursor-pointer bg-gradient-to-br from-card to-accent/5"
        >
          <CardHeader>
            <div className="relative w-full aspect-square rounded-xl mb-4 overflow-hidden">
              <img
                src={song.cover_image_url || "/placeholder.svg?height=300&width=300&query=music"}
                alt={song.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <Button
                  size="icon"
                  className="w-12 h-12 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 animate-glow-pulse"
                >
                  <Play className="w-6 h-6 ml-0.5" />
                </Button>
              </div>
            </div>
            <CardTitle className="text-xl group-hover:text-accent transition-colors">{song.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{song.artist_name}</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 flex-wrap">
              {song.mood_tags?.slice(0, 2).map((tag) => (
                <span key={tag} className="px-2 py-1 rounded-full bg-accent/10 text-accent text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
