const cardsData = {};
let cardAttributes = [];

const cardColors = {
  suica: { color: "#89c259", gradient: "linear-gradient(135deg, #89c259, #6ca644)" },
  mobile_suica: { color: "#89c259", gradient: "linear-gradient(135deg, #89c259, #6ca644)" },
  mobile_pasmo: { color: "#f24e70", gradient: "linear-gradient(135deg, #f24e70, #d1385b)" },
  pasmo: { color: "#f24e70", gradient: "linear-gradient(135deg, #f24e70, #d1385b)" },
  icoca: { color: "#3fbdd6", gradient: "linear-gradient(135deg, #3fbdd6, #2ca1bc)" },
  toica: { color: "#89dceb", gradient: "linear-gradient(135deg, #89dceb, #5fcadf)" },
  pitapa: { color: "#c9c9e5", gradient: "linear-gradient(135deg, #c9c9e5, #b3b3cc)" },
  nimoca: { color: "#7bb3d4", gradient: "linear-gradient(135deg, #7bb3d4, #5b9cc1)" },
  sugoca: { color: "#d6d4c5", gradient: "linear-gradient(135deg, #d6d4c5, #bfbda9)" },
  hayakaken: { color: "#9fd9ef", gradient: "linear-gradient(135deg, #9fd9ef, #7cc7e7)" },
  manaca: { color: "#fee101", gradient: "linear-gradient(135deg, #fee101, #e6c400)" },
  kitaca: { color: "#a5c50c", gradient: "linear-gradient(135deg, #a5c50c, #8aa10b)" }
};

const defaultCardColor = { color: "#6c7086", gradient: "linear-gradient(135deg, #6c7086, #45475a)" };

document.addEventListener('DOMContentLoaded', () => {

  loadData();

  window.addEventListener('scroll', animateOnScroll);

  setTimeout(() => {
    animateOnScroll();
  }, 100);
});

async function loadData() {
  try {
    const res = await fetch('cards.json');
    const data = await res.json();
    cardsData.data = data.cards;
    cardAttributes = data.attributes;

    populateSelectors();
    updateComparison();
    updateCardPreviews();

    document.body.classList.add('loaded');
  } catch (error) {
    console.error("データの読み込みに失敗しました:", error);

  }
}

function populateSelectors() {
  const keys = Object.keys(cardsData.data);
  const selects = ["card1", "card2", "card3"];

  selects.forEach((id, i) => {
    const select = document.getElementById(id);
    select.innerHTML = '';

    keys.forEach(key => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = cardsData.data[key].name;
      select.appendChild(option);
    });

    select.selectedIndex = i < keys.length ? i : 0;

    select.addEventListener("change", () => {
      updateComparison();
      updateCardPreviews();
    });
  });
}

function updateCardPreviews() {
  const selected = [
    document.getElementById("card1").value,
    document.getElementById("card2").value,
    document.getElementById("card3").value
  ];

  selected.forEach((id, index) => {
    const previewEl = document.getElementById(`preview${index + 1}`);
    if (!previewEl) return;

    const card = cardsData.data[id];

    if (card) {
      const imageEl = previewEl.querySelector('.card-image');
      const nameEl = previewEl.querySelector('.card-name');
      const issuerEl = previewEl.querySelector('.card-issuer');

      const cardStyle = cardColors[id] || defaultCardColor;
      imageEl.style.background = cardStyle.gradient;

      nameEl.textContent = card.name;
      issuerEl.textContent = card.attributes["発行企業・運営"] || "-";

      previewEl.style.opacity = 0;
      previewEl.style.transform = 'translateY(20px)';

      setTimeout(() => {
        previewEl.style.opacity = 1;
        previewEl.style.transform = 'translateY(0)';
      }, 100 * index);
    }
  });

  updateHeroCards(selected);
}

function updateHeroCards(selected) {
  const heroCards = document.querySelectorAll('.floating-card');

  selected.forEach((id, index) => {
    if (index < heroCards.length && cardsData.data[id]) {
      const card = cardsData.data[id];
      const heroCard = heroCards[index];
      const cardStyle = cardColors[id] || defaultCardColor;

      heroCard.style.background = cardStyle.gradient;
      heroCard.querySelector('.card-logo').textContent = card.name;
    }
  });
}

function updateComparison() {
  const selected = [
    document.getElementById("card1").value,
    document.getElementById("card2").value,
    document.getElementById("card3").value
  ];

  const container = document.getElementById("comparison");
  container.innerHTML = '';

  container.appendChild(makeCell("属性/カード", "header"));
  selected.forEach(id => {
    const cell = makeCell(cardsData.data[id].name, "header");
    const cardStyle = cardColors[id] || defaultCardColor;
    cell.style.background = cardStyle.gradient;
    container.appendChild(cell);
  });

  cardAttributes.forEach(attr => {
    container.appendChild(makeCell(attr, "attribute"));
    selected.forEach(id => {
      const value = cardsData.data[id].attributes[attr] || "-";
      const cell = makeCell(value);
      container.appendChild(cell);
    });
  });

  const cells = container.querySelectorAll('div');
  cells.forEach((cell, index) => {
    cell.style.opacity = 0;
    cell.style.transform = 'scale(0.95)';

    setTimeout(() => {
      cell.style.opacity = 1;
      cell.style.transform = 'scale(1)';
    }, 20 * index);
  });
}

function makeCell(content, className = '') {
  const div = document.createElement("div");
  div.textContent = content;
  if (className) div.classList.add(className);
  return div;
}

function animateOnScroll() {
  const elements = document.querySelectorAll('.section-header, .glass-card, .feature-card');

  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementBottom = element.getBoundingClientRect().bottom;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight * 0.9 && elementBottom > 0) {
      element.classList.add('animate');
      element.style.opacity = 1;
      element.style.transform = 'translateY(0)';
    } else if (!element.classList.contains('animate')) {
      element.style.opacity = 0;
      element.style.transform = 'translateY(20px)';
    }
  });
}