
export interface StepStyle {
  type: 'default' | 'info' | 'warning' | 'success' | 'error';
  icon: string;
}

export interface Step {
  id: string;
  type: 'text' | 'image' | 'code' | 'html' | 'file';
  content: string;
  title?: string;
  imageUrl?: string;
  language?: string;
  style?: StepStyle;
  groupId?: string;
  fileData?: string;
  fileName?: string;
  fileType?: string;
}

export interface StepGroup {
  id: string;
  title: string;
  isCollapsed: boolean;
  steps: Step[];
  style?: StepStyle;
}
