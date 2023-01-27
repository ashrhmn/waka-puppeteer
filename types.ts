export interface IJSONData {
  updated_at: number;
  languages: ILanguageItem[];
}

export interface ILanguageItem {
  name: string;
  percentage: number;
}
