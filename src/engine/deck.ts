import type { Slide } from "../types";
import { SECTIONS } from "../types";
import { mountWidget } from "../widgets";

export class Deck {
  private slides: Slide[];
  private index = 0;
  private notesOpen = false;
  private overviewOpen = false;
  private readonly app: HTMLElement;

  constructor(app: HTMLElement, slides: Slide[]) {
    this.app = app;
    this.slides = slides;
    const hash = Number(location.hash.replace("#", ""));
    if (Number.isFinite(hash) && hash >= 1 && hash <= slides.length) {
      this.index = hash - 1;
    }
  }

  start(): void {
    this.renderShell();
    this.bind();
    this.show(this.index);
    this.fit();
    window.addEventListener("resize", () => this.fit());
  }

  private renderShell(): void {
    this.app.innerHTML = `
      <div class="shell">
        <aside class="toc">
          <div class="brand">
            <small>Курс Java</small>
            <strong>ООП · лекция 1</strong>
          </div>
          <div class="toc-list">
            ${SECTIONS.map(
              (section, i) => `
              <button class="toc-item" data-section="${section.id}">
                <span class="idx">${String(i + 1).padStart(2, "0")}</span>
                <span>${section.label}</span>
              </button>`
            ).join("")}
          </div>
        </aside>
        <div class="workspace">
          <header class="topbar">
            <div class="chip" id="sectionChip">Старт</div>
            <div class="progress" aria-hidden="true"><i id="bar"></i></div>
            <div class="chip" id="counter">1 / ${this.slides.length}</div>
          </header>
          <div class="viewport">
            <div class="stage-wrap">
              <div class="stage" id="stage"></div>
            </div>
          </div>
          <footer class="bottombar">
            <div class="chip">
              <kbd>←</kbd> <kbd>→</kbd> листать · <kbd>O</kbd> обзор · <kbd>N</kbd> заметки · <kbd>F</kbd> экран
            </div>
            <div class="right">
              <button class="icon-btn" id="notesBtn">Заметки</button>
              <button class="icon-btn" id="overviewBtn">Обзор</button>
              <button class="nav-btn" id="prev">Назад</button>
              <button class="nav-btn" id="next">Дальше</button>
            </div>
          </footer>
        </div>
      </div>
      <aside class="notes-panel" id="notes"><h3>Слова преподавателя</h3><p></p></aside>
      <div class="overview" id="overview"></div>
    `;
  }

  private bind(): void {
    this.app.querySelector("#prev")?.addEventListener("click", () => this.prev());
    this.app.querySelector("#next")?.addEventListener("click", () => this.next());
    this.app.querySelector("#notesBtn")?.addEventListener("click", () => this.toggleNotes());
    this.app.querySelector("#overviewBtn")?.addEventListener("click", () => this.toggleOverview());
    this.app.querySelectorAll<HTMLButtonElement>("[data-section]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.section;
        const idx = this.slides.findIndex((s) => s.section === id);
        if (idx >= 0) this.show(idx);
      });
    });
    window.addEventListener("keydown", (e) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        this.next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        this.prev();
      } else if (e.key === "Home") {
        this.show(0);
      } else if (e.key === "End") {
        this.show(this.slides.length - 1);
      } else if (e.key.toLowerCase() === "n") {
        this.toggleNotes();
      } else if (e.key.toLowerCase() === "o" || e.key === "Escape") {
        if (e.key === "Escape" && this.overviewOpen) this.toggleOverview();
        else if (e.key.toLowerCase() === "o") this.toggleOverview();
      } else if (e.key.toLowerCase() === "f") {
        void document.documentElement.requestFullscreen?.();
      }
    });
  }

  private fit(): void {
    const wrap = this.app.querySelector<HTMLElement>(".stage-wrap");
    const stage = this.app.querySelector<HTMLElement>(".stage");
    if (!wrap || !stage) return;
    const scale = Math.min(wrap.clientWidth / 1280, wrap.clientHeight / 720);
    stage.style.transform = `scale(${scale})`;
    wrap.style.height = `${720 * scale}px`;
  }

  prev(): void {
    if (this.index > 0) this.show(this.index - 1);
  }

  next(): void {
    if (this.index < this.slides.length - 1) this.show(this.index + 1);
  }

  show(index: number): void {
    this.index = index;
    const slide = this.slides[index];
    const stage = this.app.querySelector("#stage");
    if (!stage || !slide) return;
    const lecture = slide.lecture ? `Лекция, слайд ${slide.lecture}` : "Дополнение к лекции";
    stage.innerHTML = slide.hero
      ? `<article class="slide title-slide">${slide.html}</article>`
      : `<article class="slide">
        <div class="kicker">${slide.kicker ? `${slide.kicker} · ` : ""}${lecture}</div>
        <h2>${slide.title}</h2>
        <div class="slide-body">${slide.html}</div>
      </article>`;
    if (slide.widget) mountWidget(slide.widget, stage.querySelector(".slide-body") ?? stage);
    const section = SECTIONS.find((s) => s.id === slide.section);
    const chip = this.app.querySelector("#sectionChip");
    const counter = this.app.querySelector("#counter");
    const bar = this.app.querySelector<HTMLElement>("#bar");
    if (chip) chip.textContent = section?.label ?? "";
    if (counter) counter.textContent = `${index + 1} / ${this.slides.length}`;
    if (bar) bar.style.width = `${((index + 1) / this.slides.length) * 100}%`;
    this.app.querySelectorAll<HTMLButtonElement>("[data-section]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.section === slide.section);
    });
    const notes = this.app.querySelector("#notes p");
    if (notes) notes.textContent = slide.notes ?? "На этом слайде достаточно того, что на экране. Можно переходить дальше.";
    location.hash = String(index + 1);
    this.fit();
  }

  private toggleNotes(): void {
    this.notesOpen = !this.notesOpen;
    this.app.querySelector("#notes")?.classList.toggle("open", this.notesOpen);
  }

  private toggleOverview(): void {
    this.overviewOpen = !this.overviewOpen;
    const el = this.app.querySelector("#overview");
    if (!el) return;
    el.classList.toggle("open", this.overviewOpen);
    if (!this.overviewOpen) return;
    el.innerHTML = `<div class="overview-grid">${this.slides
      .map(
        (slide, i) => `
        <button class="thumb ${i === this.index ? "active" : ""}" data-jump="${i}">
          <b>${String(i + 1).padStart(2, "0")} · ${SECTIONS.find((s) => s.id === slide.section)?.short}</b>
          ${slide.title}
        </button>`
      )
      .join("")}</div>`;
    el.querySelectorAll<HTMLButtonElement>("[data-jump]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.show(Number(btn.dataset.jump));
        this.toggleOverview();
      });
    });
  }
}
