import type { Slide } from "../types";
import { bullets, callout, codeBlock, cols, kvTable, stat } from "../markup";

export const part3: Slide[] = [
  {
    id: "s34-packed",
    section: "ctors",
    lecture: 34,
    kicker: "Инициализация",
    title: "Внутри наследника «упакован» объект родителя",
    html: cols(
      `${bullets([
        "Снаружи кажется: интерфейс базового класса плюс новые поля и методы.",
        "Удобная аналогия: в объекте производного класса содержится объект базового.",
        "Аналогия не буквальна для внутренностей JVM — но помогает думать.",
        "Чтобы подобъект родителя собрался правильно, <b>сначала</b> вызывается его конструктор."
      ])}`,
      `<div class="nested-box">
        <div class="inner"><b>Box</b><br>width, height</div>
        <b>Box3D</b><br>+ depth
      </div>
      ${callout("note", "Без аргументов", "Если конструкторы пустые, Java сама вставляет вызов базового. Спорить не о чем.")}`
    )
  },
  {
    id: "s35-order",
    section: "ctors",
    lecture: 35,
    kicker: "Порядок",
    title: "new Cat() печатает снизу иерархии вверх по вызовам",
    html: cols(
      codeBlock(`class Animal {
    public Animal() {
        System.out.println("Конструктор класса Animal");
    }
}
class Mammal extends Animal {
    public Mammal() {
        System.out.println("Конструктор класса Mammal");
    }
}
class Cat extends Mammal {
    public Cat() {
        System.out.println("Конструктор класса Cat");
    }
}`),
      `<div class="card">
        <h3>Вывод</h3>
        <p>Конструктор класса Animal<br>Конструктор класса Mammal<br>Конструктор класса Cat</p>
        <p class="tiny" style="margin-top:10px">Цепочка начинается с самого базового. Даже без явного конструктора Cat Java сгенерирует default и всё равно вызовет родителя.</p>
      </div>`
    )
  },
  {
    id: "lab-ctors",
    section: "ctors",
    kicker: "Лаборатория",
    title: "Соберите стек конструкторов по шагам",
    widget: "constructorChain",
    html: `<div class="lab" data-widget="constructorChain">
      <div class="lab-row">
        <button class="lab-btn" data-step>Шаг</button>
        <button class="lab-btn ghost" data-reset>Сброс</button>
      </div>
      <div class="cols">
        <div class="stack">
          <div class="stack-item" data-step="2">Cat()</div>
          <div class="stack-item" data-step="1">Mammal()</div>
          <div class="stack-item" data-step="0">Animal()</div>
        </div>
        <div class="console"></div>
      </div>
    </div>`
  },
  {
    id: "s36-error",
    section: "ctors",
    lecture: 36,
    kicker: "Ошибка компиляции",
    title: "Нет конструктора без параметров — super сам не угадает",
    html: cols(
      codeBlock(`class Box {
    public double width, height;
    public Box(double width, double height) {
        this.width = width;
        this.height = height;
    }
}
class Box3D extends Box {
    public double depth;
    public Box3D(double depth) {
        this.depth = depth; // нет super(...) !
    }
}`),
      `${callout("warn", "Почему падает", "Компилятор обязан вызвать конструктор Box, а без аргументов такого нет. Нужен явный вызов.")}`
    )
  },
  {
    id: "s37-super-call",
    section: "ctors",
    lecture: 37,
    kicker: "super(...)",
    title: "Первая строка конструктора ребёнка — звонок родителю",
    html: codeBlock(`class Box3D extends Box {
    public double depth;
    public Box3D(double width, double height, double depth) {
        super(width, height); // вызов конструктора суперкласса
        this.depth = depth;
    }
}`)
  },
  {
    id: "s38-super-word",
    section: "ctors",
    lecture: 38,
    kicker: "Ключевое слово super",
    title: "super ссылается на скрытый объект суперкласса",
    html: cols(
      `${bullets([
        "Наследование в лекции объясняют так: в объект ребёнка добавляется скрытый объект родителя.",
        "<code>super</code> — ссылка на него.",
        "Можно звать члены суперкласса, если модификатор позволяет.",
        "Рядом с <code>this</code>: this — я, super — родительская часть меня."
      ])}`,
      codeBlock(`class Box {
    private double width, height;
    public double getArea() {
        return width * height;
    }
}
class Box3D extends Box {
    private double depth;
    public double get3DArea() {
        double area2D = super.getArea();
        return area2D * depth;
    }
}`)
    )
  },
  {
    id: "s40-problem",
    section: "override",
    lecture: 40,
    kicker: "Проблема",
    title: "getInfo() родителя врёт про Box3D",
    html: cols(
      `${codeBlock(`Box3D box = new Box3D(100, 200, 300);
System.out.println(box.getInfo());
// Объект Box {ширина = 100.0, высота = 200.0}`)}
       <p class="tiny">Третий параметр depth исчез. Метод суперкласса не знает о нововведениях подкласса.</p>`,
      `${callout("warn", "Это не баг печати", "Это системная проблема наследования: старый метод описывает неполный объект. Нужна новая версия с той же командой.")}`
    )
  },
  {
    id: "s41-bad",
    section: "override",
    lecture: 41,
    kicker: "Плохой выход",
    title: "get3DInfo() работает, но путает всех",
    html: cols(
      `${bullets([
        "Интуитивно: завести новый метод с другим именем.",
        "Печатает ширину, высоту и глубину — вроде победа.",
        "Теперь у Box3D <b>два</b> метода информации, один из них некорректный.",
        "Коллеги не знают, какой звать."
      ])}`,
      `${callout("ok", "Правильный путь", "«Переписать» getInfo() для Box3D. Одно имя, одна сигнатура, другая реализация. Это и есть method overriding.")}`
    )
  },
  {
    id: "s42-override",
    section: "override",
    lecture: 42,
    kicker: "@Override",
    title: "Сигнатуры совпадают — срабатывает переопределение",
    html: cols(
      codeBlock(`class Box3D extends Box {
    @Override
    public String getInfo() {
        return "Объект Box3D {" +
            "ширина = " + super.getWidth() +
            ", высота = " + super.getHeight() +
            ", глубина = " + depth + '}';
    }
}`),
      `${callout("note", "Аннотация", "Это пояснение компилятору и анализаторам. Код без @Override тоже скомпилируется, но грамотный код аннотацию ставит: опечатка в имени сразу всплывёт.")}`
    )
  },
  {
    id: "s43-same-name",
    section: "override",
    lecture: 43,
    kicker: "Один вызов",
    title: "box.getInfo() и box3D.getInfo() — разные тела",
    html: cols(
      `${codeBlock(`Box box = new Box(600, 600);
System.out.println(box.getInfo());
Box3D box3D = new Box3D(100, 200, 300);
System.out.println(box3D.getInfo());`)}
       <p>Вывод:</p>
       <p class="tiny">Объект Box {ширина = 600.0, высота = 600.0}<br>Объект Box3D {ширина = 100.0, высота = 200.0, глубина = 300.0}</p>`,
      `${callout("warn", "Не путать", "Перегрузка — несколько методов с одним именем, но разной сигнатурой (раннее связывание). Переопределение — та же сигнатура в наследнике (позднее). Метод может быть и тем, и другим.")}`
    )
  },
  {
    id: "s44-final",
    section: "override",
    lecture: 44,
    kicker: "final",
    title: "Иногда наследовать и переопределять нельзя",
    html: cols(
      codeBlock(`final class A {}
class B extends A { } // ошибка компиляции

class C {
    final public void foo() {}
}
class D extends C {
    @Override
    public void foo() {} // ошибка
}`),
      `${callout("idea", "Зачем", "Закрыть иерархию (безопасность, неизменный контракт) или запретить ломать метод, от которого зависит инвариант родителя.")}`
    )
  },
  {
    id: "s45-object",
    section: "object",
    lecture: 45,
    kicker: "Класс Object",
    title: "У каждого класса в Java есть тайный предок",
    html: cols(
      `<p class="lede">Object — суперкласс всех классов. Даже пустой <code>class Box{}</code> умеет toString, equals, hashCode.</p>
       ${callout("note", "Корень иерархии", "Object ни от кого не наследуется. Все остальные — напрямую или через цепочку.")}`,
      kvTable(
        ["Метод", "Зачем"],
        [
          ["clone()", "Новый объект, похожий на текущий"],
          ["equals(Object)", "Равнозначность"],
          ["finalize()", "Перед сборкой мусора (исторически)"],
          ["getClass()", "Класс во время выполнения"],
          ["hashCode()", "Хеш"],
          ["notify / notifyAll / wait", "Потоки"],
          ["toString()", "Строковое описание"]
        ]
      )
    )
  },
  {
    id: "s46-tostring-default",
    section: "object",
    lecture: 46,
    kicker: "toString по умолчанию",
    title: "Box@1540e19d — это не баг, это Object",
    html: cols(
      codeBlock(`class Box {}
System.out.println(new Box().toString());
// com.company.Box@1540e19d`),
      `${bullets([
        "Печатается полное имя класса и шестнадцатеричный хеш.",
        "Полей Object не знает — вы их не описывали в предке.",
        "Правило сообщества: если нужна человеческая строка — переопределяйте toString().",
        "getInfo() в примерах выше был только учебным именем."
      ])}`
    )
  },
  {
    id: "s47-tostring-ok",
    section: "object",
    lecture: 47,
    kicker: "Переопределили",
    title: "println(box) сам вызовет toString()",
    html: cols(
      codeBlock(`@Override
public String toString() {
    return "Box{width=" + width +
           ", height=" + height + '}';
}
System.out.println(box.toString());
System.out.println(box);
// обе строки: Box{width=100.0, height=200.0}`),
      `${callout("ok", "Привычка профи", "Логи, отладчик, конкатенация строк — везде сработает ваш toString. Не заставляйте коллег писать ручные getInfo.")}`
    )
  },
  {
    id: "s48-prim",
    section: "cast",
    lecture: 48,
    kicker: "Примитивы",
    title: "Расширение тихое, сужение — только явно",
    html: cols(
      `${codeBlock(`int x = 1000;
long y = x;          // widening, OK

long l = 10000000000L;
int i = (int) l;     // narrowing, явно`)}
       ${callout("note", "Слова преподавателя", "Это напоминание. Теперь та же логика — но для ссылок и иерархии классов.")}`,
      `${bullets([
        "<b>Widening</b> — в более широкий тип, без потери, автоматически.",
        "<b>Narrowing</b> — в более узкий, данные могут пострадать, нужен каст.",
        "Ещё есть boxing/unboxing к оболочкам — это на потом.",
        "Пример из лекции: 10000000000L → int даёт 1410065408; 1E44 → float даёт Infinity."
      ])}`
    )
  },
  {
    id: "s49-ref",
    section: "cast",
    lecture: 49,
    kicker: "Ссылки",
    title: "Восходящее безопасно. Нисходящее — с огнём",
    html: cols(
      codeBlock(`Student student = new Student();
Person person = student;            // upcast, OK

Person person = new Student();
Student student = (Student) person; // downcast, явно

Person person = new Person();
Student student = (Student) person; // ClassCastException`),
      `${callout("warn", "Запомнить", "К родителю — всегда безопасно и само. К наследнику — явно и опасно. Если объект на самом деле не наследник — исключение в runtime.")}`
    )
  },
  {
    id: "s50-rules",
    section: "cast",
    lecture: 50,
    kicker: "Правила",
    title: "Ссылки приводят по иерархии, объект в куче не мутирует",
    html: bullets([
      "Примитивы сравнивают по диапазону байт. Ссылки — по дереву классов.",
      "Потомок входит во множество родителя: каждый Student есть Person, каждая Dog есть Animal. Обратное неверно.",
      "<b>Несовместимые типы нельзя.</b> String в Point не превратится, даже с кастом — ошибка компиляции.",
      "<b>В суперкласс можно.</b> Object o1 = new String(...); Object o2 = new Point(...); это widening.",
      "Физический объект остаётся String или Point. Мы лишь смотрим на него через другую ссылку."
    ])
  },
  {
    id: "s51-cce",
    section: "cast",
    lecture: 51,
    kicker: "Runtime",
    title: "Компилятор не спасает от лживого downcast",
    html: cols(
      codeBlock(`Person person = new Person();
Student s = (Student) person;
// ClassCastException:
// Person cannot be cast to Student`),
      `${bullets([
        "Проверка корректности — во время выполнения.",
        "Сужающее преобразование верно только если объект <b>по факту</b> этого класса.",
        "Нисходящее — операция, обратная восходящему, не волшебная смена сути."
      ])}`
    )
  },
  {
    id: "s52-ok-down",
    section: "cast",
    lecture: 52,
    kicker: "Как надо",
    title: "Сначала подняли до Person, потом вернули Student",
    html: cols(
      codeBlock(`Person person = new Student(); // внимание: в куче Student
Student s = (Student) person;  // ок`),
      `${callout("ok", "Ещё раз", "Нисходящее преобразование восстанавливает тип после восходящего. Не делает человека студентом.")}`
    )
  },
  {
    id: "lab-cast",
    section: "cast",
    kicker: "Лаборатория",
    title: "Три кнопки — три судьбы ссылки",
    widget: "castingLab",
    html: `<div class="lab" data-widget="castingLab">
      <div class="lab-row">
        <button class="lab-btn" data-up>Upcast Student → Person</button>
        <button class="lab-btn" data-down-ok>Downcast после upcast</button>
        <button class="lab-btn ghost" data-down-bad>Downcast чистого Person</button>
      </div>
      <div class="console">Объект не меняется. Меняется очки, через которые на него смотрят.</div>
    </div>`
  },
  {
    id: "s53-arrays",
    section: "cast",
    lecture: 53,
    kicker: "Массивы",
    title: "int[] в double[] не превращается. Зато любой массив — Object",
    html: cols(
      `${codeBlock(`int[] array = {1,3,4,5,6};
double[] array2 = (double[]) array; // нельзя`)}
       <p class="tiny">Даже если отдельные int можно расширить до double, массивы — несовместимые типы.</p>`,
      `${callout("note", "Исключение", "Иерархии массивов нет, но каждый массив — экземпляр Object. Расширение к Object и обратное сужение — можно.")}`
    )
  },
  {
    id: "s54-tune",
    section: "poly",
    lecture: 54,
    kicker: "Upcasting в деле",
    title: "Гитара является инструментом — ей можно сказать play()",
    html: cols(
      `${bullets([
        "Наследование = «новый класс есть разновидность базового».",
        "Все сообщения базового класса законны и для потомка.",
        "Есть Instrument.play() — будет и Guitar.play()."
      ])}`,
      `${callout("idea", "Зачем это полиморфизму", "Метод, ждущий родителя, сможет принять любого ребёнка. Одна точка входа вместо зоопарка перегрузок.")}`
    )
  },
  {
    id: "s55-one-tune",
    section: "poly",
    lecture: 55,
    kicker: "Один метод",
    title: "tune(Instrument) настраивает всю оркестровую яму",
    html: cols(
      codeBlock(`public static void tune(Instrument instrument) {
    instrument.play();
}
tune(instrument);
tune(guitar);
tune(violin);
tune(saxophone);`),
      `${bullets([
        "Если написать tune(Guitar), tune(Violin), tune(Saxophone) — каждый новый класс потребует новый метод.",
        "Ссылка на базовый тип делает код обобщённым.",
        "В этом главное преимущество полиморфизма по лекции."
      ])}`
    )
  },
  {
    id: "lab-orch",
    section: "poly",
    kicker: "Лаборатория",
    title: "Оркестр: одна команда tune, разные голоса",
    widget: "orchestra",
    html: `<div class="lab" data-widget="orchestra">
      <div class="lab-row">
        <button class="lab-btn" data-tune-all>tune(все)</button>
        <button class="lab-btn ghost" data-tune="Guitar">гитара</button>
        <button class="lab-btn ghost" data-tune="Violin">скрипка</button>
        <button class="lab-btn ghost" data-tune="Saxophone">саксофон</button>
      </div>
      <div class="shape-board">
        <div class="instrument" data-name="Instrument">🎼 Instrument</div>
        <div class="instrument" data-name="Guitar">🎸 Guitar</div>
        <div class="instrument" data-name="Violin">🎻 Violin</div>
        <div class="instrument" data-name="Saxophone">🎷 Saxophone</div>
      </div>
      <div class="console">Java вызовет play() фактического объекта, не тип параметра.</div>
    </div>`
  },
  {
    id: "s56-virtual",
    section: "poly",
    lecture: 56,
    kicker: "Виртуальные методы",
    title: "В Java почти все методы уже виртуальные",
    html: cols(
      `${bullets([
        "Не-static, не-private, не-final — виртуальные по умолчанию. Слово virtual не нужно.",
        "Поэтому пример с гитарой сработал без лишней магии.",
        "Почему тогда не сделать виртуальными все? Это дороже: дольше вызов и лишний указатель на объект."
      ])}`,
      `${callout("idea", "Связывание", "Присоединение вызова к телу метода. До запуска — раннее/статическое. Во время выполнения, по типу объекта — позднее/динамическое.")}`
    )
  },
  {
    id: "s56-binding",
    section: "poly",
    lecture: 56,
    kicker: "Почему компилятор «не знает»",
    title: "tune видит Instrument, а играет гитара",
    html: cols(
      `${codeBlock(`public static void tune(Instrument i) {
    i.play();
}`)}
       <p>Компилятор не выбирает Guitar.play заранее. Механизм вызова в runtime смотрит фактический тип и берёт нужное тело.</p>`,
      `${callout("note", "Раннее связывание здесь бессильно", "Есть только ссылка на Instrument. Однозначности нет — поэтому нужен runtime binding.")}`
    )
  },
  {
    id: "s57-summary",
    section: "poly",
    lecture: 57,
    kicker: "Итог по связыванию",
    title: "Четыре правила, которые стоит вызубрить",
    html: kvTable(
      ["Тема", "Правило Java"],
      [
        ["Когда", "Статическое — на компиляции. Динамическое — в runtime."],
        ["Кто как", "private, final, static и поля — статически. Остальные методы — динамически (виртуально)."],
        ["По чему решают", "Статика смотрит тип ссылки. Динамика — фактический тип объекта."],
        ["Перегрузка vs override", "Перегруженные — статическое связывание. Переопределённые — динамическое."]
      ]
    )
  },
  {
    id: "s57-shapes",
    section: "poly",
    lecture: 57,
    kicker: "Фигуры",
    title: "Shape s = new Circle(); s.draw() рисует круг",
    html: cols(
      `${bullets([
        "Кажется ошибкой: переменная Shape, объект Circle.",
        "Это законно: Circle является Shape.",
        "Кажется, вызовется Shape.draw(). На деле — Circle.draw(), позднее связывание.",
        "Базовый класс задаёт общий интерфейс: draw и erase. Дети наполняют его смыслом."
      ])}`,
      `${callout("ok", "Расширяемость", "Новые типы добавляют с минимальными правками. Хорошая программа почти целиком говорит на языке интерфейса родителя.")}`
    )
  },
  {
    id: "lab-shapes",
    section: "poly",
    kicker: "Лаборатория",
    title: "Одна ссылка Shape — три характера",
    widget: "shapeStudio",
    html: `<div class="lab" data-widget="shapeStudio">
      <div class="lab-row">
        <button class="lab-btn" data-shape="Circle">new Circle()</button>
        <button class="lab-btn" data-shape="Triangle">new Triangle()</button>
        <button class="lab-btn" data-shape="Square">new Square()</button>
      </div>
      <div class="shape-board">
        <div class="shape-visual"></div>
        <div class="console">Shape s = ...; s.draw();</div>
      </div>
    </div>`
  },
  {
    id: "s58-why-abs",
    section: "abstract",
    lecture: 58,
    kicker: "Абстрактные классы",
    title: "«Геометрическая фигура» существует как идея, не как new",
    html: cols(
      `${bullets([
        "У фигур есть центр, площадь, периметр — но у абстрактной фигуры нельзя честно посчитать площадь.",
        "Методы Shape в учебном примере фиктивны: вернуть null и ждать беды.",
        "Класс нужен, чтобы задать общий интерфейс. Создавать его экземпляры почти всегда бессмысленно.",
        "Значит, лучше запретить new на уровне языка."
      ])}`,
      `${callout("idea", "Слово лекции", "Грамотное выделение абстракций структурирует систему и позволяет повторно использовать понятие для конкретных реализаций.")}`
    )
  },
  {
    id: "s58-syntax",
    section: "abstract",
    lecture: 58,
    kicker: "Синтаксис",
    title: "Хотя бы один abstract-метод — весь класс abstract",
    html: cols(
      codeBlock(`abstract class Shape {
    abstract void draw();
}
// new Shape(); // невозможно

class Circle extends Shape {
    @Override
    void draw() { /* надо реализовать все abstract */ }
}`),
      `${bullets([
        "Абстрактный метод без тела: только объявление.",
        "Класс тоже помечают abstract, иначе ошибка компилятора.",
        "Не переопределили все abstract — ребёнок тоже abstract.",
        "Не все методы обязаны быть абстрактными: поля, конструкторы и обычные методы можно."
      ])}`
    )
  },
  {
    id: "s58-contract",
    section: "abstract",
    lecture: 58,
    kicker: "Контракт",
    title: "Shape требует: нарисуй и посчитай площадь",
    html: cols(
      codeBlock(`abstract class Shape {
    private Point center;
    public abstract void drawFigure(Graphics2D g);
    public abstract double getArea();
}
class Circle extends Shape {
    private int radius;
    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }
}`),
      `${callout("ok", "Зачем механизм", "Подчёркивает абстрактность сущности, ловит ошибки, говорит пользователю и компилятору, как жить с типом. При рефакторинге общие методы поднимают вверх по иерархии.")}`
    )
  },
  {
    id: "recap",
    section: "finale",
    kicker: "Сводка",
    title: "Вся лекция на одной странице",
    html: `<div class="mini-grid">
      <div class="card"><h3>Класс / объект</h3><p>Чертёж и экземпляр. Сначала класс. Атрибуты — состояние, методы — поведение.</p></div>
      <div class="card"><h3>Столпы</h3><p>Абстракция режет лишнее. Инкапсуляция прячет. Наследование — is-a. Полиморфизм — одна команда.</p></div>
      <div class="card"><h3>this / super</h3><p>this — я и мои конструкторы. super — родительский конструктор и методы. Сначала super.</p></div>
      <div class="card"><h3>Типы и связка</h3><p>Upcast тих, downcast опасен. Override + позднее связывание. abstract — контракт без new.</p></div>
    </div>`
  },
  {
    id: "quiz",
    section: "finale",
    kicker: "Проверка",
    title: "16 вопросов по тексту лекции",
    widget: "quiz",
    html: `<div data-widget="quiz" data-quiz></div>`
  },
  {
    id: "end",
    section: "finale",
    hero: true,
    title: "Конец",
    html: `
      <div class="orbit"></div>
      <div class="hero-title">
        <div class="kicker">Лекция 1 · закрыта</div>
        <h1>Пишите иерархии, не копипасту</h1>
        <p class="lede" style="margin-top:18px">Следующий шаг — открыть IDE и собрать Employee / Manager или Shape / Circle так, чтобы компилятор сам запретил глупости: забытый super, ложный downcast, new у abstract.</p>
        <div class="stats">
          ${stat("O", "карта слайдов")}
          ${stat("N", "заметки")}
          ${stat("← →", "навигация")}
        </div>
      </div>
    `
  }
];
