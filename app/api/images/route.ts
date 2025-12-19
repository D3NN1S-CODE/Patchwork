import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { buildSearchQuery, type NormalizedImage } from '@/lib/image-search'

async function fetchUnsplash(query: string, perPage: number) {
  const key = process.env.UNSPLASH_ACCESS_KEY
  if (!key) return { images: [] as NormalizedImage[], ok: false }

  const url = new URL('https://api.unsplash.com/search/photos')
  url.searchParams.set('query', query)
  url.searchParams.set('per_page', String(perPage))
  url.searchParams.set('orientation', 'portrait')
  url.searchParams.set('content_filter', 'high')

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${key}` },
    // Next can cache results for short time
    next: { revalidate: 300 },
  })
  if (!res.ok) return { images: [] as NormalizedImage[], ok: false }
  const data = await res.json()
  const images: NormalizedImage[] = (data.results || []).map((r: any) => ({
    id: r.id,
    src: r.urls?.regular || r.urls?.small,
    width: r.width,
    height: r.height,
    alt: r.alt_description || 'fashion outfit',
    author: r.user?.name,
    link: r.links?.html,
    provider: 'unsplash' as const,
    color: r.color ?? null,
  }))
  return { images, ok: true }
}

async function fetchPexels(query: string, perPage: number) {
  const key = process.env.PEXELS_API_KEY
  if (!key) return { images: [] as NormalizedImage[], ok: false }

  const url = new URL('https://api.pexels.com/v1/search')
  url.searchParams.set('query', query)
  url.searchParams.set('per_page', String(perPage))
  url.searchParams.set('orientation', 'portrait')

  const res = await fetch(url.toString(), {
    headers: { Authorization: key },
    next: { revalidate: 300 },
  })
  if (!res.ok) return { images: [] as NormalizedImage[], ok: false }
  const data = await res.json()
  const images: NormalizedImage[] = (data.photos || []).map((p: any) => ({
    id: String(p.id),
    src: p.src?.large || p.src?.medium,
    width: p.width,
    height: p.height,
    alt: p.alt || 'fashion outfit',
    author: p.photographer,
    link: p.url,
    provider: 'pexels' as const,
    color: null,
  }))
  return { images, ok: true }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const style = searchParams.get('style') || undefined
  const colors = searchParams.get('colors')?.split(',').filter(Boolean)
  const bodyType = searchParams.get('bodyType') || undefined
  const gender = searchParams.get('gender') || undefined
  const ethnicity = searchParams.get('ethnicity') || undefined
  const age = searchParams.get('age') || undefined
  const lifestyle = searchParams.get('lifestyle') || undefined
  const climate = searchParams.get('climate') || undefined
  const height = searchParams.get('height') ? Number(searchParams.get('height')) : undefined
  const occasion = searchParams.get('occasion') || undefined
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 12

  const { query } = buildSearchQuery({
    style,
    colors,
    bodyType,
    gender,
    ethnicity,
    age: age ? Number(age) || age : undefined,
    lifestyle,
    climate,
    height,
    occasion,
    limit,
  })

  // Try Unsplash → fallback to Pexels
  let all: NormalizedImage[] = []
  try {
    const u = await fetchUnsplash(query, limit)
    if (u.ok && u.images.length) all = u.images
  } catch {}

  if (!all.length) {
    try {
      const p = await fetchPexels(query, limit)
      if (p.ok && p.images.length) all = p.images
    } catch {}
  }

  return NextResponse.json({ query, images: all })
}
