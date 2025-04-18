document.addEventListener('DOMContentLoaded', async function () {
    const form = document.getElementById('deliveryForm');
    const menuItemsContainer = document.getElementById('menuItems');
    const totalPriceElement = document.getElementById('totalPrice');
    const formMessage = document.getElementById('formMessage');
    let selectedItems = {};
  
    let menu = [];
    try {
      const response = await fetch('../menu.json');
      if (!response.ok) throw new Error('فشل تحميل المنيو');
      menu = await response.json();
    } catch (error) {
      console.error('Error loading menu:', error);
      showToast('حدث خطأ أثناء تحميل المنيو', true);
      return;
    }
  
    function loadMenu() {
      menuItemsContainer.innerHTML = '';
      menu.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `
          <img src="${item.image}" alt="${item.title}">
          <h3>${item.title}</h3>
          <p class="description">${item.description}</p>
          <p class="price">${item.price}</p>
          <div class="quantity-control" data-id="${item.id}">
            <button class="decrease">-</button>
            <span class="quantity">0</span>
            <button class="increase">+</button>
          </div>
        `;
        menuItemsContainer.appendChild(div);
      });
    }
  
    function calculateTotal() {
      let total = 0;
      for (const [id, quantity] of Object.entries(selectedItems)) {
        const item = menu.find(i => i.id === parseInt(id));
        const price = parseFloat(item.price.replace(' جنيه', ''));
        total += price * quantity;
      }
      totalPriceElement.textContent = `الإجمالي: ${total} جنيه`;
      return total;
    }
  
    function showMessage(message, type) {
      formMessage.textContent = message;
      formMessage.className = type;
      setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = '';
      }, 5000);
    }
  
    function showToast(message, isError = false) {
      console.log('Attempting to show toast:', message);
      try {
        if (typeof Toastify !== 'undefined') {
          console.log('Toastify is loaded, showing toast');
          Toastify({
            text: message,
            duration: isError ? 5000 : 3000,
            gravity: 'top',
            position: 'right',
            style: {
              background: isError ? '#dc3545' : '#d97706',
              color: '#1a1a1a',
              padding: '1.5rem',
              fontSize: '20px',
              minWidth: '300px',
              borderRadius: '8px',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
              lineHeight: '1.5'
            },
            stopOnFocus: true,
            onClick: () => {
              if (!isError) {
                console.log('Toast clicked, redirecting to index.html');
                window.location.href = '../index.html';
              }
            }
          }).showToast();
        } else {
          console.warn('Toastify not loaded, using alert');
          alert(message);
        }
      } catch (error) {
        console.error('Error in showToast:', error);
        alert(message);
      }
  
      if (!isError) {
        console.log('Scheduling redirect to index.html');
        setTimeout(() => {
          console.log('Executing redirect to index.html');
          window.location.href = '../index.html';
        }, 1500);
      }
    }
  
    function isValidPhone(phone) {
      const phoneRegex = /^01[0-2,5]\d{8}$/;
      return phoneRegex.test(phone);
    }
  
    menuItemsContainer.addEventListener('click', function (e) {
      if (e.target.classList.contains('increase') || e.target.classList.contains('decrease')) {
        const control = e.target.closest('.quantity-control');
        const itemId = control.dataset.id;
        const quantityElement = control.querySelector('.quantity');
        let quantity = parseInt(quantityElement.textContent);
  
        if (e.target.classList.contains('increase')) {
          quantity++;
        } else if (e.target.classList.contains('decrease') && quantity > 0) {
          quantity--;
        }
  
        quantityElement.textContent = quantity;
        selectedItems[itemId] = quantity;
        if (quantity === 0) delete selectedItems[itemId];
        calculateTotal();
      }
    });
  
    loadMenu();
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const items = Object.entries(selectedItems).map(([id, quantity]) => {
        const item = menu.find(i => i.id === parseInt(id));
        return {
          id: item.id,
          name: item.title,
          price: parseFloat(item.price.replace(' جنيه', '')),
          quantity
        };
      });
      const phone = document.getElementById('phone').value.trim();
      const address = document.getElementById('address').value.trim();
      const payment = document.querySelector('input[name="payment"]:checked').value;
      const total = calculateTotal();
  
      if (items.length === 0) {
        showMessage('يرجى اختيار صنف واحد على الأقل', 'error');
        return;
      }
  
      if (!isValidPhone(phone)) {
        showMessage('رقم الهاتف غير صالح (يجب أن يكون 11 رقمًا، يبدأ بـ 010/011/012/015)', 'error');
        return;
      }
  
      if (!address) {
        showMessage('يرجى إدخال العنوان', 'error');
        return;
      }
  
      const order = {
        id: Date.now(),
        items,
        phone,
        address,
        payment,
        total,
        date: new Date().toISOString()
      };
  
      try {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        console.log('Order saved to localStorage:', JSON.stringify(order, null, 2));
  
        showToast('تم إرسال الطلب بنجاح! 😊');
        form.reset();
        totalPriceElement.textContent = 'الإجمالي: 0 جنيه';
        selectedItems = {};
        menuItemsContainer.querySelectorAll('.quantity').forEach(el => (el.textContent = '0'));
      } catch (error) {
        console.error('Error saving order:', error);
        showToast('حدث خطأ أثناء حفظ الطلب', true);
      }
    });
  });