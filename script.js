document.addEventListener('DOMContentLoaded', function () {
  // Initialize Offers Slider
  const offersSlider = new Swiper('.offers-slider', {
    loop: true,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    speed: 800,
    slidesPerView: 1,
    spaceBetween: 30
  });

  // Initialize Map
  const map = L.map('map').setView([30.0444, 31.2357], 13); 
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  L.marker([30.0444, 31.2357]).addTo(map)
    .bindPopup('مطعم حجوجة')
    .openPopup();

  const menuContainer = document.querySelector('.menu-items');
  fetch('menu.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('فشل تحميل بيانات المنيو');
      }
      return response.json();
    })
    .then(data => {
      data.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.classList.add('col-lg-4', 'col-md-6', 'menu-item');
        menuItem.setAttribute('data-category', item.category);
        menuItem.innerHTML = `
          <div class="menu-card">
            <img src="${item.image}" alt="${item.title}" class="menu-image">
            <div class="menu-content">
              <h3 class="menu-title">${item.title}</h3>
              <p class="menu-description">${item.description}</p>
              <p class="menu-price">${item.price}</p>
            </div>
          </div>
        `;
        menuContainer.appendChild(menuItem);
      });

      const filterButtons = document.querySelectorAll('.filter-btn');
      const menuItems = document.querySelectorAll('.menu-item');

      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');

          const filter = button.getAttribute('data-filter');

          menuItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
              item.classList.remove('hidden');
            } else {
              item.classList.add('hidden');
            }
          });
        });
      });
    })
    .catch(error => {
      console.error('Error loading menu:', error);
      menuContainer.innerHTML = '<p class="text-center">حدث خطأ أثناء تحميل المنيو، حاول مرة أخرى لاحقًا.</p>';
    });
});