export interface Project {
  id: number
  title: string
  category: string
  image: string
  images?: string[] // Add array of additional images
  description?: string
  details?: string // Add detailed description
  client?: string // Add client name
  year?: string // Add project year
  location?: string // Add project location
  createdAt: Date
}
