import { ENV_URL } from "./config.js";
import { mapDate, cleanString } from "./trim.js";
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

//favicon section
getPostsBySubcategory("general-content", "logo").then((posts) => {
  const contentWrapper = document.getElementById("favicon");

  if (posts.length > 0) {
    contentWrapper.href = `${posts[0]._embedded["wp:featuredmedia"][0].source_url}`;
  } else {
    console.log("No posts found in the specified subcategory");
  }
});
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
  const footerContent = document.getElementById("footer-content");
  if (posts.length > 0) {
    contentWrapper.innerHTML = ` <img
                    src=${posts[0]._embedded["wp:featuredmedia"][0].source_url}
                    style="width: 170px"
                    alt=""
                  />
      `;
    footerContent.innerHTML = `<div>${posts[0].content.rendered}`;
  } else {
    console.log("No posts found in the specified subcategory");
  }
});

//contact-footer section
getPostsBySubcategory("general-content", "contact-general-content").then(
  (posts) => {
    const contentWrapper = document.getElementById("contact-footer");

    if (posts.length > 0) {
      contentWrapper.innerHTML = `<div>${posts[0].content.rendered}</div>`;
    } else {
      console.log("No posts found in the specified subcategory");
    }
  }
);

//address section
getPostsBySubcategory("general-content", "address").then((posts) => {
  const contentWrapper = document.getElementById("address");

  if (posts.length > 0) {
    contentWrapper.innerHTML = `<div>${posts[0].content.rendered}</div>`;
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

//email section
getPostsBySubcategory("general-content", "email").then((posts) => {
  const contentWrapper = document.getElementById("email");

  if (posts.length > 0) {
    contentWrapper.innerHTML = `<span>${posts[0].content.rendered}</span>`;
  } else {
    console.log("No posts found in the specified subcategory");
  }
});

//email section
getPostsBySubcategory("general-content", "email").then((posts) => {
  const contentWrapper = document.getElementById("email-footer");

  if (posts.length > 0) {
    contentWrapper.innerHTML = `<span>${posts[0].content.rendered}</span>`;
  } else {
    console.log("No posts found in the specified subcategory");
  }
});

//linked-in section
getPostsBySubcategory("general-content", "linkedin").then((posts) => {
  const contentWrapper = document.getElementById("linkedIn");
  const contentWrapperF = document.getElementById("linkedInFooter");
  if (posts.length > 0) {
    const content = cleanString(posts[0].content.rendered);
    contentWrapper.href = content;
    contentWrapperF.href = content;
  } else {
    console.log("No posts found in the specified subcategory");
  }
});

//facebook section
getPostsBySubcategory("general-content", "facebook").then((posts) => {
  const contentWrapper = document.getElementById("faceBook");
  const contentWrapperF = document.getElementById("facebookFooter");
  if (posts.length > 0) {
    const content = cleanString(posts[0].content.rendered);
    contentWrapper.href = content;
    contentWrapperF.href = content;
  } else {
    console.log("No posts found in the specified subcategory");
  }
});

//twitter section
getPostsBySubcategory("general-content", "twitter").then((posts) => {
  const contentWrapper = document.getElementById("twitter");
  const contentWrapperF = document.getElementById("twitterFooter");
  if (posts.length > 0) {
    const content = cleanString(posts[0].content.rendered);
    contentWrapper.href = content;
    contentWrapperF.href = content;
  } else {
    console.log("No posts found in the specified subcategory");
  }
});

//youtube section
getPostsBySubcategory("general-content", "youtube").then((posts) => {
  const contentWrapper = document.getElementById("youtube");
  const contentWrapperF = document.getElementById("youtubeFooter");
  if (posts.length > 0) {
    const content = cleanString(posts[0].content.rendered);
    contentWrapper.href = content;
    contentWrapperF.href = content;
  } else {
    console.log("No posts found in the specified subcategory");
  }
});

//instagram section
getPostsBySubcategory("general-content", "instagram").then((posts) => {
  const contentWrapper = document.getElementById("instagram");
  const contentWrapperF = document.getElementById("instagramFooter");
  if (posts.length > 0) {
    const content = cleanString(posts[0].content.rendered);
    contentWrapper.href = content;
    contentWrapperF.href = content;
  } else {
    console.log("No posts found in the specified subcategory");
  }
});

//recent news section
getPostsBySubcategory("blogs", "content").then((posts) => {
  const projectSection = document.getElementById("recent-footer");
  if (posts.length > 0) {
    const filteredPost = posts.splice(0, 2);

    filteredPost.forEach((post) => {
      const dateX = post.date;

      mapDate(dateX).then(
        function (value) {
          const dayOfPost = value.getToday;
          const yearOfPost = value.getThatYear;
          const monthOfPost = value.getMonth;
          projectSection.innerHTML += `<div class="recent-post-widget">
                  <div class="recent-post-widget-thumbnail">
                    <a href="#"
                      ><img
                        src=${post._embedded["wp:featuredmedia"][0].source_url}
                        alt=""
                        width="150"
                        height="150"
                    /></a>
                  </div>
                  <div class="recent-post-widget-content">
                    <div class="recent-post-widget-title">
                      <a href="#">${post.title.rendered}</a>
                    </div>
                    <div class="recent-post-widget-info">
                      <div class="blog-info blog-date greennature-skin-info">
                        <i class="fa fa-clock-o"></i><a href="#">${dayOfPost}&nbsp;${monthOfPost}&nbsp;${yearOfPost}</a>
                      </div>
                      <div class="clear"></div>
                    </div>
                  </div>
                  <div class="clear"></div>
                </div>`;
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

// recent works
getPostsBySubcategory("projects-2", "content-projects-2").then((posts) => {
  const projectSection = document.getElementById("recent-works");
  if (posts.length > 0) {
    const filteredPost = posts.splice(0, 6);

    filteredPost.forEach((post) => {
      projectSection.innerHTML += `<div class="recent-port-widget-thumbnail">
                  <a href="#"
                    >
                    <div>
                    <img
                      src=${post._embedded["wp:featuredmedia"][0].source_url}
                      alt=""
                      width="150"
                      height="150"
                  />
                  </div>
                  </a>
                </div>`;
    });
  } else {
    console.log("No posts found in the specified subcategory");
  }
});
