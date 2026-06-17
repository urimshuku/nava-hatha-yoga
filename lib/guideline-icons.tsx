import type { ComponentType, SVGProps } from "react";

export type GuidelineIconName =
  | "beforeStart"
  | "duringSession"
  | "afterProgram"
  | "guidelines"
  | "stomach"
  | "clothing"
  | "punctuality"
  | "belongings"
  | "water"
  | "mindfulness"
  | "questions"
  | "support"
  | "confidentiality"
  | "dignity"
  | "noMusic"
  | "temperature"
  | "nutrition";

export const SECTION_ICON_NAMES: readonly GuidelineIconName[] = [
  "beforeStart",
  "duringSession",
  "afterProgram",
];

export const BLOCK_ICON_BY_HEADING: Record<string, GuidelineIconName> = {
  "Empty or slightly full stomach": "stomach",
  "Clothing & Accessories": "clothing",
  Punctuality: "punctuality",
  "Shoes, Bags & Phones": "belongings",
  Water: "water",
  "Mindfulness in the Classroom": "mindfulness",
  Questions: "questions",
  "Accompaniment & Support": "support",
  "Confidentiality of the Practice": "confidentiality",
  "Dignity of the Practice": "dignity",
  "No Music During Practice": "noMusic",
  "Room Temperature": "temperature",
  "Prana & Nutrition": "nutrition",
};

export const GUIDELINE_ICON_COLOR = "#C9A86A";

const ICON_MARKUP: Record<GuidelineIconName, string> = {
  guidelines: `<path d="M7 4h10v16H7z" stroke="COLOR" stroke-width="1.4" fill="none" /><path d="M9 8h6M9 12h6M9 16h4" stroke="COLOR" stroke-width="1.4" stroke-linecap="round" fill="none" />`,
  beforeStart: `<path d="M6.5 6.5 4.5 8.5 6.5 10.5 6.5 8.5H17A4 4 0 0 1 17 16.5H9" stroke="COLOR" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none" />`,
  duringSession: `<circle cx="7" cy="12" r="1.5" fill="COLOR" /><circle cx="12" cy="12" r="1.5" fill="COLOR" /><circle cx="17" cy="12" r="1.5" fill="COLOR" />`,
  afterProgram: `<circle cx="12" cy="12" r="8.5" stroke="COLOR" stroke-width="1.4" fill="none" /><path d="m8.5 12.5 2 2 5-5" stroke="COLOR" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none" />`,
  stomach: `<path d="M6 10c0-2.2 2.7-4 6-4s6 1.8 6 4c0 3.5-2.5 6-6 8-3.5-2-6-4.5-6-8Z" stroke="COLOR" stroke-width="1.4" stroke-linejoin="round" fill="none" /><path d="M9 10h6" stroke="COLOR" stroke-width="1.4" stroke-linecap="round" fill="none" />`,
  clothing: `<path d="M7.5 7Q9.5 10 12 10Q14.5 10 16.5 7L19 10.5L16.5 12.5V18Q16.5 19.75 15 19.75H9Q7.5 19.75 7.5 18V12.5L5 10.5L7.5 7Z" stroke="COLOR" stroke-width="1.4" stroke-linejoin="round" fill="none" />`,
  punctuality: `<circle cx="12" cy="12" r="7.5" stroke="COLOR" stroke-width="1.4" fill="none" /><path d="M12 12V6.5" stroke="COLOR" stroke-width="1.4" stroke-linecap="round" fill="none" />`,
  belongings: `<path d="M7 9V7.5A2.5 2.5 0 0 1 12 7.5 2.5 2.5 0 0 1 17 7.5V9" stroke="COLOR" stroke-width="1.4" stroke-linecap="round" fill="none" /><rect x="5" y="9" width="14" height="10" rx="1.5" stroke="COLOR" stroke-width="1.4" fill="none" /><path d="M10 14h4" stroke="COLOR" stroke-width="1.4" stroke-linecap="round" fill="none" />`,
  water: `<path d="M12 4.5c2.5 3.5 5 6.3 5 9a5 5 0 1 1-10 0c0-2.7 2.5-5.5 5-9Z" stroke="COLOR" stroke-width="1.4" stroke-linejoin="round" fill="none" />`,
  mindfulness: `<circle cx="12" cy="12" r="3" stroke="COLOR" stroke-width="1.4" fill="none" /><path d="M5 12c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5M5 12c1.5 3 4 4.5 7 4.5s5.5-1.5 7-4.5" stroke="COLOR" stroke-width="1.4" stroke-linecap="round" fill="none" />`,
  questions: `<circle cx="12" cy="12" r="8.5" stroke="COLOR" stroke-width="1.4" fill="none" /><path d="M9.5 9.2a2.7 2.7 0 0 1 4.6 1.9c0 1.7-2.1 2.4-2.1 3.9" stroke="COLOR" stroke-width="1.4" stroke-linecap="round" fill="none" /><circle cx="12" cy="17.2" r="0.8" fill="COLOR" />`,
  support: `<circle cx="12" cy="12" r="7.5" stroke="COLOR" stroke-width="1.4" fill="none" /><path d="M12 8.5v7M8.5 12h7" stroke="COLOR" stroke-width="1.4" stroke-linecap="round" fill="none" />`,
  confidentiality: `<rect x="6" y="10" width="12" height="9" rx="1.5" stroke="COLOR" stroke-width="1.4" fill="none" /><path d="M9 10V8a3 3 0 0 1 6 0v2" stroke="COLOR" stroke-width="1.4" stroke-linecap="round" fill="none" /><circle cx="12" cy="14.5" r="1" fill="COLOR" />`,
  dignity: `<path d="M12 19.5c-3.5-2.5-6.5-5-6.5-8.2a3.7 3.7 0 0 1 6.5-2.5 3.7 3.7 0 0 1 6.5 2.5c0 3.2-3 5.7-6.5 8.2Z" stroke="COLOR" stroke-width="1.4" stroke-linejoin="round" fill="none" />`,
  noMusic: `<path d="M9.5 16.5V7.5l7-2v9" stroke="COLOR" stroke-width="1.4" stroke-linejoin="round" fill="none" /><circle cx="8" cy="16.5" r="1.8" stroke="COLOR" stroke-width="1.4" fill="none" /><path d="m5 5 14 14" stroke="COLOR" stroke-width="1.4" stroke-linecap="round" fill="none" />`,
  temperature: `<path d="M10 4.5h4v11.8a3.2 3.2 0 1 1-4 0V4.5Z" stroke="COLOR" stroke-width="1.4" stroke-linejoin="round" fill="none" /><circle cx="12" cy="17.8" r="2.2" stroke="COLOR" stroke-width="1.4" fill="none" /><path d="M12 8.5v5" stroke="COLOR" stroke-width="1.4" stroke-linecap="round" fill="none" /><path d="M10.5 11h3M10.5 13.5h3" stroke="COLOR" stroke-width="1.2" stroke-linecap="round" fill="none" />`,
  nutrition: `<circle cx="12" cy="12" r="7.5" stroke="COLOR" stroke-width="1.4" fill="none" /><circle cx="12" cy="12" r="5" stroke="COLOR" stroke-width="1.4" fill="none" />`,
};

export function guidelineIconSvg(
  name: GuidelineIconName,
  color = GUIDELINE_ICON_COLOR,
  size = 24,
): string {
  const markup = ICON_MARKUP[name].replaceAll("COLOR", color);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">${markup}</svg>`;
}

type IconProps = SVGProps<SVGSVGElement>;

function iconClass(size: "lg" | "sm" = "lg") {
  return size === "lg"
    ? "h-6 w-6 shrink-0 text-clay"
    : "h-5 w-5 shrink-0 text-clay";
}

function createIcon(
  name: GuidelineIconName,
  defaultSize: "lg" | "sm" = "lg",
): ComponentType<IconProps> {
  return function GuidelineIconComponent(props: IconProps) {
    const size = defaultSize === "lg" ? 24 : 20;
    const svg = guidelineIconSvg(name, "currentColor", size);
    const match = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
    const inner = match?.[1] ?? "";

    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={iconClass(defaultSize)}
        aria-hidden="true"
        {...props}
        dangerouslySetInnerHTML={{ __html: inner }}
      />
    );
  };
}

export const IconGuidelines = createIcon("guidelines");
export const IconBeforeStart = createIcon("beforeStart");
export const IconDuringSession = createIcon("duringSession");
export const IconAfterProgram = createIcon("afterProgram");
export const IconStomach = createIcon("stomach", "sm");
export const IconClothing = createIcon("clothing", "sm");
export const IconPunctuality = createIcon("punctuality", "sm");
export const IconBelongings = createIcon("belongings", "sm");
export const IconWater = createIcon("water", "sm");
export const IconMindfulness = createIcon("mindfulness", "sm");
export const IconQuestions = createIcon("questions", "sm");
export const IconSupport = createIcon("support", "sm");
export const IconConfidentiality = createIcon("confidentiality", "sm");
export const IconDignity = createIcon("dignity", "sm");
export const IconNoMusic = createIcon("noMusic", "sm");
export const IconTemperature = createIcon("temperature", "sm");
export const IconNutrition = createIcon("nutrition", "sm");

export const SECTION_ICONS = [IconBeforeStart, IconDuringSession, IconAfterProgram];

export const BLOCK_ICONS: Record<string, ComponentType<IconProps>> = {
  "Empty or slightly full stomach": IconStomach,
  "Clothing & Accessories": IconClothing,
  Punctuality: IconPunctuality,
  "Shoes, Bags & Phones": IconBelongings,
  Water: IconWater,
  "Mindfulness in the Classroom": IconMindfulness,
  Questions: IconQuestions,
  "Accompaniment & Support": IconSupport,
  "Confidentiality of the Practice": IconConfidentiality,
  "Dignity of the Practice": IconDignity,
  "No Music During Practice": IconNoMusic,
  "Room Temperature": IconTemperature,
  "Prana & Nutrition": IconNutrition,
};
