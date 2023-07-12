const socket = io();

const products = document.getElementById('products')

socket.on('message', data => {
    let messages = '';
    data.forEach(product => {
        messages += `${product.title} <br/>`;
    });
    products.innerHTML = messages;
})

