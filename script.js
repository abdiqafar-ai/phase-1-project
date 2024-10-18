const accessKey = "W-kZhthC4G6C8vQgWusWPEVYn32Frm7m3hGWH-0_ddM";

const formEL = document.querySelector('form');
const inputEl = document.querySelector('#Search-input');
const searchResults = document.querySelector('.search-result');
const showMore = document.querySelector('#show-more-button');
const toggleButton = document.querySelector('#toggle-button');

let inputData = "";
let page = 1;

async function searchImages() {
    inputData = inputEl.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;

    const response = await fetch(url);
    const data = await response.json();
    const results = data.results;
           
    if (page === 1) {
        searchResults.textContent = "";
    }

    results.forEach((result) => {
        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add("search-card");

        const image = document.createElement("img");
        image.src = result.urls.small;
        image.alt = result.alt_description || "Image";

        const imageLink = document.createElement("a");
        imageLink.href = result.links.html;
        imageLink.target = "_blank";
        imageLink.textContent = result.alt_description || "Image";

        
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        
        
        deleteButton.addEventListener("click", () => {
            searchResults.removeChild(imageWrapper);
        });

        imageWrapper.appendChild(image);
        imageWrapper.appendChild(imageLink);
        imageWrapper.appendChild(deleteButton);
        searchResults.appendChild(imageWrapper);
    });

    if (results.length > 0) {
        page++;
        showMore.style.display = "block";
    } else {
        showMore.style.display = "none"; 
    }
}

formEL.addEventListener("submit", (event) => {
    event.preventDefault();
    page = 1;
    searchImages();
});

showMore.addEventListener("click", (event) => {
    event.preventDefault();
    searchImages(); 
});

toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
