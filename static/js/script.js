const API_URL = 'http://127.0.0.1:5000';

// Загрузить все картинки
async function loadImages() {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';

    try {
        const response = await fetch(`${API_URL}/api/images`);
        const images = await response.json();

        if (images.length === 0) {
            gallery.innerHTML = '<p style="color: #8a8a8a;">Картинок пока нет</p>';
            return;
        }

        images.forEach(img => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${API_URL}${img.file_path}" alt="${img.title}">
                <div class="card-body">
                    <div class="card-title">${img.title}</div>
                    <div class="card-user">${img.username}</div>
                </div>
            `;
            gallery.appendChild(card);
        });
    } catch (error) {
        gallery.innerHTML = '<p style="color: #ff6b6b;">Ошибка загрузки</p>';
        console.error(error);
    }
}

// Поиск картинок
async function searchImages() {
    const input = document.querySelector('.search input');
    const query = input.value.trim();
    const gallery = document.querySelector('.gallery');

    if (!query) {
        loadImages();
        return;
    }

    gallery.innerHTML = '';

    try {
        const response = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}`);
        const images = await response.json();

        if (images.length === 0) {
            gallery.innerHTML = '<p style="color: #8a8a8a;">Ничего не найдено</p>';
            return;
        }

        images.forEach(img => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${API_URL}${img.file_path}" alt="${img.title}">
                <div class="card-body">
                    <div class="card-title">${img.title}</div>
                    <div class="card-user">${img.username}</div>
                </div>
            `;
            gallery.appendChild(card);
        });
    } catch (error) {
        gallery.innerHTML = '<p style="color: #ff6b6b;">Ошибка поиска</p>';
        console.error(error);
    }
}

// Регистрация
async function registerUser(event) {
    event.preventDefault();

    const username = document.querySelector('#reg-username').value;
    const password = document.querySelector('#reg-password').value;

    try {
        const response = await fetch(`${API_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role: 'user' })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Регистрация успешна! Теперь войдите.');
            window.location.href = 'login.html';
        } else {
            alert(data.error || 'Ошибка регистрации');
        }
    } catch (error) {
        console.error(error);
        alert('Сервер недоступен');
    }
}

// Вход
async function loginUser(event) {
    event.preventDefault();

    const username = document.querySelector('#login-username').value;
    const password = document.querySelector('#login-password').value;

    try {
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('username', data.username);
            alert('Вход выполнен!');
            window.location.href = 'index.html';
        } else {
            alert(data.error || 'Неверный логин или пароль');
        }
    } catch (error) {
        console.error(error);
        alert('Сервер недоступен');
    }
}

// Загрузка картинки
async function uploadImage(event) {
    event.preventDefault();

    const title = document.querySelector('#upload-title').value;
    const fileInput = document.querySelector('#upload-file');
    const file = fileInput.files[0];
    const user_id = localStorage.getItem('user_id') || 1;

    if (!file) {
        alert('Выберите файл');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('user_id', user_id);
    formData.append('image', file);

    try {
        const response = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert('Картинка загружена!');
            window.location.href = 'index.html';
        } else {
            alert(data.error || 'Ошибка загрузки');
        }
    } catch (error) {
        console.error(error);
        alert('Сервер недоступен');
    }
}

// Запуск
if (document.querySelector('.gallery')) {
    loadImages();
}

if (document.querySelector('.search button')) {
    document.querySelector('.search button').addEventListener('click', searchImages);
}

if (document.getElementById('reg-username')) {
    document.getElementById('reg-form').addEventListener('submit', registerUser);
}

if (document.getElementById('login-username')) {
    document.getElementById('login-form').addEventListener('submit', loginUser);
}

if (document.getElementById('upload-file')) {
    document.getElementById('upload-form').addEventListener('submit', uploadImage);
}