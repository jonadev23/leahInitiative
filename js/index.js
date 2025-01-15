import { ENV_URL } from "./config.js";
import { trimString, mapDate } from "./trim.js";

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

getPostsBySubcategory("homepage", "slider").then((posts) => {
  const sliderOne = document.getElementById("slider-1");
  const sliderOneText = document.getElementById("slider_1_text_1");
  const sliderOneText2 = document.getElementById("slider_1_text_2");
  const sliderTwo = document.getElementById("slider-2");
  const sliderTwoText = document.getElementById("slider_2_text_1");
  const sliderTwoText2 = document.getElementById("slider_2_text_2");
  const sliderThree = document.getElementById("slider-3");
  // console.log(sliderOne);
  if (posts.length > 0) {
    posts.reverse();
    // set the background image of the slider to the first post's featured media
    sliderOne.style.backgroundImage = `url(${posts[0]._embedded["wp:featuredmedia"][0].source_url})`;
    sliderOne.style.backgroundSize = "cover";
    sliderOne.style.backgroundPosition = "center";
    sliderOneText.innerHTML = posts[0].title.rendered;
    sliderOneText2.innerHTML = posts[0].content.rendered;
    //second
    sliderTwo.style.backgroundImage = `url(${posts[1]._embedded["wp:featuredmedia"][0].source_url})`;
    sliderTwo.style.backgroundSize = "cover";
    sliderTwo.style.backgroundPosition = "center";
    sliderTwoText.innerHTML = posts[1].title.rendered;

    sliderTwoText2.innerHTML = posts[1].content.rendered;
    //third
    sliderThree.style.backgroundImage = `url(${posts[2]._embedded["wp:featuredmedia"][0].source_url})`;
    sliderThree.style.backgroundSize = "cover";
    sliderThree.style.backgroundPosition = "center";
  } else {
    console.log("No posts found in the specified subcategory");
  }
});

//statement section
getPostsBySubcategory("homepage", "statements").then((posts) => {
  const statementSection = document.getElementById("statement-section");
  // console.log(sliderOne);
  if (posts.length > 0) {
    posts.reverse();
    posts.forEach((post) => {
      statementSection.innerHTML += `<div class="four columns">
                    <div class="greennature-ux column-service-ux">
                      <div
                        class="greennature-item greennature-column-service-item greennature-type-2"
                        style="margin-bottom: 0px"
                      >
                        <div class="column-service-image">
                          <img
                            src=${post._embedded["wp:featuredmedia"][0].source_url}
                            alt=""
                            width="80"
                            height="80"
                          />
                        </div>
                        <div class="column-service-content-wrapper">
                          <h3 class="column-service-title">${post.title.rendered}</h3>
                          <div
                            class="column-service-content greennature-skin-content"
                          >
                          ${post.content.rendered}
                          </div>
                          <a class="column-service-read-more" href="#"
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

//donation section
getPostsBySubcategory("homepage", "action").then((posts) => {
  const wrapper = document.getElementById("greennature-parallax-wrapper-1");
  const donation = document.getElementById("donation");
  const donationTitle = document.getElementById("donation-title");
  const donationCaption = document.getElementById("donation-caption");
  const donationContent = document.getElementById("donation-content");
  const action = document.getElementById("action");
  const actionTitle = document.getElementById("action-title");
  const actionCaption = document.getElementById("action-caption");
  const actionContent = document.getElementById("action-content");

  if (posts.length > 0) {
    posts.reverse();
    // set the background image of the slider to the first post's featured media
    wrapper.style.backgroundImage = `url(${posts[0]._embedded["wp:featuredmedia"][0].source_url})`;
    wrapper.style.backgroundSize = "cover";
    wrapper.style.backgroundPosition = "center";

    //second
    donation.style.backgroundImage = `url(${posts[1]._embedded["wp:featuredmedia"][0].source_url})`;
    donation.style.backgroundSize = "cover";
    donation.style.backgroundPosition = "center";
    donationTitle.innerHTML = posts[1].title.rendered;
    donationCaption.innerHTML = posts[1].excerpt.rendered;
    donationContent.innerHTML = posts[1].content.rendered;

    //third
    action.style.backgroundImage = `url(${posts[2]._embedded["wp:featuredmedia"][0].source_url})`;
    action.style.backgroundSize = "cover";
    action.style.backgroundPosition = "center";
    actionTitle.innerHTML = posts[2].title.rendered;
    actionCaption.innerHTML = posts[2].excerpt.rendered;
    actionContent.innerHTML = posts[2].content.rendered;
  } else {
    console.log("No posts found in the specified subcategory");
  }
});

//project section
getPostsBySubcategory("homepage", "projects").then((posts) => {
  const projectSection = document.getElementById("project-section");
  if (posts.length > 0) {
    posts.reverse();

    posts.forEach((post) => {
      const content = trimString(post.content.rendered);
      projectSection.innerHTML += `<div class="three columns">
                          <div
                            class="greennature-item greennature-portfolio-item greennature-classic-portfolio"
                          >
                            <div
                              class="greennature-ux greennature-classic-portfolio-ux"
                            >
                              <div
                                class="portfolio-thumbnail greennature-image"
                                style = "width:100%;max-height:300px; position:relative"
                              >
                               <div style="position: absolute; inset: 0; background-color: black;opacity: 0.1;"></div>
                                <img
                                id="hover-image"
                                  src=${
                                    post._embedded["wp:featuredmedia"][0]
                                      .source_url
                                  }
                                  alt=""
                                  width="540"
                                  height="326"
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
                                  <a href="single-post.html?id=${post.id}">${
        post.title.rendered
      }</a>
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
                                  <a href="#" class="excerpt-read-more"
                                    >Read More</a
                                  >
                                </div>
                                <a class="portfolio-classic-learn-more" href="#"
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

//project section end
getPostsBySubcategory("homepage", "donatequeries").then((posts) => {
  // console.log(sliderOne);
  const donateBg = document.getElementById("donate-background");
  const donateContent = document.getElementById("donate-content");

  const background = posts.filter(
    (post) => post.title.rendered === "Background"
  );

  donateBg.style.backgroundImage = `url(${background[0]._embedded["wp:featuredmedia"][0].source_url})`;
  donateBg.style.backgroundSize = "cover";
  donateBg.style.backgroundPosition = "center";

  const otherPosts = posts.filter(
    (post) => post.title.rendered !== "Background"
  );
  if (otherPosts.length > 0) {
    otherPosts.reverse();
    otherPosts.forEach((post) => {
      donateContent.innerHTML += `<div class="list-with-icon-ux greennature-ux">
                        <div class="list-with-icon greennature-left">
                          <div class="list-with-icon-image">
                            <img
                               src=${post._embedded["wp:featuredmedia"][0].source_url}
                              alt=""
                              width="80"
                              height="80"
                            />
                          </div>
                          <div class="list-with-icon-content">
                            <div
                              class="list-with-icon-title greennature-skin-title"
                            >
                              ${post.title.rendered}
                            </div>
                            <div class="list-with-icon-caption">
                              ${post.content.rendered}
                            </div>
                          </div>
                          <div class="clear"></div>
                        </div>
                      </div>`;
    });
  } else {
    console.log("No posts found in the specified subcategory");
  }
});

//video section
getPostsBySubcategory("homepage", "video").then((posts) => {
  const videoHome = document.getElementById("videoHome");

  if (posts.length > 0) {
    // console.log(posts);
    videoHome.innerHTML = `<div>${posts[0].content.rendered}</div>`;
  } else {
    console.log("No posts found in the specified subcategory");
  }
});

//testimonial section
getPostsBySubcategory("homepage", "testimonial").then((posts) => {
  const testimonialSection = document.getElementById("testimonial-section");

  if (posts.length > 0) {
    posts.reverse();
    // Create ul element first
    testimonialSection.innerHTML = '<ul class="slides">';

    posts.forEach((post) => {
      testimonialSection.innerHTML += `<li class="testimonial-item">
                                <div class="testimonial-content-wrapper">
                                  <div
                                    class="testimonial-content greennature-skin-content"
                                  >
                                    ${post.content.rendered}
                                  </div>
                                  <div class="testimonial-info">
                                    <div
                                      class="testimonial-author-image greennature-skin-border"
                                    >
                                      <img
                                          src=${post._embedded["wp:featuredmedia"][0].source_url}
                                          alt=""
                                        width="150"
                                        height="150"
                                      />
                                    </div>
                                    <span
                                      class="testimonial-author greennature-skin-link-color"
                                      >${post.title.rendered}<span>, </span></span
                                    ><span
                                      class="testimonial-position greennature-skin-info"
                                      >${post.excerpt.rendered}</span
                                    >
                                  </div>
                                </div>
                              </li>`;
    });

    // Close the ul element
    testimonialSection.innerHTML += "</ul>";
  } else {
    console.log("No posts found in the specified subcategory");
  }
});

//newsletter section
getPostsBySubcategory("homepage", "newsletter").then((posts) => {
  const statementSection = document.getElementById("statement-section");
  // console.log(sliderOne);
  const wrapper = document.getElementById("greennature-parallax-wrapper-2");
  if (posts.length > 0) {
    wrapper.style.backgroundImage = `url(${posts[0]._embedded["wp:featuredmedia"][0].source_url})`;
    wrapper.style.backgroundSize = "cover";
    wrapper.style.backgroundPosition = "center";
  } else {
    console.log("No posts found in the specified subcategory");
  }
});

//statistics section
getPostsBySubcategory("homepage", "statistics").then((posts) => {
  const statisticsSection = document.getElementById(
    "greennature-parallax-wrapper-3"
  );
  const maincontainer = document.getElementById("statistics-section");
  // console.log(sliderOne);
  if (posts.length > 0) {
    const background = posts.filter(
      (post) => post.title.rendered === "Background"
    );
    statisticsSection.style.backgroundImage = `url(${background[0]._embedded["wp:featuredmedia"][0].source_url})`;

    document.getElementById("stunning-item-title").innerHTML =
      background[0].content.rendered;
    document.getElementById("stunning-item-caption").innerHTML =
      background[0].excerpt.rendered;

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
                        id="statistics-text"
                        
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

//recent news section
getPostsBySubcategory("blogs", "content").then((posts) => {
  const projectSection = document.getElementById("recent-news");
  if (posts.length > 0) {
    const filteredPost = posts.splice(0, 3);

    filteredPost.forEach((post) => {
      const dateX = post.date;

      mapDate(dateX).then(
        function (value) {
          const dayOfPost = value.getToday;
          const yearOfPost = value.getThatYear;
          const monthOfPost = value.getMonth;
          projectSection.innerHTML += `<div class="twelve columns">
                          <div class="greennature-item greennature-blog-widget">
                            <div
                              class="greennature-ux greennature-blog-widget-ux"
                            >
                              <article
                                id="post-852"
                                class="post-852 post type-post status-publish format-standard has-post-thumbnail hentry category-fit-row tag-blog tag-life-style"
                              >
                                <div class="greennature-standard-style">
                                  <div class="greennature-blog-thumbnail">
                                    <a href="#">
                                      <img
                                        src=${post._embedded["wp:featuredmedia"][0].source_url}
                                        alt=""
                                        width="400"
                                        height="400"
                                    /></a>
                                  </div>

                                  <div class="greennature-blog-date-wrapper">
                                    <div  class="greennature-blog-day">${dayOfPost}</div>
                                    <div  class="greennature-blog-month">
                                      ${monthOfPost}
                                    </div>
                                    <div  class="greennature-blog-month">
                                      ${yearOfPost}
                                    </div>
                                  </div>

                                  <header class="post-header">
                                    <h3 class="greennature-blog-title">
                                      <a href="#">${post.title.rendered}</a>
                                    </h3>

                                    <div class="greennature-blog-info">
                                      <div
                                        class="blog-info blog-comment greennature-skin-info"
                                      >
                                        <i class="fa fa-comment-o"></i
                                        ><a href="##respond"
                                          >2
                                          <span class="greennature-tail"
                                            >Comments</span
                                          ></a
                                        >
                                      </div>
                                      <div
                                        class="blog-info blog-author greennature-skin-info"
                                      >
                                        <i class="fa fa-pencil"></i
                                        ><a
                                          href="#"
                                          title="Posts by John Maxwell"
                                          rel="author"
                                          >John Maxwell</a
                                        >
                                      </div>
                                      <div class="clear"></div>
                                    </div>
                                    <div class="clear"></div>
                                  </header>
                                  <!-- entry-header -->
                                  <div class="clear"></div>
                                </div>
                              </article>
                              <!-- #post -->
                            </div>
                          </div>
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
