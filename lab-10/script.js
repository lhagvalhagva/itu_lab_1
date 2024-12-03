// RSS feed-ээс мэдээ татах
function fetchNews() {
  const xhr = new XMLHttpRequest();
  // cors - anywhere;
  xhr.open(
    "GET",
    "https://api.allorigins.win/raw?url=" +
      encodeURIComponent("https://ikon.mn/rss"),
    true
  );

  xhr.onload = function () {
    if (xhr.status === 200) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xhr.responseText, "text/xml");
      const items = xmlDoc.getElementsByTagName("item");

      // Хуудас тус бүрт тохирох функцийг дуудна
      if (window.location.pathname.includes("news-detail.html")) {
        displayNewsDetail(items);
      } else {
        displayNewsList(items);
      }
    }
  };

  xhr.send();
}

function displayNewsList(items) {
  const newsListDiv = document.getElementById("news-list");
  let html = `
    <h1 class="text-center mb-4">Мэдээний жагсаалт</h1>
    <div class="news-grid">
  `;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const title = item.getElementsByTagName("title")[0].textContent;
    const description = item.getElementsByTagName("description")[0].textContent;

    // Description-оос эхний зургийг олох
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = description;
    const firstImage = tempDiv.querySelector("img");
    const imageUrl = firstImage
      ? firstImage.getAttribute("src")
      : "./images/default-news-image.png";

    const plainText = description.replace(/<[^>]*>/g, "");
    const shortDescription = plainText.slice(0, 100) + "...";

    html += `
      <div class="news-card">
        <div class="news-card-image">
          <img src="${imageUrl}" alt="${title}">
        </div>
        <div class="news-card-content">
          <h2 class="news-card-title">
            <a href="news-detail.html?id=${i}">${title}</a>
          </h2>
          <p class="news-card-excerpt">${shortDescription}</p>
          <a href="news-detail.html?id=${i}" class="read-more">
            Цааш унших →
          </a>
        </div>
      </div>
    `;
  }

  html += "</div>";
  newsListDiv.innerHTML = html;
}

// Мэдээний дэлгэрэнгүйг харуулах
function displayNewsDetail(items) {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (id !== null && items[id]) {
    const newsDetailDiv = document.getElementById("news-detail");
    const item = items[id];
    const title = item.getElementsByTagName("title")[0].textContent;
    const description = item.getElementsByTagName("description")[0].textContent;

    let html = `
      <h1>${title}</h1>
      <div class="content">${description}</div>
      <a href="lab-10.html" class="back-link">← Буцах</a>
    `;

    newsDetailDiv.innerHTML = html;
  }
}

// Хуудас ачаалагдахад мэдээ татна
window.onload = fetchNews;
