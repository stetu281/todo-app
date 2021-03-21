document.querySelector('.header__icon').addEventListener('click', (e) => {
    document.body.classList.toggle('light-mode');
    e.target.src = 'images/icon-moon.svg';
})