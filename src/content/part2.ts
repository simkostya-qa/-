import type { Slide } from "../types";
import { bullets, callout, codeBlock, cols, kvTable } from "../markup";

export const part2: Slide[] = [
  {
    id: "s17-principles",
    section: "abstraction",
    lecture: 17,
    kicker: "Принцип абстракции",
    title: "Хорошая абстракция подчёркивает нужное и молчит об остальном",
    html: cols(
      `${bullets([
        "Упрощённое описание системы: одни свойства выделяют, другие опускают.",
        "Она же помогает <b>отличать</b> один объект от другого.",
        "<b>Минимальных обязательств:</b> интерфейс описывает только существенное поведение.",
        "<b>Наименьшего удивления:</b> ни больше, ни меньше, чем объект умеет."
      ])}`,
      `${callout("idea", "Модель ≠ мир", "Реальные объекты слишком сложны. Мы строим модель автомобиля, спортсмена, преподавателя — и сознательно врём умолчанием.")}`
    )
  },
  {
    id: "s17-kinds",
    section: "abstraction",
    lecture: 17,
    kicker: "Виды абстракций",
    title: "Четыре способа «свернуть» объект",
    html: `<div class="mini-grid">
      <div class="card"><h3>Сущности</h3><p>Полезная модель предметной области: Студент, Преподаватель, Аудитория.</p></div>
      <div class="card"><h3>Поведения</h3><p>Обобщённое множество операций: менеджер соединения с БД.</p></div>
      <div class="card"><h3>Виртуальная машина</h3><p>Группа операций, которыми пользуется более высокий уровень управления.</p></div>
      <div class="card"><h3>Произвольная</h3><p>Набор операций, которые друг с другом ничем не связаны — обычно плохой знак.</p></div>
    </div>`
  },
  {
    id: "s17-car",
    section: "abstraction",
    lecture: 17,
    kicker: "Одна сущность — разные модели",
    title: "Грузоперевозки и гонки смотрят на машину по-разному",
    html: cols(
      `<div class="card"><h3>Логистика</h3><p>Важна грузоподъёмность. Разгон — второстепенно.</p></div>
       <div class="card" style="margin-top:12px"><h3>Гонки</h3><p>Обязательно описать набор скорости. Грузоподъёмность почти не нужна.</p></div>`,
      `<div class="card"><h3>Спортсмен vs учёный</h3><p>Спортсмену обязательны вес, рост, реакция, достижения. Учёному — квалификация, степень, публикации. Те же «человек», разные поля.</p></div>`
    )
  },
  {
    id: "s17-degree",
    section: "abstraction",
    lecture: 17,
    kicker: "Степень",
    title: "Выбрать уровень, потом объекты и связи",
    html: `${bullets([
      "Слишком высоко — только приблизительное описание, поведение не смоделировать.",
      "Слишком низко — модель перегружена и непригодна.",
      "Дальше: описать информационный процесс, выделить участников, установить связи."
    ])}
    ${callout("ok", "Методика из лекции", "Опишите процесс словами и разберите фразы. Существительные — кандидаты в классы и поля. Глаголы — методы.")}`
  },
  {
    id: "s17-sentences",
    section: "abstraction",
    lecture: 17,
    kicker: "Разбор фраз",
    title: "«Завод выпускает автомобили» — уже два объекта",
    html: cols(
      `${bullets([
        "<b>Завод</b>: производственно-технические характеристики — поля; выпуск — методы.",
        "<b>Преподаватель читает курс</b>: ФИО, стаж, степень, пособия — поля. Лекция, консультация, зачёт — методы.",
        "<b>Учебный курс</b>: название, программа, часы. Действие почти одно — отдавать свои поля. Значит, нужны методы доступа."
      ])}`,
      `${callout("idea", "Правило большого пальца", "Понадобилось сформулировать понятие — кандидат в класс. Существительные вокруг него — поля, глаголы — методы.")}`
    )
  },
  {
    id: "s18-protected",
    section: "syntax",
    lecture: 18,
    kicker: "Спецификаторы",
    title: "public всем, private никому чужому, protected — детям",
    html: cols(
      kvTable(
        ["Модификатор", "Кто видит"],
        [
          ["public — открытый", "Все"],
          ["private — закрытый", "Только члены того же класса. Наследник напрямую не достучится"],
          ["protected — защищённый", "Класс и его наследники"]
        ]
      ),
      `${callout("warn", "Ловушка", "private-член в подклассе <b>есть</b>, но закрыт. Это не «пропал», это «не трогай руками».")}`
    )
  },
  {
    id: "lab-access",
    section: "syntax",
    lecture: 18,
    kicker: "Когда protected",
    title: "Кликнув по ячейке, услышите цену решения",
    widget: "accessGrid",
    html: `<div data-widget="accessGrid">
      <div class="access-grid">
        <div></div><div>Сам класс</div><div>Наследник</div><div>Чужой код</div>
        <div>public</div>
        <div class="yes" data-cell data-explain="public удобен для интерфейса: play(), getInfo(), saveDocument().">да</div>
        <div class="yes" data-cell data-explain="Наследник видит public, как и все.">да</div>
        <div class="yes" data-cell data-explain="Слишком широкий public на полях ломает инкапсуляцию.">да</div>
        <div>protected</div>
        <div class="yes" data-cell data-explain="Родитель видит свои protected-члены.">да</div>
        <div class="yes" data-cell data-explain="Наследник видит. Но если вы измените тип поля, чинить придётся и все подклассы.">да</div>
        <div class="no" data-cell data-explain="Чужой код (другая иерархия) не должен опираться на protected.">нет*</div>
        <div>private</div>
        <div class="yes" data-cell data-explain="Лучшая инкапсуляция: родитель изолирован от капризов детей.">да</div>
        <div class="no" data-cell data-explain="Детям нужны геттеры/сеттеры или protected-интерфейс. Это лишняя работа, если иерархия маленькая и только ваша.">нет</div>
        <div class="no" data-cell data-explain="И правильно: внешний код ходит только через публичные методы.">нет</div>
      </div>
      <p class="tiny" style="margin:8px 0">*в Java protected ещё и виден в пакете. Для лекции важнее правило: дети — да, произвольный клиент — нет.</p>
      <div class="console">Protected полезен, когда наследуете свои же классы и детей мало: правки разнесёте сами. Иначе лучше private + аккуратный интерфейс.</div>
    </div>`
  },
  {
    id: "s19-this",
    section: "syntax",
    lecture: 19,
    kicker: "this",
    title: "this — ссылка на текущий экземпляр",
    html: cols(
      `${bullets([
        "Через this обращаются к полям и методам объекта.",
        "Через <code>this(...)</code> вызывают другой конструктор того же класса.",
        "Нужен, когда параметр называется так же, как поле: <code>this.name = name</code>."
      ])}`,
      `${callout("note", "Три конструктора — один смысл", "В лекции Person() и Person(name) не копируют присваивания, а делегируют в Person(name, age). Меньше повторов, меньше багов.")}`
    )
  },
  {
    id: "s19-code",
    section: "syntax",
    lecture: 19,
    kicker: "Java",
    title: "Конструкторы Person зовут друг друга",
    html: cols(
      codeBlock(`class Person {
    String name;
    int age;

    Person() {
        this("Undefined", 18);
    }
    Person(String name) {
        this(name, 18);
    }
    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    void displayInfo() {
        System.out.printf("Name: %s \\tAge: %d\\n", name, age);
    }
}`),
      `<div class="card"><h3>Что напечатает main</h3>
        <p><code>new Person()</code> → Name: Undefined, Age: 18<br>
        <code>new Person("Tom")</code> → Tom, 18<br>
        <code>new Person("Sam", 25)</code> → Sam, 25</p>
      </div>`
    )
  },
  {
    id: "lab-this",
    section: "syntax",
    kicker: "Лаборатория",
    title: "Проследите, куда указывает this",
    widget: "thisDemo",
    html: `<div class="lab" data-widget="thisDemo">
      <div class="lab-row">
        <button class="lab-btn" data-undef>new Person()</button>
        <button class="lab-btn" data-tom>new Person("Tom")</button>
        <button class="lab-btn" data-sam>new Person("Sam", 25)</button>
      </div>
      <div class="cols">
        <div class="stack">
          <div class="stack-item" data-ctor="full">Person(String, int) — присваивает поля через this</div>
          <div class="stack-item" data-ctor="name">Person(String) — this(name, 18)</div>
          <div class="stack-item" data-ctor="empty">Person() — this("Undefined", 18)</div>
        </div>
        <div class="console">Нажмите конструктор — увидите цепочку делегирования.</div>
      </div>
    </div>`
  },
  {
    id: "s20-motivation",
    section: "why-inherit",
    lecture: 20,
    kicker: "Мотивация",
    title: "Объекты не одиночки. Студент — тоже человек",
    html: cols(
      `${bullets([
        "Раньше классы жили по одному: Car, Student, Book.",
        "Мир устроен иначе: объекты связаны тысячами нитей.",
        "Грузовик — транспорт. Квадрат — прямоугольник.",
        "Главный инструмент этих связей — <b>наследование</b>. Это сдвиг в проектировании, не «ещё одна фича»."
      ])}`,
      `${callout("warn", "История про сотрудников", "Сначала пишут Manager с name и salary. Потом Developer — те же поля. Потом Designer, Accountant… Копипаста растёт.")}`
    )
  },
  {
    id: "s20-dry",
    section: "why-inherit",
    lecture: 20,
    kicker: "Проблема",
    title: "Три причины, почему дублировать поля — ад",
    html: `<div class="mini-grid">
      <div class="card"><h3>DRY</h3><p>Один и тот же код геттеров для name и salary пишется снова. Скучно и неэффективно.</p></div>
      <div class="card"><h3>Баги</h3><p>Починили расчёт зарплаты у Manager, забыли Developer. Система врёт.</p></div>
      <div class="card"><h3>Масштаб</h3><p>Новое поле id: 10 классов — 10 правок, 100 классов — 100. Неприемлемо.</p></div>
      <div class="card"><h3>Код из лекции</h3>${codeBlock(`class Manager {
    String name;
    String department;
    double salary;
}
class Developer {
    String name; // совпадение
    String programmingLanguage;
    double salary;
}`)}</div>
    </div>`
  },
  {
    id: "s21-copy",
    section: "why-inherit",
    lecture: 21,
    kicker: "Антипаттерн",
    title: "«Просто скопирую класс» — тупик",
    html: bullets([
      "<b>Скомпилированные библиотеки.</b> Идеальный класс в .jar / .dll. Исходника нет — копировать нечего.",
      "<b>Юридический кошмар.</b> Шесть строк чужого кода без лицензии — суд на миллионы, потом суд на вас.",
      "<b>Вечное отставание.</b> Автор закрыл уязвимость. Ваша копия навсегда с дырой.",
      "Нужен способ <b>использовать</b> код, а не копировать его."
    ])
  },
  {
    id: "s22-isa",
    section: "why-inherit",
    lecture: 22,
    kicker: "is-a",
    title: "Manager является Employee. Мыслите отношением, не копипастой",
    html: cols(
      `${codeBlock(`class Employee {
    String name;
    double salary;
}
class Manager extends Employee {
    String department;
}`, "Java")}
       ${codeBlock(`class Manager : public Employee {
public:
    string department;
};`, "C++")}`,
      `${callout("ok", "Ключевая мысль лекции", "Вынесли общее в базовый класс. Конкретные классы — особые разновидности. Они наследуют поля и методы, дописывая только своё.")}`
    )
  },
  {
    id: "s23-wins",
    section: "why-inherit",
    lecture: 23,
    kicker: "Что это даёт",
    title: "Четыре победы наследования",
    html: `<div class="mini-grid">
      <div class="card"><h3>Повторное использование</h3><p>Код Employee доступен в Manager и Developer. Мы его не копировали — унаследовали.</p></div>
      <div class="card"><h3>Нет дублирования</h3><p>name и salary объявлены ровно один раз.</p></div>
      <div class="card"><h3>Поддержка</h3><p>Поле id добавляем в Employee — и оно появляется у всех наследников.</p></div>
      <div class="card"><h3>Чистая архитектура</h3><p>Код отражает предметную область: отношение «является».</p></div>
    </div>`
  },
  {
    id: "s24-pegasus",
    section: "why-inherit",
    lecture: 24,
    kicker: "Метафора",
    title: "Проще взять лошадь и приколдовать крылья",
    html: cols(
      `<div class="photo-frame"><img class="photo" src="./diagrams/pegasus-equation.png" alt="Лошадь плюс крылья равно пегас" /></div>`,
      `<div>
        <div class="photo-frame" style="height:220px"><img class="photo" src="./diagrams/pegasus-nested.png" alt="Пегас содержит лошадь и добавляет крыло" /></div>
        ${callout("idea", "Смысл картинки", "Пегасов с нуля колдовать трудно. Наследуем лошадь, добавляем крылья. Повторное использование — одно из важнейших преимуществ ООП.")}
      </div>`
    )
  },
  {
    id: "s25-two-ways",
    section: "why-inherit",
    lecture: 25,
    kicker: "Два пути",
    title: "Не обязательно писать класс с чистого листа",
    html: `<div class="compare">
      <div class="card">
        <h3>Композиция</h3>
        <p>Объекты готовых классов создают <b>внутри</b> нового. Пользуемся функциональностью, не становясь «разновидностью».</p>
        <p class="tiny" style="margin-top:8px">has-a: у документа есть файловый менеджер.</p>
      </div>
      <div class="card">
        <h3>Наследование</h3>
        <p>Новый класс — специализация существующего. Добавляем код, <b>не меняя</b> исходный класс.</p>
        <p class="tiny" style="margin-top:8px">is-a: грузовик является транспортным средством.</p>
      </div>
    </div>`
  },
  {
    id: "s26-file",
    section: "why-inherit",
    lecture: 26,
    kicker: "Композиция",
    title: "Document не «является» FileManager — он им пользуется",
    html: cols(
      codeBlock(`class FileManager {
    public void saveToFile(String text, String path) {
        // тело метода
    }
}`),
      codeBlock(`class Document {
    private FileManager manager;
    private StringBuilder contents;
    private String path;

    public Document(FileManager manager, String path) {
        this.manager = manager;
        this.contents = new StringBuilder();
        this.path = path;
    }
    public void saveDocument() {
        manager.saveToFile(contents.toString(), path);
    }
}`)
    ),
    notes: "Слайды 26–27 лекции: ссылка на чужой объект внутри, делегирование saveToFile."
  },
  {
    id: "s28-terms",
    section: "how-inherit",
    lecture: 28,
    kicker: "Термины",
    title: "Наследование — отношение «повторяет структуру и поведение»",
    html: cols(
      `${bullets([
        "Новый класс создают на основе существующих.",
        "Члены родителя с оговорками по доступу входят в ребёнка.",
        "Можно добавлять новые члены.",
        "Тип отношений — <b>«является»</b>."
      ])}
      <p class="tiny">Родитель = базовый = суперкласс. Дочерний = производный = подкласс.</p>`,
      `<div class="photo-frame"><img class="photo" src="./diagrams/fruit-tree.png" alt="Яблоко и банан являются фруктом" /></div>`
    )
  },
  {
    id: "s29-shape-tree",
    section: "how-inherit",
    lecture: 29,
    kicker: "Много уровней",
    title: "Класс может быть и ребёнком, и родителем сразу",
    html: cols(
      `<div class="photo-frame"><img class="photo" src="./diagrams/shape-tree.png" alt="Иерархия фигур" /></div>`,
      `${bullets([
        "Треугольник — ребёнок Фигуры и родитель Правильного треугольника.",
        "Наследуются и методы, и поля (с ограничениями доступа).",
        "Подклассы — полноценные классы, у них могут быть свои члены."
      ])}`
    )
  },
  {
    id: "s30-extends",
    section: "how-inherit",
    lecture: 30,
    kicker: "Синтаксис Java",
    title: "Подкласс почти как обычный класс, плюс extends",
    html: cols(
      codeBlock(`class Person {
    String firstName;
    String lastName;
}
class Student extends Person {
    String group;
    long id;
}
Student student = new Student();
student.firstName = "Иван";
student.lastName = "Иванов";
student.id = 10000L;`),
      `${callout("warn", "Не как в C++", "В Java нет множественного наследования классов: только один суперкласс. Зато есть многоуровневое: цепочки.")}`
    )
  },
  {
    id: "s31-chain",
    section: "how-inherit",
    lecture: 31,
    kicker: "Цепочка",
    title: "Vehicle → Truck → DumpTruck",
    html: cols(
      codeBlock(`class Vehicle {
    public void moveTo(Point destination) { }
}
class Truck extends Vehicle {
    public void carryWeight(double weight) { }
}
class DumpTruck extends Truck {
    public void dumpWeight() { }
}`),
      `<div class="tree">
        <div class="node">Vehicle<small>moveTo</small></div>
        <div class="arrow">↓</div>
        <div class="node">Truck<small>+ carryWeight</small></div>
        <div class="arrow">↓</div>
        <div class="node">DumpTruck<small>+ dumpWeight</small></div>
      </div>`
    )
  },
  {
    id: "s32-private",
    section: "how-inherit",
    lecture: 32,
    kicker: "Доступ у наследника",
    title: "private в родителе есть, но закрыт. Два легальных пути",
    html: cols(
      `<h3 style="margin-bottom:8px">1. protected-поля</h3>
       ${codeBlock(`class Shape2D {
    protected double width;
    protected double height;
}
class Rectangle extends Shape2D {
    public double getArea() {
        return width * height; // ок
    }
}`)}`,
      `<h3 style="margin-bottom:8px">2. private + геттеры</h3>
       ${codeBlock(`class Shape2D {
    private double width;
    public double getWidth() { return width; }
}
class Rectangle extends Shape2D {
    public double getArea() {
        return getWidth() * getHeight();
    }
}`)}`
    )
  },
  {
    id: "s33-why",
    section: "how-inherit",
    lecture: 33,
    kicker: "Зачем это в коде",
    title: "Не переопределяем информацию родителя — дописываем своё",
    html: `${bullets([
      "Экономия времени: методы и поля суперкласса приходят сами.",
      "Эффективность сопровождения: починили базовый класс — все производные получили исправление.",
      "Новые функции в родителе автоматически доступны детям."
    ])}
    ${callout("ok", "Это та же мысль, что про Employee", "Одно место правды. Иерархия — способ сказать это языку, а не комментарию в вики.")}`
  }
];
