import gsap from 'gsap';

const menuBtn = document.querySelector('.menu-btn');
const menuFirst = document.querySelectorAll('.menu-toggle:first-child');
const menuLast = document.querySelectorAll('.menu-toggle:last-child');
const menuMiddle = document.querySelectorAll('.menu-toggle:nth-child(2)');
const navBody = document.querySelector('.nav-body');
const navBodyItems = document.querySelectorAll('.nav-body__item');
const body = document.body;

let isClicked = false;

const tlBtn = gsap.timeline({ duration: 0.5, paused: true });
tlBtn
  .to(menuFirst, {
    rotation: 45,
    transformOrigin: '50% 50%',
    x: -3,
    y: 8,
    backgroundColor: '#565656',
  })
  .to(
    menuLast,
    {
      rotation: -45,
      transformOrigin: '-50% 50%',
      x: 5,
      y: 12,
      backgroundColor: '#565656',
    },
    '<'
  )
  .to(menuMiddle, { x: 100, opacity: 0 }, '<');

const tlNav = gsap.from(navBody, { paused: true, duration: 0.8, opacity: 0 });
const tNavItems = gsap.from(navBodyItems, {
  paused: true,
  duration: 0.8,
  opacity: 0,
  stagger: 0.2,
  y: 500,
});

const menuAnimation = () => {
  tlBtn.reversed() ? tlBtn.play() : tlBtn.reverse();
  tlNav.reversed() ? tlNav.play() : tlNav.reverse();
  tNavItems.reversed() ? tNavItems.play() : tNavItems.reverse();

  menuBtn.addEventListener('click', () => {
    isClicked = !isClicked;
    if (isClicked) {
      body.style = 'overflow: hidden';
    } else {
      body.style = 'overflow: scroll';
    }
    tlBtn.reversed() ? tlBtn.play() : tlBtn.reverse();
    tlNav.reversed() ? tlNav.play() : tlNav.reverse();
    tNavItems.reversed() ? tNavItems.play() : tNavItems.reverse();
  });
};

export { menuAnimation };
