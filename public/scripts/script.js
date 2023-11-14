const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}


if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

const header = document.querySelector("header");
const body = document.querySelector("body")
const imgLogo = document.querySelector('#img-logo')
const imgMenu = document.querySelector('#img-menu')
let lastScroll = 0;
let menuActive = false;
window.addEventListener("scroll", function () {
    if (!menuActive) {
        const currentScroll = window.scrollY || document.documentElement.scrollTop;
        if (currentScroll > lastScroll) {
            header.style.transform = "translateY(-100%)";
            
        } else {
            header.style.transform = "translateY(0%)";
        }

        lastScroll = currentScroll;
    }
});

function activateMenu() {

    header.style.backgroundColor = 'var(--brand-green)'
    const menu = document.querySelector('.menu');
    const menuButton = document.querySelector('.menu-mobile')
    menu.style.display = 'flex';
    menuActive = true;
    imgLogo.setAttribute('src', '/images/CashFlow-Logo-White.svg')
    imgMenu.setAttribute('src', '/images/close-menu.png')
    menuButton.setAttribute('onclick', 'deactivateMenu()')

}

function deactivateMenu() {
    const menu = document.querySelector('.menu');
    const menuButton = document.querySelector('.menu-mobile')
    menu.style.display = 'none';
    menuActive = false;
    header.style.backgroundColor = 'var(--brand-green-light)'
    imgLogo.setAttribute('src', '/images/CashFlow-Logo.svg')
    imgMenu.setAttribute('src', '/images/Icon.png')
    menuButton.setAttribute('onclick', 'activateMenu()')
}

const faqs = document.querySelectorAll(".faq");


faqs.forEach(faq => {

    faq.addEventListener("click", () => {
        faq.classList.toggle("active");
    });
});


var menuItem = document.querySelectorAll('.item-menu')

function selectLink(){
    menuItem.forEach((item)=>
        item.classList.remove('ativo')
    )
    this.classList.add('ativo')
}

menuItem.forEach((item)=>
    item.addEventListener('click', selectLink)
)

//Expandir o menu

var btnExp = document.querySelector('.btn-expandir')
var menuSide = document.querySelector('.menu-lateral')

btnExp.addEventListener('click', function(){
    menuSide.classList.toggle('expandir')
})