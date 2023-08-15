const socket = io();

const cart = document.getElementById("cart");

socket.emit("cartId", cart.innerHTML)

socket.on("cart", (data) => {
    let messages = "";

  data.products.forEach((product) => {


      messages += `${product.id}<br/>`;
  });
  cart.innerHTML = messages;
});
