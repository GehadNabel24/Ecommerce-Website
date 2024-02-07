document.addEventListener('click', (event) => {
    const nav = document.getElementById('navbar');
    const bar = document.getElementById('bar');
    const close = document.querySelector('#navbar .fa-times');

    if (event.target === bar) {
        nav.setAttribute('class', 'active');
    } else if (event.target === close) {
        nav.removeAttribute('class');
    }
});

function updateCartCount() {
    var storedCount = localStorage.getItem('count');
    var cartCounts = document.getElementsByClassName("cartCount");
    for (var i = 0; i < cartCounts.length; i++) {
        cartCounts[i].innerHTML = storedCount;
    }
}

updateCartCount();

document.addEventListener('DOMContentLoaded', function() {
//    localStorage.setItem('count',0)
    var storedTableContent = localStorage.getItem('cartTableContent');
    if (storedTableContent) {
        var cartTableBody = document.getElementById('cartBody');
        cartTableBody.innerHTML = storedTableContent;
    }
    updateCartCount();
    
    // Display total price from local storage
    var totalPrice = parseFloat(localStorage.getItem('total')) || 0;
    document.querySelector('.cart-total-price').textContent = '$' + totalPrice.toFixed(2);
});

function showProductDetail(event) {
    event.preventDefault();
    var product = event.target.closest('.pro');
    var productName = product.querySelector('h5').innerText;
    var productImageSrc = product.querySelector('img').getAttribute('src');
    var productPrice = parseFloat(product.querySelector('h4').innerText.slice(1));

    var newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><button class="remove-button" onclick="removeCartItem(this)">Remove</button></td>
        <td><img src="${productImageSrc}" alt="Product Image" width="50"></td>
        <td>${productName}<br>Price: $${productPrice.toFixed(2)}</td>
        <td><input type="number" value="1" min="1" class="quantity-input"></td>
        <td class="subtotal">$${productPrice.toFixed(2)}</td>
    `;

    var cartTableBody = document.getElementById('cartBody');
    cartTableBody.appendChild(newRow);
    updateLocalStorage();
    updateCartTotal();

    var quantityInput = newRow.querySelector('.quantity-input');
    quantityInput.addEventListener('input', function() {
        var quantity = parseInt(this.value);
        var subtotalCell = newRow.querySelector('.subtotal');
        var subtotal = quantity * productPrice; // Calculate subtotal based on quantity
        subtotalCell.textContent = '$' + subtotal.toFixed(2);
        updateCartTotal(); // Update the total price when quantity changes

        // Update local storage for quantity and subtotal
        var productId = newRow.querySelector('img').getAttribute('src'); // Assuming each product has a unique image source
        localStorage.setItem(productId + '_quantity', quantity);
        localStorage.setItem(productId + '_subtotal', subtotal.toFixed(2));
        updateLocalStorage();
        updateCartTotal();
    });

    var countcart = parseInt(localStorage.getItem('count')) || 0;
    countcart++;
    localStorage.setItem('count', countcart);
    updateCartCount();

}

function removeCartItem(button) {
    var rowToRemove = button.closest('tr');
    rowToRemove.remove();
    var countcart = parseInt(localStorage.getItem('count')) || 0;
    countcart--;
    localStorage.setItem('count', countcart);
    updateCartCount();
    updateCartTotal();    
    updateLocalStorage();
}

function updateCartTotal() {
    var total = 0; // Reset total to calculate it again
    var cartRows = document.querySelectorAll('#cartBody tr');
    cartRows.forEach(function(row) {
        var price = parseFloat(row.querySelector('.subtotal').textContent.slice(1));
        total += price;
    });
    document.querySelector('.cart-total-price').textContent = '$' + total.toFixed(2);
    localStorage.setItem('total', total); // Store total price in local storage
}

function updateLocalStorage() {
    var cartTableBody = document.getElementById('cartBody');
    var tableContent = cartTableBody.innerHTML;
    var totalPrice = calculateTotalPrice(); // Calculate total price
    var countcart = parseInt(localStorage.getItem('count')) || 0; // Get counter from local storage
    var quantities = Array.from(document.querySelectorAll('.quantity-input')).map(input => parseInt(input.value)); // Get quantities from all quantity inputs
    
    // Store both total price, counter, and quantities in local storage
    localStorage.setItem('cartTableContent', tableContent);
    localStorage.setItem('total', totalPrice);
    localStorage.setItem('count', countcart);
    localStorage.setItem('quantities', JSON.stringify(quantities));
}

// Function to show custom alert
function showAlert(title, message, totalPrice) {
    var modal = document.getElementById("customAlert");
    var alertMessage = document.getElementById("alertMessage");
    var alertIcon = document.getElementById("alertIcon");
    var okButton = document.getElementById("okButton");
    var totalPriceElement = document.getElementById("totalPrice");
  
    alertMessage.innerHTML = message;
    alertIcon.innerHTML = "&#10003;"; // Check mark icon
    totalPriceElement.textContent = "Total Price: $" + totalPrice.toFixed(2);
    modal.style.display = "block";
  
    // Close the modal when the close button is clicked or OK button is clicked
    var closeBtn = document.getElementsByClassName("close")[0];
    closeBtn.onclick = function() {
      modal.style.display = "none";
    };
    okButton.onclick = function() {
      modal.style.display = "none";
      // Remove all items from the table
      var cartTableBody = document.getElementById('cartBody');
      cartTableBody.innerHTML = '';
  
      // Reset the counter to 0
      localStorage.setItem('count', 0);
      localStorage.setItem('total', 0);
      document.querySelector('.cart-total-price').textContent = '$' +0;
      updateLocalStorage();
      updateCartCount();
  
      // Reset the total price to 0
    };
  
    // Close the modal when clicking outside of it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  }
  
  // Purchase Clicked function
  function purchaseClicked() {
    var totalPrice = calculateTotalPrice();
    var purchaseAlert = {
      title: "Success",
      message: "Your purchase was successful!",
      totalPrice: totalPrice
    };
  
    // Show custom alert
    showAlert(purchaseAlert.title, purchaseAlert.message, purchaseAlert.totalPrice);
   
   


  }
  
  // Function to calculate total price
  function calculateTotalPrice() {
    var total = 0;
    var cartRows = document.querySelectorAll('#cartBody tr');
    cartRows.forEach(function(row) {
      var price = parseFloat(row.querySelector('.subtotal').textContent.slice(1));
      total += price;
    });
    localStorage.setItem('total', total);
    return total;
  }
/////////////////////////
  /////////////////////filter
    function filterProducts(category) {
        var products = document.querySelectorAll('.pro');
        products.forEach(function(product) {
            if (category === 'all') {
                product.style.display = 'block'; // Show all products
            } else if (category === 'woman') {
                if (product.classList.contains('womman')) {
                    product.style.display = 'block'; // Show woman products
                } else {
                    product.style.display = 'none'; // Hide non-woman products
                }
            } else if (category === 'dress') {
                if (product.classList.contains('Dress')) {
                    product.style.display = 'block'; // Show dress products
                } else {
                    product.style.display = 'none'; // Hide non-dress products
                }
            }
            else if (category === 'men') {
                if (product.classList.contains('men')) {
                    product.style.display = 'block'; // Show dress products
                } else {
                    product.style.display = 'none'; // Hide non-dress products
                }
            }
            else if (category === 'offer') {
                if (product.classList.contains('offer')) {
                    product.style.display = 'block'; // Show dress products
                } else {
                    product.style.display = 'none'; // Hide non-dress products
                }
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        var filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var category = this.getAttribute('data-category');
                filterProducts(category);
            });
        });
    });
    // filter button border
    document.addEventListener('DOMContentLoaded', function() {
        var filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(function(btn) {
                    btn.classList.remove('active-btn');
                });

                // Add active class to the clicked button
                this.classList.add('active-btn');

                var category = this.getAttribute('data-category');
                filterProducts(category);
            });
        });
    });
// add item in display page
function displayProductDetail(event) {
    // Prevent default behavior of the anchor tag or image click
    event.preventDefault();

    // Get the product container
    var product = event.target.closest('.pro');

    // Retrieve product details
    var productName = product.querySelector('h5').innerText;
    var productImageSrc = product.querySelector('img').getAttribute('src');
    var productPrice = parseFloat(product.querySelector('h4').innerText.slice(1));
    var productType = product.classList.contains('men') ? 'Men' : 'Women';

    // Encode product details for URL
    var encodedProductName = encodeURIComponent(productName);
    var encodedProductImageSrc = encodeURIComponent(productImageSrc);
    var encodedProductPrice = encodeURIComponent(productPrice);
    var encodedProductType = encodeURIComponent(productType);

    // Navigate to display.html with product details as query parameters
    window.location.href = `display.html?name=${encodedProductName}&image=${encodedProductImageSrc}&price=${encodedProductPrice}&type=${encodedProductType}`;
}
// 
