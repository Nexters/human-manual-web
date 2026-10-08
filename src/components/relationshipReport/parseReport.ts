// ------- 연인 관계 설명서 Markdown 파싱 ------
// AI 가 매번 문장을 다르게 쓰지만 뼈대는 고정이다.
// "## 1~10" 섹션, 8번은 "**A → B**" 블록 2개, 9번은 "규칙 N. **제목**" 블록 여러 개.

export interface ReportSection {
  title: string;
  paragraphs: string[];
}

export interface ReportLetter {
  from: string;
  to: string;
  paragraphs: string[];
}

export interface ReportRule {
  title: string;
  description: string;
}

export interface ParsedReport {
  core?: ReportSection;
  scenes: ReportSection[];
  strength?: ReportSection;
  letters: { title: string; items: ReportLetter[] } | null;
  rules: { title: string; items: ReportRule[] } | null;
  summary: string;
}

const toParagraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);

function parseLetters(body: string): ReportLetter[] {
  const parts = body.split(/^\*\*(.+?)\*\*\s*$/m).slice(1);
  const letters: ReportLetter[] = [];
  for (let i = 0; i < parts.length; i += 2) {
    const [from = "", to = ""] = parts[i].split("→").map((name) => name.trim());
    letters.push({ from, to, paragraphs: toParagraphs(parts[i + 1] ?? "") });
  }
  return letters;
}

function parseRules(body: string): ReportRule[] {
  return body
    .split(/^규칙\s*\d+\.\s*/m)
    .filter((chunk) => chunk.trim())
    .map((chunk) => ({
      title: chunk.match(/^\*\*(.+?)\*\*/)?.[1] ?? "",
      description: toParagraphs(chunk.replace(/^\*\*(.+?)\*\*/, "")).join(" "),
    }));
}

export function parseReport(markdown: string): ParsedReport {
  const sections = new Map<number, { title: string; body: string }>();
  for (const chunk of markdown.split(/^## /m)) {
    const [head, ...rest] = chunk.split("\n");
    const match = head.match(/^(\d+)\.\s*(.+)$/);
    if (match)
      sections.set(Number(match[1]), { title: match[2].trim(), body: rest.join("\n").trim() });
  }

  const section = (n: number): ReportSection | undefined => {
    const s = sections.get(n);
    return s && { title: s.title, paragraphs: toParagraphs(s.body) };
  };
  const letters = sections.get(8);
  const rules = sections.get(9);

  return {
    core: section(1),
    scenes: [2, 3, 4, 5, 6].map(section).filter((s): s is ReportSection => Boolean(s)),
    strength: section(7),
    letters: letters ? { title: letters.title, items: parseLetters(letters.body) } : null,
    rules: rules ? { title: rules.title, items: parseRules(rules.body) } : null,
    summary: section(10)?.paragraphs.join(" ") ?? "",
  };
}

/** 본문의 **굵게** 와 “인용” 을 강조 구간으로 나눈다. */
export function splitEmphasis(text: string): { text: string; strong: boolean }[] {
  return text
    .split(/(\*\*.+?\*\*|“[^”]{2,90}”)/)
    .filter(Boolean)
    .map((part) =>
      part.startsWith("**")
        ? { text: part.slice(2, -2), strong: true }
        : { text: part, strong: part.startsWith("“") },
    );
}
