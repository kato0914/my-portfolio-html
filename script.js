// ハンバーガーメニューの動作
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.querySelector('.sp-menu');
    const navLinks = document.querySelectorAll('.sp-menu__link');
    const checkbox = document.getElementById('sp-menu__check');

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            // メニューの開閉処理
            checkbox.checked = !checkbox.checked;
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // メニューを閉じる
                checkbox.checked = true; // チェックを外す
            });
        });
    }
});

// スクロール時のヘッダー背景変更
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// コンタクトフォームの送信処理
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // デフォルトのフォーム送信を防ぐ

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // フォームデータをJSON形式に変換
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result);
        alert('お問合せが送信されました。');
    } catch (error) {
        console.error('Error:', error);
        alert('送信中にエラーが発生しました。');
    }
});

// その他の必要なJavaScript機能をここに追加