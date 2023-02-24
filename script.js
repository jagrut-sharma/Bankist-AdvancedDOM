'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const sectionOne = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const imgTargets = document.querySelectorAll('img[data-src]');
const allSections = document.querySelectorAll('.section');

// MODAL Window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// SMOOTH SCROLLING

btnScrollTo.addEventListener('click', function (e) {
  console.log(e.target.getBoundingClientRect());
  const sectionOneCoords = sectionOne.getBoundingClientRect();
  console.log(sectionOneCoords);

  console.log('Current Scroll X/Y:', window.pageXOffset, window.scrollY); // gives current scroll poisition
  // window.pageXOffset = window.scrollX and window.pageYOffset = window.scrollY

  // To get current width and height of viewport
  console.log(
    'Current width/height of viewport:',
    document.documentElement.clientWidth,
    document.documentElement.clientHeight
  );

  // window.scrollTo(sectionOneCoords.left, sectionOneCoords.top);
  // It will not scroll correctly now, as it gives the distance in teh current viewport and not overall from top of the page => To solve this, we add scrolled + top distance in current viewport to obtain correct distance that scroll needs to happen

  // window.scrollTo(
  //   sectionOneCoords.left + window.pageXOffset,
  //   sectionOneCoords.top + window.pageYOffset
  // );

  // Can also pass an object
  // window.scrollTo({
  //   left: sectionOneCoords.left + window.scrollX,
  //   top: sectionOneCoords.top + window.scrollY,
  //   behavior: 'smooth',
  // });

  // All lines can be condensed into one line, this is supported by modern browsers only:
  sectionOne.scrollIntoView({ behavior: 'smooth' }); // Works only in modern browsers
});

// PAGE NAVIGATION
// document.querySelectorAll('.nav__link').forEach(function (ele) { // forEach was used because querySelectorAll gives nodeList and we need to attach event handlers to each link
//   ele.addEventListener('click', function (e) {
//     e.preventDefault();
//     // console.log('LINK');
//     const id = e.target.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed Components:

// tabs.forEach(t => t.addEventListener('click', () => console.log('clicked')));
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;
  // or we can use nullish coalescent => but we won't because we need atleast one active tab and also further operations will stop
  // clicked?.classList.add('operations__tab--active');

  // activate tabs
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Activate content Area:
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu Fade Animation - navbar

const handleHover = function (e) {
  const linkNav = e.target;
  if (linkNav.classList.contains('nav__link')) {
    const siblings = linkNav.closest('.nav').querySelectorAll('.nav__link');
    const logo = linkNav.closest('.nav').querySelector('img');
    // console.log(logo);
    siblings.forEach(ele => {
      if (ele !== linkNav) ele.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// nav.addEventListener('mouseover', e => handleHover(e, 0.5));
nav.addEventListener('mouseover', handleHover.bind(0.5));

// ? bind returns a function with fixed value of "this" => therefore the new function received from bind will be now called everytime and therefore will have access to 'event' enabling us to use e.target etc.

// nav.addEventListener('mouseout', e => handleHover(e, 1));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky Navigation:

/*
// Not very efficient as scroll is attached to window and events keep firing => slowing down page
window.addEventListener('scroll', function (e) {
  const sectionOneCoords = sectionOne.getBoundingClientRect();
  // console.log(sectionOneCoords);
  // console.log(window.scrollY);
  if (window.scrollY > sectionOneCoords.top) {
    nav.classList.add('sticky');
  } else nav.classList.remove('sticky');
});
*/

// Sticky Navigation: Intersection Observer API

// const obsCallback = function (entries, observer) {
//   // The observer we have defined below is also passed and can be used if needed
//   entries.forEach(entry => console.log(entry));
// };
// const obsOptions = {
//   root: null,
//   threshold: 0.1, // can also declare multiple values [0, 0.2] --> One threshold will give one element in entries array whereas in multiple threshold, entries array will consider muliple elements equal to number of threshold values defined
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);

// observer.observe(sectionOne);

const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, // added navHeight as in resposive sites it can be different in different devices so doesn't makes sense to use hardcoded value.
});
headerObserver.observe(header);

// Revealing elements:

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  // const signal = !entry.isIntersecting;
  // console.log(signal);
  // entry.target.classList.toggle('section--hidden', signal); ==> For it to dissapear again once scrolled, also we need to remove unobserve.
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// LAZY LOADING:

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  // GUARD CLAUSE:
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '+200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// SLIDER:
let currSlide = 0;
const maxSlide = slides.length - 1;
const minSlide = 0;

slider.style.transform = `scale(0.4) translateX(-800px)`;
slider.style.overflow = 'visible';

const goToSlide = function (currentSlide) {
  slides.forEach(
    (slide, index) =>
      (slide.style.transform = `translateX(${(index - currentSlide) * 100}%)`) // 0%, 100%, 200%, 300%
  );
};

goToSlide(0);

// Next slide
const nextSlide = function () {
  currSlide++;
  if (currSlide > maxSlide) currSlide = minSlide;
  goToSlide(currSlide);
};

const prevSlide = function () {
  currSlide--;
  if (currSlide < minSlide) currSlide = maxSlide;
  goToSlide(currSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

// DOM Traversing:

/*
We are training with following element:

<div class="header__title">
    <!-- <h1 onclick="alert('HTML alert!')"> -->
      <h1>
        When
        <!-- Green highlight effect -->
        <span class="highlight">banking</span>
        meets<br />
        <span class="highlight">minimalist</span>
      </h1>
      <h4>A simpler banking experience for a simpler life.</h4>
      <button class="btn--text btn--scroll-to">Learn more &DownArrow;</button>
      <img
        src="img/hero.png"
        class="header__img"
        alt="Minimalist bank items"
      />
</div>
*/

/*

const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight')); // NodeList(2) [span.highlight, span.highlight]
console.log(h1.childNodes); // NodeList(9) [text, comment, text, span.highlight, text, br, text, span.highlight, text]
console.log(h1.children); // HTMLCollection(3) [span.highlight, br, span.highlight]

h1.firstElementChild.style.color = 'white'; // will change color of first child element inside h1
h1.lastElementChild.style.color = 'orangered'; // will change color of last child element inside h1

// Going Upwards: parent
console.log(h1.parentNode); // <div class="header__title">...</div> --> gives nodes but in this case is similar to parent element
console.log(h1.parentElement); // <div class="header__title">...</div>
console.log(h1.closest('.header')); // gives header element which is not direct parent
h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)'; // --> Selcts h1 itself

// Going sideways: siblings
console.log(h1.nextElementSibling); // will give the next element
console.log(h1.previousElementSibling); // will give the previous element

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children); // now have access to all siblings --> children give HTML collection

[...h1.parentElement.children].forEach(function (ele) {
  if (ele !== h1) ele.style.transform = 'scale(0.5)';
});

/*
// Event Bubbling and Capturing:

// creating random rgb values in format rgb(255, 255, 255)

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
// console.log(randomColor());

document.querySelector('.nav__link').addEventListener('click', function (e) {
  console.log('LINK');
  console.log(this); // will give where event listener is added => is equal to e.currentTarget
  console.log(e.target); // will gove where event happened
  this.style.backgroundColor = randomColor();
  console.log(e.currentTarget === this);
  // e.stopPropagation(); // Will stop propogation, not recommended to use generally.
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log('CONTAINER');
  console.log(this);
  console.log(e.target);
  this.style.backgroundColor = randomColor();
  console.log(e.currentTarget === this);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  console.log('NAV');
  console.log(this);
  console.log(e.target);
  this.style.backgroundColor = randomColor();
  console.log(e.currentTarget === this);
});
/*
// For capturing:
document.querySelector('.nav__link').addEventListener(
  'click',
  function (e) {
    console.log('LINK');
    console.log(this); // will give where event listener is added => is equal to e.currentTarget
    console.log(e.target); // will gove where event happened
    this.style.backgroundColor = randomColor();
  },
  true // passing true as third parameter means event listener is now listening for capturing phase.
);

document.querySelector('.nav__links').addEventListener(
  'click',
  function (e) {
    console.log('CONTAINER');
    console.log(this);
    console.log(e.target);
    this.style.backgroundColor = randomColor();
  },
  true
);

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    console.log('NAV');
    console.log(this);
    console.log(e.target);
    this.style.backgroundColor = randomColor();
  },
  true
);

/*
// Event Listeners:

const h1 = document.querySelector('h1');

const alertH1 = function () {
  alert('You are reading the heading!');
  h1.removeEventListener('mouseover', alertH1); // callback function that is to be removed, need to be named
};
h1.addEventListener('mouseover', alertH1);

h1.addEventListener(
  'mouseenter',
  function () {
    alert('This will happen once');
  },
  { once: true }
); // Will be removed automatically after executing once

// h1.onmouseenter = function () {
//   alert('On event: You are again reading the heading.');
// };

/*
// SELECTING, CREATING AND DELETING ELEMENTS:

// SELECTING

console.log(document.documentElement); // selects the whole html element
console.log(document.head); // selects head element
console.log(document.body); // selects body element

const header = document.querySelector('.header');
console.log(header);

const allSection = document.querySelectorAll('.section'); // gives NodeList
console.log(allSection);
console.log(document.getElementById('section--1'));
console.log(document.getElementsByTagName('button')); // gives HTMLCollection
console.log(document.getElementsByClassName('btn')); // gives HTMLCollection

// CREATING

// * Also insertAdjacentElement is used for inserting an element
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.innerText = `We use cookies`;
message.innerHTML = `We use cookies for better speed and analytics. <button class="btn btn--close--cookie">Got it!</button>`;

// header.prepend(message); //  inside header before content
header.append(message); // inside header after content
// header.append(message.cloneNode(true)); //  creates a clone and inserts it after content inside header
// header.before(message); // inserts before header
// header.after(message); // inserts after header

// DELETE
document
  .querySelector('.btn--close--cookie')
  .addEventListener('click', function () {
    // message.remove(); // New syntax
    message.parentElement.removeChild(message); // Selects parent element then removes child of parentElement --> Was used previously
  });

message.style.backgroundColor = '#37383d';
message.style.width = '105%';

console.log(message.style.backgroundColor); // rgb(55, 56, 61)
console.log(message.style.color); // Wil just give a blank line as there is no inline CSS property od the same name

// to get property use getComputedStyle method
console.log(getComputedStyle(message)); // will give an object with properties that we didn't define but browser calculated for display
console.log(getComputedStyle(message).height); // 43.6667px --> Getting value from object
console.log(getComputedStyle(message).color); // rgb(187, 187, 187)

// Can be used to keep height as well
message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 25 + 'px';

console.log(getComputedStyle(message).height);

// Changing value of variable:
document.documentElement.style.setProperty('--color-primary', 'yellow');

// ATTRIBUTES:
const logo = document.querySelector('.nav__logo');

console.log(logo.alt); // Bankist logo
console.log(logo.src); // http://127.0.0.1:5500/img/logo.png --> Gives absolute link
console.log(logo.className);

// Non-standard way
console.log(logo.designer); // gives undefined as img tag is not supposed tp have designer attribute

// Standard way
console.log(logo.getAttribute('designer')); // Jagrut

logo.alt = 'Minimalist logo of Bankist'; // will change the alt attribute of logo
logo.setAttribute('company', 'bankist'); // will set an attribute of company

console.log(logo.getAttribute('src')); // gives relative link => img/logo.png

// Data Attributes:
console.log(logo.dataset.versionNumber); // data- attributes will be obtained in dataset object

// You can also use classList.add, remove, toggle to add/remove class. Can use contains to check.*/
