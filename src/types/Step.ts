
export interface Step {
  id: string;
  type: 'text' | 'image' | 'code' | 'html' | 'file';
  content: string;
  title?: string;
  language?: string;
  imageUrl?: string;
  annotations?: any[];
  fileData?: string;
  fileName?: string;
  fileType?: string;
  groupId?: string;
  style?: StepStyle;
}

export interface StepStyle {
  type: 'default' | 'info' | 'warning' | 'success' | 'error';
  backgroundColor?: string;
  borderColor?: string;
  icon?: string;
}

export interface StepGroup {
  id: string;
  title: string;
  isCollapsed: boolean;
  steps: Step[];
}
