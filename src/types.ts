export type SectionId =
  | "start"
  | "objects"
  | "pillars"
  | "abstraction"
  | "syntax"
  | "why-inherit"
  | "how-inherit"
  | "ctors"
  | "override"
  | "object"
  | "cast"
  | "poly"
  | "abstract"
  | "finale";

export interface Section {
  id: SectionId;
  label: string;
  short: string;
}

export interface Slide {
  id: string;
  section: SectionId;
  lecture?: number;
  kicker?: string;
  title: string;
  html: string;
  notes?: string;
  widget?: string;
  hero?: boolean;
}

export const SECTIONS: Section[] = [
  { id: "start", label: "Старт", short: "Старт" },
  { id: "objects", label: "Классы и объекты", short: "Объекты" },
  { id: "pillars", label: "Четыре столпа ООП", short: "Столпы" },
  { id: "abstraction", label: "Абстракция глубже", short: "Абстракция" },
  { id: "syntax", label: "protected и this", short: "this" },
  { id: "why-inherit", label: "Зачем наследование", short: "Зачем" },
  { id: "how-inherit", label: "Как наследовать", short: "Как" },
  { id: "ctors", label: "Конструкторы и super", short: "super" },
  { id: "override", label: "Переопределение", short: "Override" },
  { id: "object", label: "Класс Object", short: "Object" },
  { id: "cast", label: "Преобразование типов", short: "Cast" },
  { id: "poly", label: "Полиморфизм", short: "Полиморфизм" },
  { id: "abstract", label: "Абстрактные классы", short: "Abstract" },
  { id: "finale", label: "Итоги и квиз", short: "Квиз" }
];
