import debounce from 'lodash.debounce';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';

const elements = {
  select: document.querySelector('.breed-select'),
  info: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
};

elements.select.classList.add('is-hidden');
elements.info.classList.add('is-hidden');
elements.error.classList.add('is-hidden');

fetchBreeds()
  .then(data => {
    setTimeout(() => {
      data.forEach(({ id, name }) => {
        elements.select.insertAdjacentHTML(
          'beforeend',
          `
          <option value="${id}">${name}</option>`
        );
      });

      elements.select.classList.remove('is-hidden');
      elements.loader.classList.add('is-hidden');
    }, 1000);
  })
  .catch(err => {
    elements.error.classList.remove('is-hidden');
    elements.select.classList.add('is-hidden');
    elements.info.classList.add('is-hidden');
    elements.loader.classList.add('is-hidden');
  });

elements.select.addEventListener('click', debounce(handlerClick, 300));

function handlerClick(e) {
  console.log(SlimSelect.select);

  fetchCatByBreed(elements.select.value)
    .then(data => {
      elements.loader.classList.remove('is-hidden');
      elements.info.classList.add('is-hidden');

      setTimeout(() => {
        const [
          {
            breeds: [
              {
                name = 'Default cat',
                temperament = 'Default temperament',
                description = 'Default description',
              },
            ] = [],
            url = 'https://cdn2.thecatapi.com/images/OOD3VXAQn.jpg',
          },
        ] = data;
        elements.info.innerHTML = `
        <img src="${url}" alt="${name}" width="300">
             <h1>${name}</h1>
             <p>${description}</p>
             <p>${temperament}</p>
          </img>`;
        elements.info.classList.remove('is-hidden');
        elements.loader.classList.add('is-hidden');
      }, 1000);
    })
    .catch(err => {
      elements.error.classList.remove('is-hidden');
      elements.info.classList.add('is-hidden');
      elements.loader.classList.add('is-hidden');
    });
}
