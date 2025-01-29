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

//images section
getPostsBySubcategory("initiatives", "images").then((posts) => {
  const imageWrapper = document.getElementById("greennature-image-wrapper");

  if (posts.length > 0) {
    posts.forEach((post) => {
      imageWrapper.innerHTML += ` <div id="event" class="greennature-stack-image">
                              <a
                                href="${post._embedded["wp:featuredmedia"][0].source_url}"
                                data-fancybox-group="greennature-gal-1"
                                data-rel="fancybox"
                                ><img
                                  src="${post._embedded["wp:featuredmedia"][0].source_url}"
                                  alt=""
                                  
                              /></a>
                            </div>`;
    });
  } else {
    console.log("No posts found in the specified subcategory");
  }
});

//description section
getPostsBySubcategory("initiatives", "description").then((posts) => {
  const descriptionWrapper = document.getElementById(
    "greennature-portfolio-content"
  );
  if (posts.length > 0) {
    posts.reverse();
    posts.forEach((post) => {
      descriptionWrapper.innerHTML += ` <div class="greennature-portfolio-description">
                          <h4 class="head">${post.title.rendered}</h4>
                          <div class="content">
                          ${post.content.rendered}
                          </div>
                        </div>`;
    });
  } else {
    console.log("No posts found in the specified subcategory");
  }
});

//goals section
getPostsBySubcategory("initiatives", "goals").then((posts) => {
  const goalsWrapper = document.getElementById("goals");
  if (posts.length > 0) {
    const content = posts[0].content.rendered;

    const number = parseInt(content.replace(/<\/?p>/g, ""));
    console.log(number); // Will output 100 as a number

    posts.reverse();
    posts.forEach((post) => {
      // Remove any HTML tags from the content and convert to a number
      const percentage = Number(post.content.rendered.replace(/<\/?p>/g, ""));

      // Determine background color based on percentage
      const getBackgroundColor = (percent) => {
        if (percent < 33) return "#ff4d4d"; // Red for low percentages
        if (percent < 66) return "#ffa500"; // Orange for medium percentages
        return "#5dc269"; // Green for high percentages
      };

      goalsWrapper.innerHTML += `
        <div class="greennature-skill-bar-wrapper greennature-item greennature-size-small">
          <span class="skill-bar-content" style="color: #5dc269">
            ${post.title.rendered}
          </span>
          <span class="skill-bar-percent" style="color: #5dc269">
            ${percentage}%
          </span>
          <div class="greennature-skill-bar greennature-ux" style="background-color: #e9e9e9">
            <div 
              class="greennature-skill-bar-progress" 
              data-percent="${percentage}"
              style="
                width: ${percentage}%; 
                background-color: ${getBackgroundColor(percentage)}
              "
            ></div>
          </div>
        </div>`;
    });
  } else {
    console.log("No posts found in the specified subcategory");
  }
});

//achievements section
getPostsBySubcategory("initiatives", "achievements").then((posts) => {
  const achievementsTitle = document.getElementById("achievements-title");
  const achievementsCaption = document.getElementById("achievements-caption");
  const achievementsDescription = document.getElementById(
    "achievements-description"
  );
  if (posts.length > 0) {
    achievementsTitle.innerHTML = posts[0].title.rendered;
    achievementsCaption.innerHTML = posts[0].excerpt.rendered;
    achievementsDescription.innerHTML = posts[0].content.rendered;
  } else {
    console.log("No posts found in the specified subcategory");
  }
});
