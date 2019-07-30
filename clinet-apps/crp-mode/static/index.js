const apiKey = `7e53db1c594b4b084c25a0998fecd85a`;
const endPoint = `https://gateway.marvel.com:443/v1/public/`;

let CharacterData = [];
let offset = 99;
let counter = 0;

function getCharacters() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", `${endPoint}characters?limit=99&offset=${counter*offset}&apikey=${apiKey}`)
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  return new Promise((rsl, rej) => {
    xhr.onload = () => {
      if (xhr.status === 200) {
        counter ++;
        const response = JSON.parse(xhr.response);
        const { data: { results } } = response;
        return rsl(results);
      }
    }
    xhr.send();
  })
}

function initObserver() {
  // create config object: rootMargin and threshold
  // are two properties exposed by the interface
  const config = {
    root: null,
    rootMargin: "0px 0px 250px 0px",
    threshold: 0
  };

  let observer = new IntersectionObserver(function (entries, self) {
    entries.forEach(entry => {
      console.log(entry);
      if (entry.isIntersecting) {
        const myImage = new Image(100, 200);
        myImage.src = entry.target.dataset.src;
        myImage.onload = (ev) => {
          const rm = entry.target.querySelector('.lds-ripple');
          entry.target.style.background = `center / cover url(${ev.target.src})`;
          entry.target.removeChild(rm);
        }
        self.unobserve(entry.target);
      }
    });
  }, config);

  return observer;
}

function addLoaders() {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 4; i++) {
    const div = document.createElement('div');
    div.classList.add('image');
    const divImage = document.createElement('div');
    divImage.classList.add('image__item');
    divImage.innerHTML = `<div class="lds-ripple"><div></div><div></div></div>`;
    div.style.display = 'inline-block';
    div.style.width = '25%';
    div.appendChild(divImage);
    frag.appendChild(div);
  }
  document.body.appendChild(frag);
}

function removeLoaders() {
  const loaders = document.querySelectorAll('.image');
  loaders.forEach(node => {
    node.parentNode.removeChild(node);
  })
}

function loadCharts(chars) {
  const observer = initObserver();
  chars = chars.map(hero => {
    const { name, thumbnail } = hero;
    const image = `${thumbnail.path}.${thumbnail.extension}`;
    return { name, image };
  })
  CharacterData = [CharacterData, chars];
  const frag = document.createDocumentFragment();
  chars.forEach((item) => {
    const div = document.createElement('div');
    const divImage = document.createElement('div');
    divImage.setAttribute('data-src', `${item.image}`);
    divImage.setAttribute('data-name', `${item.name}`.toLocaleLowerCase());
    divImage.classList.add('image__item');
    divImage.innerHTML = `<div class="lds-ripple"><div></div><div></div></div>`;
    div.classList.add('image');
    div.style.display = 'inline-block';
    div.style.width = '25%';
    div.appendChild(divImage);
    frag.appendChild(div);
    observer.observe(divImage);
  })
  removeLoaders();
  document.body.appendChild(frag);
}

function loadFonts() {
  const fonts = [new FontFace("Bangers", "url(https://fonts.gstatic.com/s/bangers/v12/FeVQS0BTqb0h60ACH5FQ2J5hm25mww.woff2)", {
    style: 'normal', weight: '400'
  }), new FontFace("Bangers", "url(https://fonts.gstatic.com/s/bangers/v12/FeVQS0BTqb0h60ACH5BQ2J5hm25mww.woff2)", {
    style: 'normal', weight: '400'
  }), new FontFace("Bangers", "url(https://fonts.gstatic.com/s/bangers/v12/FeVQS0BTqb0h60ACH55Q2J5hm24.woff2)", {
    style: 'normal', weight: '400'
  })]
  const promises = fonts.map(font => font.load());
  Promise.all(promises).then(fonts => {
    fonts.forEach(font => {
      document.fonts.add(font);
    })
    document.body.style.fontFamily = "Bangers, crusive";
  })
}

function onSearch(name) {
  return CharacterData.map(char => ({...char, isHidden: !char.name.toLocaleLowerCase().includes(name) }));
}

export { addLoaders, loadCharts, getCharacters, loadFonts, onSearch };