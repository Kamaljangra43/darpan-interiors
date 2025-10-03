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
  image: string;
  images: string[];
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
