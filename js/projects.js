import { ENV_URL } from "./config.js";

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
  const projectSection = document.getElementById("projects");
  if (posts.length > 0) {
    posts.reverse();
    posts.forEach((post) => {
      projectSection.innerHTML += `<div class="four columns">
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
                                <a href="../portfolio/wind-energy/index.html"
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
                              ${post.content.rendered}
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
    });
  } else {
    console.log("No posts found in the specified subcategory");
  }
});
