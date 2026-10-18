export type Category = 
  | 'All'
  | 'Text & Content'
  | 'Code & Web Dev'
  | 'Crypto & Security'
  | 'Unit Converters'
  | 'Math & Science'
  | 'Finance & Money'
  | 'Date & Time'
  | 'Color & Design'
  | 'Image & Media'
  | 'Productivity'
  | 'Cheatsheets';

export interface ToolItem {
  id: string;
  name: string;
  category: Category;
  subcategory?: string;
  description: string;
  tags: string[];
  icon: string;
  componentId: string;
  mode?: string;
  featured?: boolean;
}

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'error';
}
