export enum EOrderStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export enum EFormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  SELECT = 'select'
}

export type TFileData = { name: string; type: string };

export type TOrder = {
  title: string;
  description: string;
  producer: string;
  organization: string;
  status: EOrderStatus;
  image: string | null;
  attachedFiles: TFileData[];
};
