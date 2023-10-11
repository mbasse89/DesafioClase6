import express from 'express';
import ProductManager from './ProductManager.js';

const PORT = 8080;
const productManager = new ProductManager("./db.json");
const app = express();

app.get('/products', async (req, res) => {
    try {
        const limit = parseInt(req.query?.limit);
        let products;

        if (isNaN(limit)) {
            // Si el límite no es un número, obtén todos los productos
            products = await productManager.getProducts();
        } else {
            products = await productManager.getProducts(limit);
        }

        res.send(products);
    } catch (err) {
        res.status(500).send("Error al obtener los productos" + err);
    }
})

app.get('/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
         const producto = await productManager.getProductsById(id);
        res.send(producto);
    } catch (err) {
        res.status(500).send("Error al obtener el producto: " + err);
    }
});

app.listen(PORT, () => console.log("server corriendo en el puerto: " + PORT));



// productManager.getProducts().then(products => {
//     console.log(products)})
    // productManager.addProduct("Producto Prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
// productManager.getProducts();
productManager.getProductsById(1);
// productManager.getProductsById(1).then(products => {
//         console.log(products)})
// productManager.updateProduct(1, "price", "15933");
// productManager.getProducts();
    // productManager.addProduct("Producto Prueba", "Este es un producto prueba", 200, "Sin imagen", "123abc", 25);
// productManager.addProduct("Producto Prueba", "Este es un producto prueba", 200, "Sin imagen", "147asd", 25);


