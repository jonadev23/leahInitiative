const postDetails = document.getElementById("postDetails");

// Get the post ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

// Fetch the specific post data using the WordPress API
fetch(`http://localhost/climateOrg/wp-json/wp/v2/posts/${postId}?_embed`)
  .then((response) => response.json())
  .then((post) => {
    console.log(post);
    postDetails.innerHTML = `
      <h1>${post.title.rendered}</h1>
      <img src="${post._embedded["wp:featuredmedia"][0].source_url}" alt="" />
      <div>${post.content.rendered}</div>`;
  })
  .catch((error) => console.error("Error fetching post details:", error));
