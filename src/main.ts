import "./styles.css";
import { Deck } from "./engine/deck";
import { slides } from "./content";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Нет #app");
new Deck(app, slides).start();
