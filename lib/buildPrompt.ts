// Content moved from node_modules/typescript/lib/buildPrompt.ts
// Please ensure this file contains the correct implementation.
export function buildPrompt(
  template: string[],
  variables: Record<string, string>
): string {
  let text = template.join("\n");
  for (const [key, value] of Object.entries(variables)) {
    text = text.replaceAll(`{{${key}}}`, value ?? "");
  }
  return text;
}