export interface Project {
  id: number
  title: string
  category: string
  image: string
  images: string[] // Make this required instead of optional
  description: string // Make this required instead of optional
  details?: string
  client?: string
  year?: string
  location?: string
  duration: string // Add duration as required field
  createdAt: Date
}
