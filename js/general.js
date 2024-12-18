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
//logo-navbar section
getPostsBySubcategory("general-content", "logo").then((posts) => {
  const contentWrapper = document.getElementById("logo");

  if (posts.length > 0) {
    contentWrapper.innerHTML = ` <img
                    src=${posts[0]._embedded["wp:featuredmedia"][0].source_url}
                    style="width: 170px"
                    alt=""
                  />
      `;
  } else {
    console.log("No posts found in the specified subcategory");
  }
});

//logo-footer section
getPostsBySubcategory("general-content", "logo").then((posts) => {
  const contentWrapper = document.getElementById("logo-footer");

  if (posts.length > 0) {
    contentWrapper.innerHTML = ` <img
                    src=${posts[0]._embedded["wp:featuredmedia"][0].source_url}
                    style="width: 170px"
                    alt=""
                  />
      `;
  } else {
    console.log("No posts found in the specified subcategory");
  }
});

//contact section
getPostsBySubcategory("general-content", "contact-general-content").then(
  (posts) => {
    const contentWrapper = document.getElementById("contact");

    if (posts.length > 0) {
      contentWrapper.innerHTML = `<span>${posts[0].content.rendered}</span>`;
    } else {
      console.log("No posts found in the specified subcategory");
    }
  }
);

//contact section
getPostsBySubcategory("general-content", "email").then((posts) => {
  const contentWrapper = document.getElementById("email");

  if (posts.length > 0) {
    contentWrapper.innerHTML = `<span>${posts[0].content.rendered}</span>`;
  } else {
    console.log("No posts found in the specified subcategory");
  }
});
