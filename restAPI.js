// EJERCICIO DESAFIO CLASE 8

const fs = require("fs");
const express = require("express");
const app = express();
const { Router } = express;
const router = Router();
const multer = require("multer");
const storage = multer({ destinantion: "/upload" });
const PORT = 8081;

// Check if the file exists
let fileExists = fs.existsSync("productos.txt");
console.log("productos.txt exists:", fileExists);

// If the file does not exist
// create it
if (!fileExists) {
  console.log("Creating the file");
  fs.writeFileSync("productos.txt", "[]");
  console.log("Archivo productos.txt Creado!");
}

class Contenedor {
  constructor(nombreArchivo) {
    this.nombreArchivo = nombreArchivo;
  }

  /**
   * @param {json} producto
   * Metodo para guardar un producto. Al terminar de grabar, muestra por pantalla el ID del producto agregado.
   */
  async metodoSave(producto) {
    try {
      const contenido = JSON.parse(
        await fs.promises.readFile(this.nombreArchivo)
      );
      producto.id = contenido.length + 1;
      contenido.push(producto);
      await fs.promises.writeFile(
        this.nombreArchivo,
        JSON.stringify(contenido)
      );
      console.log("El Id del Producto es " + producto.id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Metodo para obtener todos los productos
   */
  async getAll() {
    try {
      const contenido = JSON.parse(
        await fs.promises.readFile(this.nombreArchivo)
      );
      console.log(contenido);
      return contenido;
    } catch (error) {
      console.log("Error en getAll", error);
      return [];
    }
  }
  /**
   * Metodo para obtener un producto con su ID
   * @param {int} id el id del producto
   * @returns
   */
  async getById(id) {
    try {
      const contenidoCrudo = JSON.parse(
        await fs.promises.readFile(this.nombreArchivo)
      );
      const contenido = contenidoCrudo.find((p) => p.id === id);
      return contenido;
    } catch (error) {
      console.log(error);
    }
  }
}

const ejecutarProductos = async () => {
  const productos = new Contenedor("productos.txt");
};

ejecutarProductos();

// -------------------------------------------------------------------------------------------------------
// Codigo del server

// Middleware para parsear el Body. Sin esto no obtenemos el Body. SIEMPRE QUE USAMOS POST HAY QUE USARLO.
// El body llega como strings. Lo que hace el middleware es transformarlo en JSON y mandarlo a la funcion que debe controlarlo.
app.use(express.json());
// Hace lo mismo pero con dato de formularios. Un form en HTML viene en forma de URL encoded y esto lo trasnforma en formulario.
app.use(express.urlencoded({ extended: true }));

// Va a buscar en la carpeta PUBLIC si existe el archivo buscado.
app.use(express.static("public"));

app.use("/api", router);

router.get("/productos", (req, res, next) => {
  const mostrarProductos = async () => {
    const productos = new Contenedor("productos.txt");
    const showProductos = await productos.getAll();
    res.send(showProductos);
  };
  mostrarProductos();
});

router.get("/productos/:id", (req, res, next) => {
  let id = parseInt(req.params.id);
  const mostrarProdID = async () => {
    const productos = new Contenedor("productos.txt");
    const mostrarID = await productos.getById(id);
    res.send(mostrarID);
  };
  mostrarProdID();
});

const productoSubido = storage.fields([
  { title: "title", price: "price", thumbnail: "thumbnail" },
]);

router.post("/productos", productoSubido, async (req, res, next) => {
  const subirProduct = async () => {
    let produc = new Contenedor("productos.txt");
    if (
      req.body.title === "" ||
      req.body.price === "" ||
      req.body.thumbnail === ""
    ) {
      res.status(400).send({
        error: "No se pudo cargar el producto. Complete los campos vacios.",
      });
    } else {
      await produc.metodoSave(req.body);
      res.send(req.body);
    }
    next();
  };
  subirProduct();
});

app.listen(PORT, () => {
  console.log(`Servidor Corriendo en el puerto ${PORT}`);
});
