const accessKey = "W-kZhthC4G6C8vQgWusWPEVYn32Frm7m3hGWH-0_ddM"; 
const apiUrl = 'http://localhost:3000/favorites';

const formEL = document.querySelector('#search-form');
const inputEl = document.querySelector('#Search-input');
const searchResults = document.querySelector('.search-result');
const showMore = document.querySelector('#show-more-button');
const toggleButton = document.querySelector('#toggle-button');

let inputData = "";
let page = 1;

async function searchImages() {
    inputData = inputEl.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const results = data.results;

        if (page === 1) {
            searchResults.innerHTML = "";
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
            imageLink.textContent = result.alt_description || "View Image";

            const saveButton = document.createElement("button");
            saveButton.textContent = "Save Favorite";
            saveButton.classList.add("save-button");

            saveButton.addEventListener("click", () => {
                saveFavorite({ imageUrl: result.urls.small, alt_description: result.alt_description });
            });

            imageWrapper.appendChild(image);
            imageWrapper.appendChild(imageLink);
            imageWrapper.appendChild(saveButton);
            searchResults.appendChild(imageWrapper);
        });

        if (results.length > 0) {
            page++;
            showMore.style.display = "block";
        } else {
            showMore.style.display = "none"; 
        }
    } catch (error) {
        console.error("Error fetching images:", error);
    }
}

async function saveFavorite(imageData) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(imageData)
        });
        fetchFavorites(); // Refresh favorites after saving
    } catch (error) {
        console.error("Error saving favorite:", error);
    }
}

async function fetchFavorites() {
    try {
        const response = await fetch(apiUrl);
        const favorites = await response.json();
        searchResults.innerHTML = ""; // Clear existing favorites
        favorites.forEach(displayFavorite);
    } catch (error) {
        console.error("Error fetching favorites:", error);
    }
}

async function deleteFavorite(id) {
    try {
        await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });
        fetchFavorites(); // Refresh favorites after deleting
    } catch (error) {
        console.error("Error deleting favorite:", error);
    }
}

function displayFavorite(favorite) {
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add("search-card");

    const image = document.createElement("img");
    image.src = favorite.imageUrl;
    image.alt = favorite.alt_description || "Image";

    const imageLink = document.createElement("a");
    imageLink.href = favorite.imageUrl;
    imageLink.target = "_blank";
    imageLink.textContent = "View Favorite";

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", () => {
        // Implement edit functionality here
        alert("Edit functionality not implemented yet!");
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () => {
        deleteFavorite(favorite.id); // Assuming you have an ID for deletion
    });

    const buttonWrapper = document.createElement('div');
    buttonWrapper.appendChild(editButton);
    buttonWrapper.appendChild(deleteButton);
    
    imageWrapper.appendChild(image);
    imageWrapper.appendChild(imageLink);
    imageWrapper.appendChild(buttonWrapper);
    searchResults.appendChild(imageWrapper);
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

// Fetch favorites on page load
fetchFavorites();
