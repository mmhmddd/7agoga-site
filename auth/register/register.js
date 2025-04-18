document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registerForm');
  const formMessage = document.getElementById('formMessage');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!name || !email || !password || !confirmPassword) {
      showMessage('جميع الحقول مطلوبة', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showMessage('الإيميل غير صالح', 'error');
      return;
    }

    if (password.length < 6) {
      showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showMessage('كلمة المرور وتأكيدها غير متطابقين', 'error');
      return;
    }

    const user = {
      id: Date.now(),
      name,
      email,
      password
    };

    saveUser(user);
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
    console.log('Attempting to show toast:', message);
    try {
      if (typeof Toastify !== 'undefined') {
        console.log('Toastify is loaded, showing toast');
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
              console.log('Toast clicked, redirecting to index.html');
              window.location.href = '../../../index.html';
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
        window.location.href = '../../../index.html';
      }, 1500);
    }
  }

  function saveUser(user) {
    console.log('Saving user to localStorage:', user);
    try {
      let users = JSON.parse(localStorage.getItem('users')) || [];

      if (users.some(u => u.email === user.email)) {
        showToast('الإيميل مستخدم بالفعل', true);
        return;
      }

      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));

      console.log('localStorage users after adding:', JSON.stringify(users, null, 2));

      showToast('تم إنشاء الحساب بنجاح!');
      form.reset();
    } catch (error) {
      console.error('Error saving user:', error);
      showToast('حدث خطأ أثناء حفظ البيانات', true);
    }
  }
})