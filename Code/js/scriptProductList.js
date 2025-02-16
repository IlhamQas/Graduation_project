document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    
    let products = JSON.parse(localStorage.getItem("products")) || [];

    function renderProducts() {
        productList.innerHTML = "";  // تنظيف القائمة قبل إعادة رسمها
        products.forEach((product, index) => {
            const div = document.createElement("div");
            div.classList.add("product-item");
            div.innerHTML = `
                <img src="${product.image}" alt="Product Image" style="width: 100px; height: 100px;">
                <div class="product-info">
                    <span class="product-name">${product.name} (₪${product.price})</span>
                    <span class="product-category">${product.category}</span>
                    <p class="product-description">${product.description}</p>
                </div>
                <button class="edit-button">✏ Edit</button>
                <button class="delete-button">🗑 Delete</button>
            `;

            // إضافة حدث الحذف
            div.querySelector(".delete-button").addEventListener("click", () => deleteProduct(index));

            // إضافة حدث التعديل
            div.querySelector(".edit-button").addEventListener("click", () => editProduct(index));

            productList.appendChild(div);
        });
    }

    function deleteProduct(index) {
        products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        renderProducts(); // تحديث القائمة بعد الحذف
    }

    function editProduct(index) {
        window.location.href = `addProduct.html?editIndex=${index}`;
    }

    renderProducts(); // عرض المنتجات عند تحميل الصفحة
});
