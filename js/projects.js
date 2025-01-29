import { ENV_URL } from "./config.js";
import { trimString } from "./trim.js";

// Define the base URL manually for different environments
const BASE_URL = ENV_URL;

async function getPostsBySubcategory(parentSlug, subcategorySlug) {
  try {
    const parentResponse = await fetch(
      `${BASE_URL}/wp-json/wp/v2/categories?slug=${parentSlug}`
    );

    const parentCategory = await parentResponse.json();

    if (parentCategory.length > 0) {
      const parentId = parentCategory[0].id;

      const subcategoryResponse = await fetch(
        `${BASE_URL}/wp-json/wp/v2/categories?slug=${subcategorySlug}&parent=${parentId}`
      );
      const subcategories = await subcategoryResponse.json();

      if (subcategories.length > 0) {
        const subcategoryId = subcategories[0].id;

        const postsResponse = await fetch(
          `${BASE_URL}/wp-json/wp/v2/posts?categories=${subcategoryId}&_embed`
        );
        const posts = await postsResponse.json();

        // Fetch tag details for each post
        for (const post of posts) {
          if (post.tags && post.tags.length > 0) {
            const tagIds = post.tags.join(",");
            const tagsResponse = await fetch(
              `${BASE_URL}/wp-json/wp/v2/tags?include=${tagIds}`
            );
            const tags = await tagsResponse.json();
            post.tagDetails = tags; // Add the tags details to each post
          }
        }

        return posts; // Return the posts array with tags
      } else {
        console.error("Subcategory not found under the specified parent");
        return [];
      }
    } else {
      console.error("Parent category not found");
      return [];
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

//project section
getPostsBySubcategory("projects-2", "content-projects-2").then((posts) => {
  const projectSection = document.getElementById("data-container");
  if (posts.length > 0) {
    posts.reverse();
    posts.forEach((post) => {
      const content = trimString(post.content.rendered);
      projectSection.innerHTML += `<div class="four columns card">
                        <div
                          class="greennature-item greennature-portfolio-item greennature-classic-portfolio"
                        >
                          <div
                            class="greennature-ux greennature-classic-portfolio-ux"
                          >
                            <div class="portfolio-thumbnail greennature-image">
                              <img
                                src="${
                                  post._embedded["wp:featuredmedia"][0]
                                    .source_url
                                }"
                                alt=""
                                width="400"
                                height="300"
                              /><span class="portfolio-overlay">&nbsp;</span
                              ><a
                                class="portfolio-overlay-icon"
                                href="upload/shutterstock_161515241.jpg"
                                data-rel="fancybox"
                                ><span class="portfolio-icon"
                                  ><i class="fa fa-search"></i></span
                              ></a>
                            </div>
                            <div class="portfolio-classic-content">
                              <h3 class="portfolio-title">
                                <a href="single-post.html?id=${post.id}"
                                  >${post.title.rendered}</a
                                >
                              </h3>
                              <div class="greennature-portfolio-info">
                              <div class="portfolio-info portfolio-tag">
                                      <span class="info-head greennature-title"
                                        >Tags </span
                                      >${
                                        post.tagDetails
                                          ? post.tagDetails
                                              .map(
                                                (tag) =>
                                                  `<a href="#" rel="tag">${tag.name}</a>`
                                              )
                                              .join(", ")
                                          : "No tags"
                                      }
                                    </div>
                                <div class="clear"></div>
                              </div>
                              <div class="portfolio-excerpt">
                              ${content}
                                <div class="clear"></div>
                                <a
                                  href="../portfolio/wind-energy/index.html"
                                  class="excerpt-read-more"
                                  >Read More</a
                                >
                              </div>
                              <a
                                class="portfolio-classic-learn-more"
                                href="../portfolio/wind-energy/index.html"
                                >Learn More</a
                              >
                            </div>
                          </div>
                        </div>
                      </div>`;
                         // After all posts are loaded, update pagination
          if (projectSection.children.length === posts.length) {
            initializePagination();
          }
    });
  } else {
    console.log("No posts found in the specified subcategory");
  }
});

// Initialize pagination after loading posts
function initializePagination() {
  const cardsPerPage = 9; // Adjust as needed
  const dataContainer = document.getElementById('data-container');
  const pagination = document.getElementById('pagination');
  const prevButton = document.getElementById('prev');
  const nextButton = document.getElementById('next');
 
  const pageLinksContainer = document.getElementById('page-links'); // Number container
  
  const cards = Array.from(dataContainer.getElementsByClassName('card'));
  
  // Calculate total pages
  const totalPages = Math.ceil(cards.length / cardsPerPage);
  let currentPage = 1;
  
  // Function to display the correct set of cards
  function displayPage(page) {
      const startIndex = (page - 1) * cardsPerPage;
      const endIndex = startIndex + cardsPerPage;
  
      cards.forEach((card, index) => {
          card.style.display = (index >= startIndex && index < endIndex) ? 'block' : 'none';
      });
  
      updatePagination();
  }
  
  // Function to update pagination numbers and buttons
  function updatePagination() {
     
      
      // Enable/disable prev & next buttons
      prevButton.style.pointerEvents = currentPage === 1 ? "none" : "auto";
      nextButton.style.pointerEvents = currentPage === totalPages ? "none" : "auto";
      prevButton.classList.toggle("disabled", currentPage === 1);
      nextButton.classList.toggle("disabled", currentPage === totalPages);
  
      // Clear existing numbers and regenerate
      pageLinksContainer.innerHTML = '';
  
      for (let i = 1; i <= totalPages; i++) {
          const pageLink = document.createElement('a');
          pageLink.href = "#";
          pageLink.classList.add('page-numbers', 'page-link');
          pageLink.dataset.page = i;
          pageLink.textContent = i;
  
          // Highlight the current page
          if (i === currentPage) {
              pageLink.classList.add('current');
          }
  
          pageLink.addEventListener('click', (e) => {
              e.preventDefault();
              goToPage(i);
          });
  
          pageLinksContainer.appendChild(pageLink);
      }
  }
  
  // Function to navigate pages
  function goToPage(page) {
      if (page >= 1 && page <= totalPages) {
          currentPage = page;
          displayPage(currentPage);
      }
  }
  
  // Event listeners for Prev/Next buttons
  prevButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentPage > 1) goToPage(currentPage - 1);
  });
  
  nextButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentPage < totalPages) goToPage(currentPage + 1);
  });
  
  // Initial page load
  displayPage(currentPage);
  
}