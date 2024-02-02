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
