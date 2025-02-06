import { mapDate } from "./trim.js";
import { ENV_URL } from "./config.js";
// Get the post ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

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

// Fetch the specific post data using the WordPress API
const fetchPosts = async () => {
  try {
    const result = await fetch(
      `${BASE_URL}/wp-json/wp/v2/posts/${postId}?_embed`
    );
    if (!result.ok) {
      throw new Error(`HTTP error! status: ${result.status}`);
    }
    return await result.json();
  } catch (error) {
    console.error("Error fetching post:", error);
  }
};

fetchPosts().then((post) => {
  if (post) {
    const wrapper = document.getElementById("singlePostContent");
    const dateX = post.date;

    mapDate(dateX).then(
      function (value) {
        const dayOfPost = value.getToday;
        const yearOfPost = value.getThatYear;
        const monthOfPost = value.getMonth;

        wrapper.innerHTML = `<div class="twelve columns">
                              <div
                                class="greennature-item greennature-blog-grid greennature-skin-box"
                              >
                                <div
                                  class="greennature-ux greennature-blog-grid-ux"
                                >
                                  <article
                                    id="post-852"
                                    class="post-852 post type-post status-publish format-standard has-post-thumbnail hentry category-fit-row tag-blog tag-life-style"
                                  >
                                    <div class="greennature-standard-style">
                                     <div class="greennature-blog-thumbnail" id="imageFit">                                       
                                      <img src="${post._embedded["wp:featuredmedia"][0].source_url}" alt="Post Thumbnail" id="responsive-image" />
                                      </div>

                                      <div
                                        class="greennature-blog-grid-content"
                                      >
                                        <header class="post-header">
                                          <h3 class="greennature-blog-title">
                                            ${post.title.rendered}
                                          </h3>

                                          <div class="greennature-blog-info">
                                            <div
                                              class="blog-info blog-date greennature-skin-info"
                                            >
                                              <i class="fa fa-clock-o"></i
                                              ><a
                                                 
                                                >${dayOfPost}&nbsp;${monthOfPost}&nbsp;${yearOfPost}</a
                                              >
                                            </div>
                                           
                                            <div class="clear"></div>
                                          </div>
                                          <div class="clear"></div>
                                        </header>
                                        <!-- entry-header -->

                                        <div class="greennature-blog-content">
                                        ${post.content.rendered}
                                          <div class="clear"></div>
                                          <a
                                            href="../2013/12/11/donec-luctus-imperdiet/index.html"
                                            class="excerpt-read-more"
                                            >Read More</a
                                          >
                                        </div>
                                      </div>
                                    </div>
                                  </article>
                                  <!-- #post -->
                                </div>
                              </div>
                            </div>`;
      },
      function (error) {
        console.error("Error formatting date:", error);
      }
    );
  }
});

// Recent works section
getPostsBySubcategory("events", "content-events").then((posts) => {
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
