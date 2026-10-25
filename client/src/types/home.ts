import { Category } from "./category";
import { ProductListItem } from "./product";

export interface HeroBanner {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  altText: string;
  ctaText: string;
  ctaLink: string;
}

export interface FeaturedService {
  key: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

export interface RentalStep {
  stepNumber: number;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: number;
  customerName: string;
  role: string;
  avatarUrl: string;
  content: string;
  rating: number;
}

export interface HomeFeaturedData {
  heroBanners: HeroBanner[];
  categories: Category[];
  topProducts: ProductListItem[];
  services: FeaturedService[];
  rentalSteps: RentalStep[];
  testimonials: Testimonial[];
}
