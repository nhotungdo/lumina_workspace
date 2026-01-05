
export enum BlockType {
  TEXT = 'text',
  HEADING1 = 'h1',
  HEADING2 = 'h2',
  HEADING3 = 'h3',
  TODO = 'todo',
  BULLET = 'bullet',
  NUMBERED = 'numbered',
  TOGGLE = 'toggle',
  QUOTE = 'quote',
  CALLOUT = 'callout',
  CODE = 'code',
  IMAGE = 'image',
  VIDEO = 'video',
  EMBED = 'embed',
  TABLE = 'table', // Simple table
  DATABASE = 'database', // Advanced database
  DIVIDER = 'divider',
  COLUMN_GROUP = 'column_group',
  COLUMN = 'column'
}

export enum PermissionRole {
  OWNER = 'owner',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

export enum DatabasePropertyType {
  TEXT = 'text',
  NUMBER = 'number',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  DATE = 'date',
  PERSON = 'person',
  CHECKBOX = 'checkbox',
  URL = 'url',
  EMAIL = 'email'
}

export enum DatabaseViewType {
  TABLE = 'table',
  BOARD = 'board',
  CALENDAR = 'calendar',
  GALLERY = 'gallery'
}

export interface SelectOption {
  id: string;
  name: string;
  color: string;
}

export interface DatabaseProperty {
  id: string;
  name: string;
  type: DatabasePropertyType;
  options?: SelectOption[];
}

export interface DatabaseSort {
  propertyId: string;
  direction: 'asc' | 'desc';
}

export interface DatabaseFilter {
  id: string;
  propertyId: string;
  operator: string;
  value: any;
}

export interface DatabaseView {
  id: string;
  name: string;
  type: DatabaseViewType;
  filter?: DatabaseFilter[];
  sort?: DatabaseSort[];
}

export type FontStyle = 'sans' | 'serif' | 'mono';
export type Language = 'en' | 'vi';
export type Theme = 'light' | 'dark';

export interface UserSettings {
  theme: Theme;
  fontStyle: FontStyle;
  language: Language;
  timezone: string;
}

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  children?: Block[];
  metadata?: {
    checked?: boolean;
    language?: string;
    url?: string;
    icon?: string;
    rows?: string[][]; // For simple tables
    isExpanded?: boolean; // For toggles
    width?: string; // For columns

    // Database specific
    databaseConfig?: {
      views: DatabaseView[];
      properties: DatabaseProperty[];
      currentViewId: string;
    };
    propertyValues?: Record<string, any>; // { propertyId: value }
  };
}

export interface Cursor {
  userId: string;
  userName: string;
  color: string;
  blockId: string;
  lastUpdate: number;
}

export interface Presence {
  userId: string;
  status: 'online' | 'away';
  lastSeen: number;
}

export interface Comment {
  id: string;
  authorId: string;
  pageId: string;
  blockId?: string;
  content: string;
  timestamp: number;
  isResolved: boolean;
  replies: Comment[];
}

export interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  type: 'mention' | 'reply' | 'resolve';
  pageId: string;
  blockId?: string;
  timestamp: number;
  isRead: boolean;
  content: string;
}

export interface Page {
  id: string;
  title: string;
  icon: string;
  blocks: Block[];
  lastModified: number;
  isDeleted?: boolean;
  isFavorite?: boolean;
  lastOpened?: number;

  // Publishing & Security
  isPublished?: boolean;
  isLocked?: boolean;
  password?: string;
  guests?: WorkspaceMember[]; // Page-specific guests
}

export interface Workspace {
  id: string;
  name: string;
  icon: string;
  pages: Page[];
  members: WorkspaceMember[];
}

export interface WorkspaceMember {
  id: string;
  name: string;
  role: PermissionRole;
  avatar: string;
  email?: string;
  color?: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}
