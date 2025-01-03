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

//   banner section
getPostsBySubcategory("about", "banner").then((posts) => {
  if (posts.length > 0) {
    const bannerSection = document.getElementById("content-section-1");
    bannerSection.innerHTML += `<div
                class="greennature-parallax-wrapper  greennature-background-image gdlr-show-all greennature-skin-dark-skin"
                id="greennature-parallax-wrapper-1"
                data-bgspeed="0"
                style="
                  background-image: url(${posts[0]._embedded["wp:featuredmedia"][0].source_url});
                  padding-top: 260px;
                  padding-bottom: 140px;
                "
              >
                <div style="position: relative;z-index:1 ;" class="container">
                  <div class="greennature-title-item">
                    <div
                      class="greennature-item-title-wrapper greennature-item greennature-center greennature-extra-large"
                    >
                      <div class="greennature-item-title-container container">
                        <div class="greennature-item-title-head">
                          <h3
                            class="greennature-item-title greennature-skin-title greennature-skin-border"
                          >
                            ${posts[0].title.rendered}
                          </h3>
                          <div
                            class="greennature-item-title-caption greennature-skin-info"
                          >
                            ${posts[0].content.rendered}
                          </div>
                          <div class="clear"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="clear"></div>
                  <div class="clear"></div>
                </div>
              </div>`;
  } else {
    console.error("No posts found in the specified subcategory");
  }
});

//   story section
getPostsBySubcategory("about", "story").then((posts) => {
  if (posts.length > 0) {
    const bannerSection = document.getElementById("content-section-2");
    bannerSection.innerHTML += ` <div
                class="greennature-color-wrapper gdlr-show-all no-skin greennature-half-bg-wrapper"
                style="background-color: #ffffff"
              >
                <div
                  class="greennature-half-bg greennature-bg-solid"
                  style="
                    background-image: url(${posts[0]._embedded["wp:featuredmedia"][0].source_url});
                    filter: brightness(0.8);
                  "
                ></div>
                <div class="container">
                  <div class="six columns"></div>
                  <div class="six columns">
                    <div
                      class="greennature-item greennature-about-us-item greennature-normal"
                    >
                      <div class="about-us-title-wrapper">
                        <h3 class="about-us-title">
                          ${posts[0].title.rendered}
                        </h3>
                        <div
                          class="about-us-caption greennature-title-font greennature-skin-info"
                        >
                          ${posts[0].excerpt.rendered}
                        </div>
                        <div class="about-us-title-divider"></div>
                      </div>
                      <div class="about-us-content-wrapper">
                        <div class="about-us-content greennature-skin-content">
                          ${posts[0].content.rendered}
                        </div>
                        <a
                          class="about-us-read-more greennature-button"
                          href="#"
                          >Read More</a
                        >
                      </div>
                      <div class="clear"></div>
                    </div>
                  </div>
                  <div class="clear"></div>
                </div>
              </div>`;
  } else {
    console.error("No posts found in the specified subcategory");
  }
});

//   objectives section
getPostsBySubcategory("about", "objectives").then((posts) => {
  if (posts.length > 0) {
    const objectivesSection = document.getElementById("objectives-section");
    posts.reverse()
    posts.forEach((post) => {
      objectivesSection.innerHTML += `<div class="four columns">
                    <div class="greennature-ux column-service-ux">
                      <div
                        class="greennature-item greennature-column-service-item greennature-type-1-caption"
                      >
                        <div class="column-service-image">
                          <img
                            src="${post._embedded["wp:featuredmedia"][0].source_url}"
                            alt=""
                            width="80"
                            height="80"
                          />
                        </div>
                        <div class="column-service-content-wrapper">
                          <h3 class="column-service-title">
                            ${post.title.rendered}
                          </h3>
                          <div
                            class="column-service-caption greennature-skin-info"
                          >
                            ${post.excerpt.rendered}
                          </div>
                          <div
                            class="column-service-content greennature-skin-content"
                          >
                            ${post.content.rendered}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>`;
    });
  } else {
    console.error("No posts found in the specified subcategory");
  }
});

//   team section
getPostsBySubcategory("about", "team").then((posts) => {
  const teamSection = document.getElementById("team-section");
  console.log(posts);
  if (posts.length > 0) {
    posts.reverse();
    posts.forEach((post) => {
      teamSection.innerHTML += ` <div class="four columns">
                      <div
                        class="greennature-item greennature-personnel-item greennature-left plain-style"
                      >
                        <div class="greennature-ux greennature-personnel-ux">
                          <div class="personnel-item">
                            <div
                              class="personnel-author-image greennature-skin-border"
                            >
                              <img
                                src="${post._embedded["wp:featuredmedia"][0].source_url}"
                                alt=""
                                width="500"
                                height="297"
                              />
                            </div>
                            <div class="personnel-info">
                              <div
                                class="personnel-author greennature-skin-title"
                              >
                                ${post.title.rendered}
                              </div>
                              <div
                                class="personnel-position greennature-skin-info"
                              >
                                ${post.excerpt.rendered}
                              </div>
                            </div>
                            <div
                              class="personnel-content greennature-skin-content"
                            >
                              ${post.content.rendered}
                            </div>
                            <div class="personnel-social">
                              <a href="http://facebook.com/" target="_self"
                                ><i
                                  class="greennature-icon fa fa-facebook"
                                  style="
                                    vertical-align: middle;
                                    color: #999999;
                                    font-size: 19px;
                                  "
                                ></i
                              ></a>
                              <a href="http://twitter.com/" target="_self"
                                ><i
                                  class="greennature-icon fa fa-twitter"
                                  style="
                                    vertical-align: middle;
                                    color: #999999;
                                    font-size: 19px;
                                  "
                                ></i
                              ></a>
                              <a href="http://linkedin.com/" target="_self"
                                ><i
                                  class="greennature-icon fa fa-linkedin"
                                  style="
                                    vertical-align: middle;
                                    color: #999999;
                                    font-size: 19px;
                                  "
                                ></i
                              ></a>
                              <a href="http://vimeo.com/" target="_self"
                                ><i
                                  class="greennature-icon fa fa-vimeo"
                                  style="
                                    vertical-align: middle;
                                    color: #999999;
                                    font-size: 19px;
                                  "
                                ></i
                              ></a>
                              <a href="http://pinterest.com/" target="_self"
                                ><i
                                  class="greennature-icon fa fa-pinterest"
                                  style="
                                    vertical-align: middle;
                                    color: #999999;
                                    font-size: 19px;
                                  "
                                ></i
                              ></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>`;
    });
  } else {
    console.error("No posts found in the specified subcategory");
  }
});

//   action section
getPostsBySubcategory("about", "action-about").then((posts) => {
  if (posts.length > 0) {
    const actionSection = document.getElementById("content-section-5");
    actionSection.innerHTML += `<div
                class="greennature-parallax-wrapper greennature-background-image gdlr-show-all greennature-skin-dark-skin"
                id="greennature-parallax-wrapper-2"
                data-bgspeed="0.1"
                style="
                  background-image: url(${posts[0]._embedded["wp:featuredmedia"][0].source_url});
                  padding-top: 125px;
                  padding-bottom: 90px;
                "
              >
                <div style="position: relative;z-index:1 ;" class="container">
                  <div class="greennature-stunning-item-ux greennature-ux">
                    <div
                      class="greennature-item greennature-stunning-item greennature-stunning-center"
                    >
                      <h2 class="stunning-item-title">
                        ${posts[0].content.rendered}
                      </h2>
                      <div
                        class="stunning-item-caption greennature-skin-content"
                      >
                        <p>
                          ${posts[0].excerpt.rendered}
                        </p>
                      </div>
                      <a
                        class="stunning-item-button greennature-button large greennature-lb-payment"
                        href="#"
                        style="background-color: #fec428; color: #ffffff"
                        >Donate Now!</a
                      ><a
                        class="stunning-item-button greennature-button large"
                        href="#"
                        >Act Now!</a
                      >
                    </div>
                  </div>
                  <div class="clear"></div>
                  <div class="clear"></div>
                </div>
              </div>`;
  } else {
    console.error("No posts found in the specified subcategory");
  }
});

//statistics section
getPostsBySubcategory("homepage", "statistics").then((posts) => {
  const maincontainer = document.getElementById("statistics-section");
  // console.log(sliderOne);
  if (posts.length > 0) {
    const otherPosts = posts.filter(
      (post) => post.title.rendered !== "Background"
    );

    otherPosts.reverse();
    otherPosts.forEach((post) => {
      maincontainer.innerHTML += `<div class="three columns">
                      <div
                        class="greennature-skill-item-wrapper greennature-skin-content greennature-item greennature-style-2"
                        style="margin-bottom: 70px"
                      >
                        <img
                          src=${post._embedded["wp:featuredmedia"][0].source_url}
                          alt=""
                          width="80"
                          height="80"
                        />
                        <div
                          class="greennature-skill-item-title"
                          style="color: #5dc269"
                        >
                          ${post.content.rendered}
                        </div>
                        <div
                          class="greennature-skill-item-caption"
                          style="color: #ffffff"
                        >
                          ${post.title.rendered}
                        </div>
                      </div>
                    </div>`;
    });
  } else {
    console.log("No posts found in the specified subcategory");
  }
});
