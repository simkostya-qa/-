export function mountWidget(name: string, root: Element | null): void {
  if (!root) return;
  const host = root.querySelector(`[data-widget="${name}"]`) ?? root;
  const widget = widgets[name];
  if (widget) widget(host as HTMLElement);
}

const widgets: Record<string, (el: HTMLElement) => void> = {
  catFactory,
  encapsulationLab,
  accessGrid,
  thisDemo,
  constructorChain,
  castingLab,
  orchestra,
  shapeStudio,
  quiz
};

type Cat = {
  id: number;
  name: string;
  breed: string;
  color: string;
  age: number;
};

function catFactory(el: HTMLElement): void {
  const cats: Cat[] = [
    { id: 1, name: "Мурка", breed: "Сиамская", color: "cream", age: 3 },
    { id: 2, name: "Барсик", breed: "Британская", color: "gray", age: 5 }
  ];
  let seq = 3;

  const render = (): void => {
    const grid = el.querySelector(".cat-grid");
    const log = el.querySelector(".console");
    if (!grid) return;
    grid.innerHTML = cats
      .map(
        (cat) => `
        <article class="cat-card">
          <div class="face">${cat.color === "black" ? "🐈‍⬛" : "🐈"}</div>
          <b>${cat.name}</b>
          <div class="tiny">${cat.breed} · ${cat.age} лет</div>
          <button class="lab-btn ghost" data-sleep="${cat.id}" style="margin-top:8px">спать()</button>
        </article>`
      )
      .join("");
    grid.querySelectorAll<HTMLButtonElement>("[data-sleep]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = cats.find((c) => c.id === Number(btn.dataset.sleep));
        if (log && cat) log.textContent = `> ${cat.name}.спать()\n${cat.name} свернулась клубком. Это метод объекта, не глобальная функция.`;
      });
    });
  };

  el.querySelector("[data-add]")?.addEventListener("click", () => {
    const name = (el.querySelector('[name="name"]') as HTMLInputElement).value || "Котик";
    const breed = (el.querySelector('[name="breed"]') as HTMLSelectElement).value;
    const color = (el.querySelector('[name="color"]') as HTMLSelectElement).value;
    const age = Number((el.querySelector('[name="age"]') as HTMLInputElement).value) || 1;
    cats.push({ id: seq++, name, breed, color, age });
    const log = el.querySelector(".console");
    if (log) log.textContent = `> Cat ${name} = new Cat("${name}", "${breed}", ${age})\nЭкземпляр создан по одному чертежу — классу Cat.`;
    render();
  });
  render();
}

function encapsulationLab(el: HTMLElement): void {
  let age = 4;
  const breed = "Мейн-кун";
  const paint = (): void => {
    const ageEl = el.querySelector("[data-age]");
    const breedEl = el.querySelector("[data-breed]");
    if (ageEl) ageEl.textContent = String(age);
    if (breedEl) breedEl.textContent = breed;
  };
  const log = (msg: string): void => {
    const box = el.querySelector(".console");
    if (box) box.textContent = msg;
  };
  el.querySelector("[data-older]")?.addEventListener("click", () => {
    age += 1;
    paint();
    log(`setAge(${age}) → ок. Возраст растёт только вперёд.`);
  });
  el.querySelector("[data-younger]")?.addEventListener("click", () => {
    log(`setAge(${age - 1}) → отказ. Инкапсуляция: сеттер не даёт кошке молодеть.`);
  });
  el.querySelector("[data-breed-hack]")?.addEventListener("click", () => {
    log(`cat.breed = "Дворняга" → поле private. Снаружи его не переписать. Есть только getBreed().`);
  });
  paint();
}

function accessGrid(el: HTMLElement): void {
  const cells = el.querySelectorAll("[data-cell]");
  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      cells.forEach((c) => c.classList.remove("on"));
      cell.classList.add("on");
      const note = el.querySelector(".console");
      if (note) note.textContent = cell.getAttribute("data-explain") ?? "";
    });
  });
}

function thisDemo(el: HTMLElement): void {
  const out = el.querySelector(".console");
  const run = (label: string, lines: string[]): void => {
    if (out) out.textContent = lines.join("\n");
    el.querySelectorAll(".stack-item").forEach((item) => {
      item.classList.toggle("on", item.getAttribute("data-ctor") === label);
    });
  };
  el.querySelector("[data-undef]")?.addEventListener("click", () => {
    run("empty", [
      "new Person()",
      "  this(\"Undefined\", 18)",
      "    this.name = Undefined",
      "    this.age = 18",
      "Name: Undefined    Age: 18"
    ]);
  });
  el.querySelector("[data-tom]")?.addEventListener("click", () => {
    run("name", [
      "new Person(\"Tom\")",
      "  this(\"Tom\", 18)",
      "    this.name = Tom   // поле, не параметр",
      "    this.age = 18",
      "Name: Tom    Age: 18"
    ]);
  });
  el.querySelector("[data-sam]")?.addEventListener("click", () => {
    run("full", [
      "new Person(\"Sam\", 25)",
      "  this.name = Sam",
      "  this.age = 25",
      "Name: Sam    Age: 25",
      "this — ссылка на текущий экземпляр."
    ]);
  });
}

function constructorChain(el: HTMLElement): void {
  const steps = ["Animal", "Mammal", "Cat"];
  let i = -1;
  const paint = (): void => {
    el.querySelectorAll(".stack-item").forEach((item) => {
      const step = Number(item.getAttribute("data-step") ?? "99");
      item.classList.toggle("on", i >= 0 && step <= i);
    });
    const log = el.querySelector(".console");
    if (!log) return;
    if (i < 0) log.textContent = "> Cat cat = new Cat();\nНажмите «Шаг», чтобы увидеть цепочку конструкторов.";
    else {
      const printed = steps.slice(0, i + 1).map((n) => `Конструктор класса ${n}`);
      log.textContent = printed.join("\n");
    }
  };
  el.querySelector("[data-step]")?.addEventListener("click", () => {
    i = Math.min(i + 1, steps.length - 1);
    paint();
  });
  el.querySelector("[data-reset]")?.addEventListener("click", () => {
    i = -1;
    paint();
  });
  paint();
}

function castingLab(el: HTMLElement): void {
  const log = el.querySelector<HTMLElement>(".console");
  const write = (ok: boolean, msg: string): void => {
    if (log instanceof HTMLElement) {
      log.style.color = ok ? "#b8f0c8" : "#ffb3a3";
      log.textContent = msg;
    }
  };
  el.querySelector("[data-up]")?.addEventListener("click", () => {
    write(true, "Person p = student;  // upcasting, автоматически\nОбъект остаётся Student. Меняется только тип ссылки.");
  });
  el.querySelector("[data-down-ok]")?.addEventListener("click", () => {
    write(true, "Person p = new Student();\nStudent s = (Student) p;  // ок: фактический тип — Student");
  });
  el.querySelector("[data-down-bad]")?.addEventListener("click", () => {
    write(false, "Person p = new Person();\nStudent s = (Student) p;\nClassCastException: Person cannot be cast to Student");
  });
}

type Voice = { name: string; emoji: string; line: string };

function orchestra(el: HTMLElement): void {
  const band: Voice[] = [
    { name: "Instrument", emoji: "🎼", line: "Играет инструмент" },
    { name: "Guitar", emoji: "🎸", line: "Играет гитара" },
    { name: "Violin", emoji: "🎻", line: "Играет скрипка" },
    { name: "Saxophone", emoji: "🎷", line: "Играет саксофон" }
  ];
  const log = el.querySelector(".console");
  const play = async (which: Voice | "all"): Promise<void> => {
    const cards = [...el.querySelectorAll(".instrument")];
    cards.forEach((c) => c.classList.remove("play"));
    const seq = which === "all" ? band : [which];
    const lines: string[] = ["tune(Instrument i) { i.play(); }"];
    for (const voice of seq) {
      const card = cards.find((c) => c.getAttribute("data-name") === voice.name);
      card?.classList.add("play");
      lines.push(`> ${voice.name}.play() → ${voice.line}`);
      if (log) log.textContent = lines.join("\n");
      await wait(520);
      card?.classList.remove("play");
    }
  };
  el.querySelector("[data-tune-all]")?.addEventListener("click", () => void play("all"));
  el.querySelectorAll<HTMLButtonElement>("[data-tune]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const voice = band.find((b) => b.name === btn.dataset.tune);
      if (voice) void play(voice);
    });
  });
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function shapeStudio(el: HTMLElement): void {
  const shapes = [
    { name: "Circle", draw: "Рисуем круг", css: "border-radius:50%;background:#ef7a5a;width:72px;height:72px" },
    { name: "Triangle", draw: "Рисуем треугольник", css: "width:0;height:0;border-left:40px solid transparent;border-right:40px solid transparent;border-bottom:72px solid #e2b15a;background:transparent" },
    { name: "Square", draw: "Рисуем квадрат", css: "background:#5fd0c0;width:72px;height:72px" }
  ];
  const log = el.querySelector(".console");
  el.querySelectorAll<HTMLButtonElement>("[data-shape]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const shape = shapes.find((s) => s.name === btn.dataset.shape);
      const vis = el.querySelector<HTMLElement>(".shape-visual");
      if (!shape || !vis || !log) return;
      vis.innerHTML = `<div style="${shape.css}"></div>`;
      log.textContent = `Shape s = new ${shape.name}();\ns.draw()  →  ${shape.draw}\nСсылка типа Shape, фактический объект — ${shape.name}. Позднее связывание.`;
    });
  });
}

type Question = {
  q: string;
  options: string[];
  correct: number;
  why: string;
};

const QUESTIONS: Question[] = [
  {
    q: "Класс — это…",
    options: ["Экземпляр, уже лежащий в памяти", "Чертёж / шаблон для создания объектов", "Любая функция с переменными", "Только таблица в базе данных"],
    correct: 1,
    why: "Класс описывает структуру. Объект — конкретный экземпляр, созданный по этому чертежу."
  },
  {
    q: "Какая пара верно описывает состояние и поведение?",
    options: ["Методы и конструкторы", "Атрибуты и методы", "Пакеты и импорты", "static и final"],
    correct: 1,
    why: "Данные (атрибуты) — состояние. Методы — поведение, вызываемое сообщением объекту."
  },
  {
    q: "Инкапсуляция в примере с кошкой означает, что…",
    options: ["Кошка обязана уметь охотиться", "Поля прячут, а меняют через контролируемый интерфейс", "Любой класс может править age напрямую", "Наследовать можно только public-поля"],
    correct: 1,
    why: "Возраст растёт только вверх, породу нельзя сменить. Это публичные методы, а не свободный доступ к полям."
  },
  {
    q: "Отношение наследования — это…",
    options: ["has-a (имеет)", "is-a (является)", "uses-a (пользуется)", "like-a (похоже)"],
    correct: 1,
    why: "Manager является Employee. Композиция — это has-a: Document содержит FileManager."
  },
  {
    q: "Почему копировать класс вместо наследования — плохая идея?",
    options: ["Копирование всегда быстрее", "Нет исходников библиотек, лицензии, баги не чинятся в копиях", "Java запрещает копировать текст", "Наследование запрещено в Java"],
    correct: 1,
    why: "Нет доступа к .jar, юридические риски и вечное отставание от исправлений автора."
  },
  {
    q: "protected в родителе доступен…",
    options: ["Всем подряд, как public", "Только внутри того же класса", "Членам класса и наследникам", "Только из другого пакета"],
    correct: 2,
    why: "private закрыт даже для детей. protected открыт наследникам, но слабее изолирует родителя."
  },
  {
    q: "this(\"Tom\", 18) в конструкторе Person делает…",
    options: ["Вызов конструктора суперкласса", "Создание нового объекта", "Делегирование другому конструктору этого же класса", "Преобразование типов"],
    correct: 2,
    why: "this(...) вызывает соседний конструктор. super(...) — конструктор родителя."
  },
  {
    q: "При new Cat() конструкторы вызываются в порядке…",
    options: ["Cat → Mammal → Animal", "Animal → Mammal → Cat", "Только Cat", "Случайном"],
    correct: 1,
    why: "Сначала инициализируется самый базовый подобъект, затем вниз по цепочке."
  },
  {
    q: "Если у Box нет конструктора без параметров, в Box3D нужно…",
    options: ["Ничего, Java додумает сама", "Явно вызвать super(width, height)", "Написать this.Box()", "Сделать поля static"],
    correct: 1,
    why: "Иначе ошибка компиляции: компилятор не знает, какие аргументы передать родителю."
  },
  {
    q: "Переопределение метода требует…",
    options: ["Другое имя метода", "Совпадающую сигнатуру и обычно @Override", "Обязательно другое число параметров", "Ключевое слово virtual"],
    correct: 1,
    why: "В Java методы и так виртуальные. Совпадает сигнатура. @Override ловит опечатки на этапе компиляции."
  },
  {
    q: "final class A {} означает…",
    options: ["Класс нельзя инстанциировать", "От A нельзя наследоваться", "Все поля константы", "Методы станут private"],
    correct: 1,
    why: "final на классе запрещает extends. final на методе запрещает @Override."
  },
  {
    q: "toString() по умолчанию печатает…",
    options: ["Все поля объекта", "Имя класса и хеш, например Box@1540e19d", "null", "Только тип пакета"],
    correct: 1,
    why: "Метод Object.toString() не знает ваших полей. Их нужно переопределить."
  },
  {
    q: "Person p = student; — это…",
    options: ["Сужающее, опасно", "Восходящее, безопасно и автоматически", "Упаковка int в Integer", "Ошибка компиляции всегда"],
    correct: 1,
    why: "Студент является человеком. Объект не меняется, меняется тип ссылки."
  },
  {
    q: "Person p = new Person(); Student s = (Student) p; чем кончится?",
    options: ["Успехом", "ClassCastException в runtime", "Ошибкой компиляции", "null"],
    correct: 1,
    why: "Нисходящее корректно, только если фактический тип уже Student (обратное к upcast)."
  },
  {
    q: "Позднее связывание выбирает метод по…",
    options: ["Типу ссылки на этапе компиляции", "Фактическому типу объекта в runtime", "Имени файла", "Порядку в исходнике"],
    correct: 1,
    why: "Поэтому Shape s = new Circle(); s.draw() рисует круг. Перегрузка — раннее связывание, переопределение — позднее."
  },
  {
    q: "Абстрактный класс можно создать через new?",
    options: ["Да, если есть конструктор", "Нет, компилятор запретит", "Только внутри пакета", "Да, но методы вернут null"],
    correct: 1,
    why: "abstract class — контракт. Экземпляр создают у конкретного наследника, который реализовал все abstract-методы."
  }
];

function quiz(el: HTMLElement): void {
  let i = 0;
  let score = 0;
  let locked = false;

  const paint = (): void => {
    const box = el.matches("[data-quiz]")
      ? el
      : el.querySelector("[data-quiz]");
    if (!box) return;
    if (i >= QUESTIONS.length) {
      const pct = Math.round((score / QUESTIONS.length) * 100);
      const verdict =
        pct === 100
          ? "Идеально. Можно идти писать иерархии без копипасты."
          : pct >= 75
            ? "Отлично. Подсмотрите слабые места и вернитесь к ним по обзору (клавиша O)."
            : pct >= 50
              ? "База есть. Пройдите ещё раз блоки про super, приведение типов и связывание."
              : "Это повторение — откройте оглавление и пройдитесь по столпам ООП заново.";
      box.innerHTML = `
        <div class="card">
          <div class="stat"><b>${score} / ${QUESTIONS.length}</b><span>${pct}%</span></div>
          <p class="lede" style="margin-top:12px">${verdict}</p>
          <button class="lab-btn" data-restart style="margin-top:16px">Ещё раз</button>
        </div>`;
      box.querySelector("[data-restart]")?.addEventListener("click", () => {
        i = 0;
        score = 0;
        locked = false;
        paint();
      });
      return;
    }
    const q = QUESTIONS[i];
    box.innerHTML = `
      <div class="tiny">Вопрос ${i + 1} из ${QUESTIONS.length} · верно ${score}</div>
      <h3 style="margin:8px 0 14px;font-size:22px">${q.q}</h3>
      ${q.options
        .map(
          (opt, idx) =>
            `<button class="quiz-option" data-opt="${idx}"><b>${"ABCD"[idx]}.</b> ${opt}</button>`
        )
        .join("")}
      <div class="console" style="margin-top:8px"></div>
    `;
    locked = false;
    box.querySelectorAll<HTMLButtonElement>("[data-opt]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (locked) return;
        locked = true;
        const pick = Number(btn.dataset.opt);
        const options = box.querySelectorAll(".quiz-option");
        options[q.correct]?.classList.add("correct");
        if (pick === q.correct) {
          score += 1;
        } else {
          btn.classList.add("wrong");
        }
        const cons = box.querySelector(".console");
        if (cons) cons.textContent = q.why;
        window.setTimeout(() => {
          i += 1;
          paint();
        }, 1600);
      });
    });
  };
  paint();
}
