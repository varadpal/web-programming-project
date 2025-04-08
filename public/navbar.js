const menu = document.querySelector('.menu');
const navbar = document.querySelector('.navItems');
const menuToggle= document.querySelector('.toggle');

menuToggle.addEventListener('click', function() {
    menuToggle.classList.toggle('active');
    menu.classList.toggle('active');
    navbar.classList.toggle('active');
})