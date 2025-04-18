document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    const formMessage = document.getElementById('formMessage');
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
  
      if (!email || !password) {
        showMessage('جميع الحقول مطلوبة', 'error');
        return;
      }
  
      if (!isValidEmail(email)) {
        showMessage('الإيميل غير صالح', 'error');
        return;
      }
  
      authenticateUser(email, password);
    });
  
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
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
      try {
        if (typeof Toastify !== 'undefined') {
          Toastify({
            text: message,
            duration: isError ? 5000 : 3000,
            gravity: "top",
            position: "right",
            style: {
              background: isError ? "#dc3545" : "#d97706",
              color: "#1a1a1a",
              padding: "1.5rem",
              fontSize: "20px",
              minWidth: "300px",
              borderRadius: "8px",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
              lineHeight: "1.5"
            },
            className: "toastify-custom",
            stopOnFocus: true,
            onClick: () => {
              if (!isError) {
                window.location.href = '../../index.html';
            }
            }
          }).showToast();
        } else {
          alert(message);
        }
      } catch (error) {
        console.error('Error in showToast:', error);
        alert(message);
      }
  
      if (!isError) {
        setTimeout(() => {
          window.location.href = '../../index.html';
        }, 1500);
      }
    }
  
    function authenticateUser(email, password) {
      try {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
  
        if (!user) {
          showToast('الإيميل أو كلمة المرور غير صحيحة', true);
          return;
        }
  
        showToast('تم تسجيل الدخول بنجاح!');
        form.reset();
      } catch (error) {
        console.error('Error authenticating user:', error);
        showToast('حدث خطأ أثناء تسجيل الدخول', true);
      }
    }
  });