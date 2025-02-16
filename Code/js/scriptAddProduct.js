document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("product-form");
    const submitButton = document.getElementById("submit-button");
    const formTitle = document.getElementById("form-title");
    const successMessage = document.getElementById("success-message");
  
    let products = JSON.parse(localStorage.getItem("products")) || [];
    const params = new URLSearchParams(window.location.search);
    const editIndex = params.get("editIndex");
  
    if (editIndex !== null) {
      loadProductForEditing(editIndex);
    }
  
    function saveProducts() {
      localStorage.setItem("products", JSON.stringify(products));
    }
  
    function loadProductForEditing(index) {
      const product = products[index];
      if (product) {
        document.getElementById("product-index").value = index;
        document.getElementById("product-name").value = product.name;
        document.getElementById("product-name-arabic").value = product.name_arabic;
        document.getElementById("product-price").value = product.price;
        document.getElementById("product-description").value = product.description;
        document.getElementById("product-category").value = product.category;
        formTitle.textContent = "Edit Product";
        submitButton.textContent = "Update Product";
      }
    }
  
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const index = document.getElementById("product-index").value;
      const fileInput = document.getElementById("product-image");
      const reader = new FileReader();
  
      reader.onload = function (e) {
        const productData = {
          name: document.getElementById("product-name").value,
          name_arabic: document.getElementById("product-name-arabic").value,
          price: document.getElementById("product-price").value,
          description: document.getElementById("product-description").value,
          image: e.target.result || (products[index] ? products[index].image : ""),
          category: document.getElementById("product-category").value
        };
  
        if (index !== "") {
          // تعديل المنتج إذا كان هناك فهرس موجود
          products[index] = productData;
        } else {
          // إضافة منتج جديد
          products.push(productData);
        }
  
        saveProducts(); // حفظ البيانات في localStorage
  
        // عرض رسالة نجاح وعدم الانتقال لصفحة أخرى
        successMessage.textContent = "تم الاضافة بنجاح";
        successMessage.style.color = "green";
        
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
       
        setTimeout(() => {
          successMessage.textContent = "";
        }, 9000);
  
       
        form.reset();
      };
  
      if (fileInput.files[0]) {
        reader.readAsDataURL(fileInput.files[0]);
      } else {
        reader.onload(); 
      }
    });
  });
  