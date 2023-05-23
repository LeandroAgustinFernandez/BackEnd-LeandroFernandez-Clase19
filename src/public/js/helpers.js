const addToCart = async (e) => {
  if (e.target.classList.contains("addtocart")) {
    let pid = e.target.dataset.id;
    let res = await fetch(
      `/api/carts/6461909ef9aaec0e50b82c2a/products/${pid}`,
      { method: "POST" }
    );
    let message = await res.json();
    if (message?.success) {
      Swal.fire({
        text: `${message.success}`,
        toast: true,
        position: "top-right",
      });
    } else {
      Swal.fire({
        text: `${message.error}`,
        toast: true,
        position: "top-right",
      });
    }
  }
};
