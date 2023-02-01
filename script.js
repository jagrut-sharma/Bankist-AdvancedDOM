'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

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

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

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

header.prepend(message); //  inside header before content
// header.append(message); // inside header after content
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
