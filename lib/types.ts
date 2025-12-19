export interface Profile {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  artist_id: string
  title: string
  description: string | null
  color_theme: string
  is_published: boolean
  created_at: string
  updated_at: string
  artist?: Profile
  artworks?: Artwork[]
}

export interface Artwork {
  id: string
  room_id: string
  artist_id: string
  title: string
  description: string | null
  image_url: string
  position: number
  created_at: string
  updated_at: string
}

export interface Exhibit {
  id: string
  room_id: string
  artist_id: string
  title: string
  description: string | null
  scheduled_date: string
  is_released: boolean
  created_at: string
  room?: Room
}
