const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

class Container {
  constructor(nameArchive) {
    this.nameArchive = nameArchive;
  }

  async #getReadArchive() {
    try {
      const container = await fs.promises.readFile(this.nameArchive, "utf-8");
      const parseInfo = JSON.parse(container);
      return parseInfo;
    } catch (error) {
      console.log("error getReadArchive", error);
    }
  }

  async save(content) {
    const contentArchive = await this.#getReadArchive();
    if (contentArchive.length !== 0) {
      await fs.promises.writeFile(
        this.nameArchive,
        JSON.stringify(
          [...contentArchive, { id: uuidv4(), ...content }],
          "utf-8"
        )
      );
    } else {
      await fs.promises.writeFile(
        this.nameArchive,
        JSON.stringify([{ id: uuidv4(), ...content }], "utf-8")
      );
    }
  }
  async getById(id) {
    const contentArchive = await this.#getReadArchive();
    const result = contentArchive.filter((item) => item.id === id);
    if (result.length !== 0) {
      return console.log(result);
    }

    console.log(`No hay información con el id: ${id} `);
  }
  async getAll() {
    const contentArchive = await this.#getReadArchive();
    if (contentArchive.length !== 0) {
      return console.log(contentArchive);
    }

    console.log("No hay archivos por leer");
  }
  async deteleById(id) {
    const newArray = [];
    const contentArchive = await this.#getReadArchive();
    const result = contentArchive.filter((item) => item.id !== id);

    if (result.length >= 0) {
      newArray.push(result);
      await fs.promises.writeFile(
        this.nameArchive,
        JSON.stringify(...newArray, "utf-8"),
        "utf-8"
      );
      return;
    }
  }
  async deteleAll() {
    const contentArchive = await this.#getReadArchive();

    if (contentArchive.length === 0) {
      return console.log("No hay archivos para eliminar");
    }
    await fs.promises.writeFile(this.nameArchive, JSON.stringify([]), "utf-8");
  }
}

const nameArchive = new Container("./prueba.txt");

nameArchive.save({ name: "samy", price: 1000 });
nameArchive.getById("5");
nameArchive.getAll();
nameArchive.deteleById("5d9a2710-6edc-4fab-9157-92e146f8f341");
nameArchive.deteleAll();
