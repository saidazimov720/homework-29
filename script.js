document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productList = document.getElementById('productList');
    const productNameInput = document.getElementById('productName');
    const productPriceInput = document.getElementById('productPrice');
    const productImageInput = document.getElementById('productImage');
    const productQuantityInput = document.getElementById('productQuantity');
    const submitButton = document.getElementById('submitButton');
    
    let products = [];
    let editIndex = -1;

    function loadProducts() {
        const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
        products = storedProducts;
        renderProducts();
    }

    function saveProducts() {
        try {
            localStorage.setItem('products', JSON.stringify(products));
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                alert("Memory is Full");
            }
        }
    }

    window.renderProducts = function renderProducts() {
        productList.innerHTML = '';
        products.forEach((product, index) => {
            const li = document.createElement('li');
            li.classList.add('product-item');
            li.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-details">
                    <h3>${product.name}</h3>
                    <p>Price: $${product.price}</p>
                    <p>Quantity: ${product.quantity}</p>
                </div>
                <div class="product-actions">
                    <button class="edit-btn" onclick="editProduct(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteProduct(${index})">Delete</button>
                </div>
            `;
            productList.appendChild(li);
        });
    }

    function compressImage(imageFile, maxWidth, maxHeight, callback) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    if (width > height) {
                        height = Math.round(height * (maxWidth / width));
                        width = maxWidth;
                    } else {
                        width = Math.round(width * (maxHeight / height));
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                callback(compressedDataUrl);
            };
        };
        reader.readAsDataURL(imageFile);
    }

    productForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = productNameInput.value;
        const price = parseFloat(productPriceInput.value);
        const quantity = parseInt(productQuantityInput.value, 10);
        const imageFile = productImageInput.files[0];
        if (!imageFile) {
            alert('Please upload a product image.');
            return;
        }

        compressImage(imageFile, 200, 200, (compressedImage) => {
            for (let i = 0; i < quantity; i++) {
                const productData = {
                    name,
                    price,
                    image: compressedImage,
                    quantity: 1
                };

                if (editIndex === -1) {
                    products.push(productData);
                } else {
                    products[editIndex] = productData;
                    editIndex = -1;
                }
            }
            productNameInput.value = '';
            productPriceInput.value = '';
            productImageInput.value = '';
            productQuantityInput.value = '1';
            submitButton.textContent = 'Add Product';

            saveProducts();
            renderProducts();
        });
    });

    window.editProduct = function (index) {
        const product = products[index];
        productNameInput.value = product.name;
        productPriceInput.value = product.price;
        productQuantityInput.value = product.quantity;
        editIndex = index;
        submitButton.textContent = 'Update Product';
    }

    window.deleteProduct = function (index) {
        products.splice(index, 1);
        saveProducts();  
        renderProducts();  
    }

    loadProducts();
});
