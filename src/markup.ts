const KEYWORDS = new Set([
  "abstract",
  "assert",
  "boolean",
  "break",
  "byte",
  "case",
  "catch",
  "char",
  "class",
  "const",
  "continue",
  "default",
  "do",
  "double",
  "else",
  "enum",
  "extends",
  "false",
  "final",
  "finally",
  "float",
  "for",
  "if",
  "implements",
  "import",
  "instanceof",
  "int",
  "interface",
  "long",
  "native",
  "new",
  "null",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "short",
  "static",
  "strictfp",
  "super",
  "switch",
  "synchronized",
  "this",
  "throw",
  "throws",
  "transient",
  "true",
  "try",
  "void",
  "volatile",
  "while",
  "record",
  "var",
  "yield"
]);

const TYPES = new Set([
  "String",
  "StringBuilder",
  "Object",
  "System",
  "Override",
  "Person",
  "Student",
  "Employee",
  "Manager",
  "Developer",
  "Designer",
  "Accountant",
  "Cat",
  "Animal",
  "Mammal",
  "Box",
  "Box3D",
  "Shape",
  "Shape2D",
  "Rectangle",
  "Circle",
  "Triangle",
  "Square",
  "Instrument",
  "Guitar",
  "Violin",
  "Saxophone",
  "Vehicle",
  "Truck",
  "DumpTruck",
  "FileManager",
  "Document",
  "Point",
  "Main",
  "Program",
  "Graphics2D",
  "Dimension",
  "ClassCastException",
  "Math"
]);

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function highlightJava(source: string): string {
  const escaped = escapeHtml(source);
  const tokens = escaped.split(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|\b\d[\d_]*L?\b|\b[A-Za-z_]\w*\b)/g);

  return tokens
    .map((token) => {
      if (!token) return "";
      if (token.startsWith("//") || token.startsWith("/*")) {
        return `<span class="tok-comment">${token}</span>`;
      }
      if (token.startsWith('"') || token.startsWith("'")) {
        return `<span class="tok-string">${token}</span>`;
      }
      if (/^\d/.test(token)) {
        return `<span class="tok-number">${token}</span>`;
      }
      if (KEYWORDS.has(token)) {
        return `<span class="tok-kw">${token}</span>`;
      }
      if (TYPES.has(token)) {
        return `<span class="tok-type">${token}</span>`;
      }
      return token;
    })
    .join("");
}

export function codeBlock(source: string, label = "Java"): string {
  const lines = source.replace(/^\n/, "").replace(/\n$/, "").split("\n");
  const numbered = lines
    .map((line, i) => {
      const n = String(i + 1).padStart(2, " ");
      return `<div class="code-line"><span class="ln">${n}</span><span class="lt">${highlightJava(line) || "&nbsp;"}</span></div>`;
    })
    .join("");
  return `<figure class="code-block"><figcaption>${label}</figcaption><pre>${numbered}</pre></figure>`;
}

export function bullets(items: string[]): string {
  return `<ul class="bullets">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

export function callout(kind: "idea" | "warn" | "ok" | "note", title: string, body: string): string {
  return `<aside class="callout ${kind}"><strong>${title}</strong><p>${body}</p></aside>`;
}

export function cols(left: string, right: string, ratio = "1fr 1fr"): string {
  return `<div class="cols" style="grid-template-columns:${ratio}">${left}${right}</div>`;
}

export function pill(text: string, tone = "gold"): string {
  return `<span class="pill ${tone}">${text}</span>`;
}

export function kvTable(headers: [string, string], rows: [string, string][]): string {
  const body = rows
    .map(
      ([a, b]) =>
        `<tr><th>${a}</th><td>${b}</td></tr>`
    )
    .join("");
  return `<table class="kv"><thead><tr><th>${headers[0]}</th><th>${headers[1]}</th></thead><tbody>${body}</tbody></table>`;
}

export function stat(value: string, label: string): string {
  return `<div class="stat"><b>${value}</b><span>${label}</span></div>`;
}
