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
  content: string;
  rating: number;
  image?: {
    url: string;
    public_id: string;
  };
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
