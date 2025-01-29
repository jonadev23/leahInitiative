import { ENV_URL } from "./config.js";
import { trimStringLong,mapDate } from "./trim.js";
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

//images section
getPostsBySubcategory("blogs", "content").then((posts) => {
  const contentWrapper = document.getElementById("data-container");

  if (posts.length > 0) {
    posts.reverse();
    posts.forEach((post) => {
      const dateX = post.date;

      mapDate(dateX).then(
        function (value) {
          const dayOfPost = value.getToday;
          const yearOfPost = value.getThatYear;
          const monthOfPost = value.getMonth;
          const content = trimStringLong(post.content.rendered,150);
          const cardHTML = `<div class="twelve columns card">
                              <div class="greennature-item greennature-blog-grid greennature-skin-box">
                                <div class="greennature-ux greennature-blog-grid-ux">
                                  <article class="post">
                                    <div class="greennature-standard-style">
                                      <div id="blog" class="greennature-blog-thumbnail">
                                        <a href="${post.link}">
                                          <img src="${post._embedded["wp:featuredmedia"][0].source_url}" alt="Post Image" width="960" height="638"/>
                                        </a>
                                      </div>
                                      <div class="greennature-blog-grid-content">
                                        <header class="post-header">
                                          <h3 class="greennature-blog-title">
                                            <a href="${post.link}">${post.title.rendered}</a>
                                          </h3>
                                          <div class="greennature-blog-info">
                                            <div class="blog-info blog-date">
                                              <i class="fa fa-clock-o"></i>
                                              <a href="#">${dayOfPost} ${monthOfPost} ${yearOfPost}</a>
                                            </div>
                                          </div>
                                        </header>
                                        <div class="greennature-blog-content">
                                          ${content}
                                          
                                        </div>
                                        <a href="${post.link}" class="excerpt-read-more">Read More</a>
                                      </div>
                                    </div>
                                  </article>
                                </div>
                              </div>
                            </div>`;
          contentWrapper.innerHTML += cardHTML;

          // After all posts are loaded, update pagination
          if (contentWrapper.children.length === posts.length) {
            initializePagination();
          }
        },
        function (error) {
          console.error(error);
        }
      );
    });
  } else {
    console.log("No posts found in the specified subcategory");
  }
});

// Initialize pagination after loading posts
function initializePagination() {
  const cardsPerPage = 2; // Adjust as needed
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

// Recent works section
getPostsBySubcategory("blogs", "content").then((posts) => {
  const projectSection = document.getElementById("recent");
  if (posts.length > 0) {
    const filteredPost = posts.slice(0, 2);

    filteredPost.forEach((post) => {
      const dateX = post.date;

      mapDate(dateX).then(
        function (value) {
          const dayOfPost = value.getToday;
          const yearOfPost = value.getThatYear;
          const monthOfPost = value.getMonth;
          projectSection.innerHTML += `<div class="recent-post-widget">
                        <div class="recent-post-widget-thumbnail">
                          <a href="../portfolio/wind-energy/index.html"
                            ><img
                              src="${post._embedded["wp:featuredmedia"][0].source_url}"
                              alt=""
                              width="150"
                              height="150"
                          /></a>
                        </div>
                        <div class="recent-post-widget-content">
                          <div class="recent-post-widget-title">
                           ${post.title.rendered}
                          </div>
                          <div class="recent-post-widget-info">
                            <div
                              class="blog-info blog-date greennature-skin-info"
                            >
                              <i class="fa fa-clock-o"></i
                              >
                                ${dayOfPost}&nbsp;${monthOfPost}&nbsp;${yearOfPost}
                            </div>
                            <div class="clear"></div>
                          </div>
                        </div>
                        <div class="clear"></div>
                      </div>`;
        },
        function (error) {
          console.error("Error formatting date:", error);
        }
      );
    });
  } else {
    console.log("No posts found in the specified subcategory");
  }
});