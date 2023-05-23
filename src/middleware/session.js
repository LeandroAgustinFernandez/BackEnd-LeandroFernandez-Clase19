export function sessionExist(request, response, next) {
  if (request.session?.email) return response.redirect("/products");
  else next();
}

export function auth(request, response, next) {
  if (request.session?.email) next();
  else return response.redirect("/login");
}
