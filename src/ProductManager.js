// const fs = require("fs").promises;

import { promises as fs } from 'fs';

export default class ProductManager {
    constructor(path) {
        this.path = path;
    }

  

    async validate(product) {
        const productFields = Object.values(product);
        const checkFields = productFields.some((field) => field === undefined);

        if (checkFields) {
            throw new Error("ERROR: Todos los campos deben estar llenos");
        }
    }

    async pathExists() {
        try {
            await fs.access(this.path);
            return true;
        } catch (error) {
            return false;
        }
    }

    async readDB() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            // Si el archivo no existe o está vacío, devolvemos un array vacío
            return [];
        }
    }

    async createId() {
        try {
            const db = await this.readDB();
            const ids = db.map((p) => p.id);
            let id = 1;

            // Encuentra el primer ID disponible
            while (ids.includes(id)) {
                id++;
            }

            return id;
        } catch (error) {
            console.error("Id error: " + error.message);
            return;
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        const product = {
            id: await this.createId(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        try {
            await this.validate(product);

            const db = await this.readDB();
            const newDB = [...db, product];

            await fs.writeFile(this.path, JSON.stringify(newDB, null, '\t'));
            console.log("Producto agregado");
        } catch (error) {
            console.error("Error: " + error.message);
        }
    }

    async getProducts(limit) {
        try {
            await fs.access(this.path)
            const db = await fs.readFile(this.path, "utf-8")
            const products = JSON.parse(db)
    
            if (limit) {
                return products.slice(0, limit);
            } else {
                return products
            }
        } catch (error) {
            console.error("Error: " + error.message)
            return []
        }
    }
    

    async getProductsById(id) {
        try {
            const db = JSON.parse(await fs.readFile(this.path, "utf-8"));
            const productById = db.find((producto) => producto.id === id);

            if (productById) {
                return productById;
            } else {
                throw new Error("Product no encontrado")
            }
        } catch (error) {
            throw new Error("Error en el procesamiento: " + error.message)
        }
    }

    async deleteProduct(id) {
        try {
            const db = JSON.parse(await fs.readFile(this.path, "utf-8"))
            const productById = db.find((p) => p.id === id)

            if (productById) {
                const newProductsArray = db.filter((p) => p.id != id)
                await fs.writeFile(this.path, JSON.stringify(newProductsArray, null, '\t'));
                console.log("Productc " + id + " ha sido borrado")
            } else {
                console.error("Error en ID")
            }
        } catch (error) {
            console.error("Borrando error: " + error.message)
        }
    }

    async updateProduct(id, keyToUpdate, newValue) {
        try {
            const db = await this.readDB()
            const index = db.findIndex((p) => p.id === id)
    
            if (index !== -1) {
                if (keyToUpdate in db[index]) {
                    db[index][keyToUpdate] = newValue;
                    await fs.writeFile(this.path, JSON.stringify(db, null, '\t'))
                    console.log(JSON.parse(await fs.readFile(this.path, 'utf-8')))
                } else {
                    console.error('La clave es incorrecta')
                }
            } else {
                console.error('ID incorrecto')
            }
        } catch (error) {
            console.error('Error: ' + error.message)
        }
    }
    
}



