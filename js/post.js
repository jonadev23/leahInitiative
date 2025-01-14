import { mapDate } from "./trim.js";

// Get the post ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

// Fetch the specific post data using the WordPress API
const fetchPosts = async () => {
  try {
    const result = await fetch(
      `http://localhost/climateOrg/wp-json/wp/v2/posts/${postId}?_embed`
    );
    if (!result.ok) {
      console.log("Error while fetching");
    } else {
      return result.json();
    }
  } catch (error) {
    console.log(error);
  }
};

fetchPosts().then((post) => {
  const wrapper = document.getElementById("singlePostContent");
  const dateX = post.date;
  console.log(dateX);

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
  <img
    src="${post._embedded["wp:featuredmedia"][0].source_url}"
    alt="Post Thumbnail"
    id="responsive-image"
  />
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
                            </div>`;
    },
    function (error) {
      return error;
    }
  );
  console.log(post);
});
// fetch(`http://localhost/climateOrg/wp-json/wp/v2/posts/${postId}?_embed`)
//   .then((response) => response.json())
//   .then((post) => {
//     console.log(post);
//     postDetails.innerHTML = `
//       <h1>${post.title.rendered}</h1>
//       <img src="${post._embedded["wp:featuredmedia"][0].source_url}" alt="" />
//       <div>${post.content.rendered}</div>`;
//   })
//   .catch((error) => console.error("Error fetching post details:", error));
