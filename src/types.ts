export type Category = 
  | 'Media & Studio'
  | 'Text & Crypto Forge'
  | 'Code & Web Lab'
  | 'Files & Documents'
  | 'Math & Engineering'
  | 'Unit Converters'
  | 'Finance & Money'
  | 'Date, Time & World'
  | 'Color & Palette'
  | 'Cheatsheets & Guides';

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
  badge?: 'New' | 'Popular' | 'AI / Canvas' | 'Privacy' | 'Pro';
}

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'error';
}
