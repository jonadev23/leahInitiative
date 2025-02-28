import { ENV_URL } from "./config.js";
import { mapDate } from "./trim.js";
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
      contentWrapper.innerHTML += `<div  class="twelve columns card">
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
                                      <div id="blog" class="greennature-blog-thumbnail">
                                        <a
                                          href="../2013/12/11/donec-luctus-imperdiet/index.html"
                                        >
                                          <img
                                            src=${post._embedded["wp:featuredmedia"][0].source_url}
                                            alt=""
                                            width="960"
                                            height="638"
                                        /></a>
                                      </div>

                                      <div
                                        class="greennature-blog-grid-content"
                                      >
                                        <header class="post-header">
                                          <h3 class="greennature-blog-title">
                                            <a
                                              href="../2013/12/11/donec-luctus-imperdiet/index.html"
                                              >${post.title.rendered}</a
                                            >
                                          </h3>

                                          <div class="greennature-blog-info">
                                            <div
                                              class="blog-info blog-date greennature-skin-info"
                                            >
                                              <i class="fa fa-clock-o"></i
                                              ><a
                                                href="../2013/12/11/index.html"
                                                >${dayOfPost}&nbsp;${monthOfPost}&nbsp;${yearOfPost}</a
                                              >
                                            </div>
                                            <div
                                              class="blog-info blog-comment greennature-skin-info"
                                            >
                                              <i class="fa fa-comment-o"></i
                                              ><a
                                                href="../2013/12/11/donec-luctus-imperdiet/index.html#respond"
                                                >2
                                                <span class="greennature-tail"
                                                  >Comments</span
                                                ></a
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
                            </div>
                            <div class="clear"></div>`;
                          },
                          function (error) {
                            return error;
                          }
                        );
                      });
  } else {
    console.log("No posts found in the specified subcategory");
  }
});
