// Configuration Type Definitions
// These types define the structure of the dynamic configuration system

// ===== FILTER CONFIGURATION =====

export type FilterType = 'multiselect' | 'select' | 'range' | 'text' | 'date' | 'toggle';

export interface FilterOption {
  value: string;
  label: string;
}

export interface BaseFilter {
  type: FilterType;
  label: string;
  icon: string;
  enabled: boolean;
}

export interface MultiselectFilter extends BaseFilter {
  type: 'multiselect';
  options: FilterOption[];
}

export interface SelectFilter extends BaseFilter {
  type: 'select';
  options: FilterOption[];
}

export interface RangeFilter extends BaseFilter {
  type: 'range';
  min: number;
  max: number;
  step: number;
  unit?: string;
  format?: string;
}

export interface TextFilter extends BaseFilter {
  type: 'text';
  placeholder?: string;
}

export interface DateFilter extends BaseFilter {
  type: 'date';
  minDate?: string;
  maxDate?: string;
}

export interface ToggleFilter extends BaseFilter {
  type: 'toggle';
  defaultValue?: boolean;
}

export type Filter =
  | MultiselectFilter
  | SelectFilter
  | RangeFilter
  | TextFilter
  | DateFilter
  | ToggleFilter;

export interface FiltersConfig {
  [key: string]: Filter;
}

// ===== COURSE CARD CONFIGURATION =====

export type CardFieldType = 'text' | 'badge' | 'icon-text' | 'image' | 'link';
export type CardFieldPosition = 'header' | 'subheader' | 'badges' | 'footer';

export interface CourseCardField {
  key: string;
  type: CardFieldType;
  label: string | null;
  position: CardFieldPosition;
  icon?: string;
  format: string;
  className?: string;
  iconMap?: Record<string, string>;
}

export interface CourseCardImageConfig {
  enabled: boolean;
  aspectRatio: string;
  placeholder?: string;
}

export interface CourseCardConfig {
  image: CourseCardImageConfig;
  fields: CourseCardField[];
}

// ===== COURSE DETAIL CONFIGURATION =====

export type DetailFieldType =
  | 'text'
  | 'list'
  | 'provider'
  | 'skills'
  | 'link'
  | 'info-card';

export type SectionLayout = 'grid' | 'list';

export interface BaseDetailField {
  key: string;
  type: DetailFieldType;
  label: string;
  icon?: string;
  tooltip?: string;
  enabled?: boolean;
}

export interface TextDetailField extends BaseDetailField {
  type: 'text';
  format: string;
}

export interface ListDetailField extends BaseDetailField {
  type: 'list';
  format: 'bullet' | 'numbered' | 'plain';
}

export interface ProviderDetailField extends BaseDetailField {
  type: 'provider';
  format: {
    name: string;
    link: string;
  };
}

export interface SkillsDetailField extends BaseDetailField {
  type: 'skills';
  showEscoLink: boolean;
}

export interface LinkDetailField extends BaseDetailField {
  type: 'link';
  subtitle?: string;
  format: string | 'multiline';
  linkConfig?: {
    text: string;
    url: string;
  };
}

export interface InfoCardDetailField extends BaseDetailField {
  type: 'info-card';
  format: string;
}

export type DetailField =
  | TextDetailField
  | ListDetailField
  | ProviderDetailField
  | SkillsDetailField
  | LinkDetailField
  | InfoCardDetailField;

export interface DetailSection {
  id: string;
  title: string | null;
  layout: SectionLayout;
  fields: DetailField[];
}

export interface DetailTab {
  id: string;
  label: string;
  enabled: boolean;
  sections: DetailSection[];
}

export interface CourseDetailConfig {
  tabs: DetailTab[];
}

// ===== THEME CONFIGURATION =====

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  secondary?: string;
  secondaryHover?: string;
  background?: string;
  link: string;
  gray?: Record<string, string>;
}

export interface ThemeLogo {
  url: string;
  name: string;
}

export interface ThemeFonts {
  primary: string;
  secondary?: string;
}

export interface ThemeLayout {
  maxWidth: string;
  cardAspectRatio: string;
  gridColumns: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export interface ThemeConfig {
  colors: ThemeColors;
  logo: ThemeLogo;
  fonts: ThemeFonts;
  layout?: ThemeLayout;
}

// ===== FORMAT CONFIGURATION =====

export interface FormatTemplate {
  template: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  defaultCurrency?: string;
  units?: string[];
  locale?: string;
  format?: string; // date format
}

export interface FormatsConfig {
  [key: string]: FormatTemplate;
}

// ===== ICON CONFIGURATION =====

export interface IconsConfig {
  [fieldKey: string]: string | Record<string, string>;
}

// ===== MAIN APP CONFIGURATION =====

export interface AppConfig {
  filters: FiltersConfig;
  courseCard: CourseCardConfig;
  courseDetail: CourseDetailConfig;
  theme: ThemeConfig;
  formats?: FormatsConfig;
  icons?: IconsConfig;
}

// ===== HELPER TYPES =====

// For dynamic field rendering
export interface FieldRenderProps<T = any> {
  field: DetailField;
  data: T;
  config: AppConfig;
}

// For filter state management
export interface FilterState {
  [filterKey: string]: any;
}

// For API query parameters
export interface CourseQueryParams extends FilterState {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
