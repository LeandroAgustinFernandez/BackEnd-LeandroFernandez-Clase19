import { Router } from "express";
import ProductManager from "../dao/MongoDbManagers/ProductManager.js";
import CartManager from "../dao/MongoDbManagers/CartManager.js";
import UserManager from "../dao/MongoDbManagers/UserManager.js";
import { sessionExist, auth } from "../middleware/session.js";

const router = Router();
const productManager = new ProductManager("./products.json");
const cartManager = new CartManager("./products.json");
const userManager = new UserManager();

router.get("/", sessionExist, async (request, response) => {
  response.render("user/login", {
    title: "Login",
    style: "home",
    logued: false,
  });
});

router.get("/login", sessionExist, async (request, response) => {
  response.render("user/login", {
    title: "Login",
    style: "home",
    logued: false,
  });
});

router.get("/register", sessionExist, async (request, response) => {
  response.render("user/register", {
    title: "Registro",
    style: "home",
    logued: false,
  });
});

router.get("/perfil", auth, async (request, response) => {
  let userAdmin = {
    first_name: "Coder",
    last_name: "House",
    email: "adminCoder@coder.com",
    age: 30,
  };
  let user =
    request.session.email === "adminCoder@coder.com"
      ? userAdmin
      : await userManager.getUser(request.session.email);
  delete user.password;
  response.render("user/perfil", {
    title: "Registro",
    style: "home",
    user,
    logued: true,
  });
});

router.get("/products", auth, async (request, response) => {
  const { limit, sort, page, query } = request.query;
  const { docs, ...pag } = await productManager.getProducts(
    parseInt(limit),
    page,
    query,
    sort
  );
  let urlParams = `?`;
  if (query) urlParams += `query=${query}&`;
  if (limit) urlParams += `limit=${limit}&`;
  if (sort) urlParams += `sort=${sort}&`;
  pag.prevLink = pag.hasPrevPage ? `${urlParams}page=${pag.prevPage}` : null;
  pag.nextLink = pag.hasNextPage ? `${urlParams}page=${pag.nextPage}` : null;
  response.render("products", {
    error: docs === undefined,
    products: docs,
    pag,
    title: "Products",
    style: "home",
    sort,
    query,
    user: { email: request.session.email, rol: request.session.rol, name: request.session.name },
    logued: true,
  });
});

router.get("/product/:pid", auth, async (request, response) => {
  let { pid } = request.params;
  let product = await productManager.getProductById(pid);
  let error = product?.error ? true : false;
  response.render("productdetail", {
    error,
    product,
    title: `Product ${product.title}`,
    style: "home",
    logued: true,
  });
});

router.get("/newproduct", auth, async (request, response) => {
  response.render("newproduct", {
    title: "Products",
    style: "home",
    logued: true,
  });
});

router.get("/carts/:cid", auth, async (request, response) => {
  let { cid } = request.params;
  let { products, _id } = await cartManager.getCart(cid);
  response.render("carts", {
    title: "Products",
    style: "home",
    products,
    _id,
    logued: true,
  });
});

router.get("/logout", async (request, response) => {
  request.session.destroy((err) => {
    if (!err) response.redirect("/login");
    else
      response.render("user/perfil", {
        title: "Registro",
        style: "home",
        user,
        logued: true,
        error: { message: err, status: true },
      });
  });
});

export default router;
