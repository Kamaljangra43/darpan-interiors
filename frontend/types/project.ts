// Image with metadata
export interface ProjectImage {
  url: string;
  featured?: boolean; // Mark which images for slideshow
  order?: number; // For custom ordering
}

export interface Project {
  _id?: string;
  id?: string;
  title: string;
  category: string;
  description: string;
  details?: string;
  client?: string;
  year?: string;
  duration?: string;
  location?: string;
  image: string; // Main thumbnail image

  // Images array with featured flag and order
  images: ProjectImage[];

  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  _id?: string;
  id?: string;
  name: string;
  occupation: string;
  content: string;
  rating: number; // Supports decimals: 4.5, 3.5, etc.
  image?:
    | {
        url: string;
        public_id: string;
      }
    | string; // Can be object or base64 string during upload
  projectType?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ImageData {
  _id?: string;
  url: string;
  public_id: string;
  category: string;
  section?: string;
  alt_text?: string;
  title?: string;
}
