document.addEventListener('DOMContentLoaded', () =>{
    const productForm = document.getElementById('prductForm');
    const productList = document.getElementById('productList');
    const productNameInput = document.getElementById('productName');
    const productPriceInput = document.getElementById('productPrice');
    const productImageInput = document.getElementById('productImage');
    const submitButton = document.getElementById('submitButton');
    const productIdInput = document.getElementById('productId');

    let products = [];
    let editIndex = -1;

    function loadProducts() {
        const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
        products = storedProducts;
        renderProducts();
    };

    function saveProducts() {
        localStorage.setItem('products', JSON.stringify(products));
    }
    function renderProducts() {
        productList.innerHTML = '';
        products.forEach((product, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
                <span>${product.name} - $${product.price}</span>
                <div>
                    <button class="edit-btn" onclick="editProduct(${index})">Edit</button>
                    <button onclick="deleteProduct(${index})">Delete</button>
                </div>`;
                productList.appendChild(li);
        });
    }
    
    });
