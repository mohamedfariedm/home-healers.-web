export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export interface IFeatureCard {
  id: number;
  heading: string;
  subheading: string;
  image: string;
  gradientStyle: string;
  imgClassName?: string;
}
export interface IValueCard {
  id: number;
  heading: string;
  subheading: string;
  icon: JSX.Element;
}
export interface ITestimonialCard {
  id: number;
  name: string;
  position: string;
  company: string;
  image: string;
  rating: number;
  text: string;
}

export interface IBlog {
  id: number;
  image: string;
  type: string;
  title: string;
  short_desc: string;
  publisher: any;
  avatar: string;
  created_at: string;
}

export interface PageProps {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export type IFormElementProps = {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  ServerErrors?: any;
  inputStyle?: string;
  disabled?: boolean;
  className?: string;
  type?: string;
  rows?: number;
  options?: {
    label: string;
    value: string;
  }[];
};
