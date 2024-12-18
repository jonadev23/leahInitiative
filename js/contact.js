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

//map section
getPostsBySubcategory("contact", "map").then((posts) => {
  const mapWrapper = document.getElementById("map");
  if (posts.length > 0) {
    console.log(posts);
    mapWrapper.innerHTML = posts[0].content.rendered;
  } else {
    console.log("No posts found in the specified subcategory");
  }
});

//information section
getPostsBySubcategory("contact", "information").then((posts) => {
  const infoWrapper = document.getElementById("information");
  if (posts.length > 0) {
    console.log(posts);
    posts.forEach((post) => {
      infoWrapper.innerHTML += `<div class="four columns">
                            <div class="greennature-box-with-icon-ux greennature-ux">
                                <div class="greennature-item greennature-box-with-icon-item pos-top type-circle">
                                    <!--div class="box-with-circle-icon" style="background-color: #5dc269"><div id="favicon">${post.excerpt.rendered}</div>
                                        <br>
                                    </div-->
                                    <h4 class="box-with-icon-title">${post.title.rendered}</h4>
                                    <div class="clear"></div>
                                    <div class="box-with-icon-caption">
                                        ${post.content.rendered}
                                    </div>
                                </div>
                            </div>
                        </div>`;
    });
  } else {
    console.log("No posts found in the specified subcategory");
  }
});
