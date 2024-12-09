async function getPostsBySubcategory(parentSlug, subcategorySlug) {
  try {
    const parentResponse = await fetch(
      `http://localhost/climateOrg/wp-json/wp/v2/categories?slug=${parentSlug}`
    );
    const parentCategory = await parentResponse.json();

    if (parentCategory.length > 0) {
      const parentId = parentCategory[0].id;

      const subcategoryResponse = await fetch(
        `http://localhost/climateOrg/wp-json/wp/v2/categories?slug=${subcategorySlug}&parent=${parentId}`
      );
      const subcategories = await subcategoryResponse.json();

      if (subcategories.length > 0) {
        const subcategoryId = subcategories[0].id;

        const postsResponse = await fetch(
          `http://localhost/climateOrg/wp-json/wp/v2/posts?categories=${subcategoryId}&_embed`
        );
        const posts = await postsResponse.json();

        // Fetch tag details for each post
        for (const post of posts) {
          if (post.tags && post.tags.length > 0) {
            const tagIds = post.tags.join(",");
            const tagsResponse = await fetch(
              `http://localhost/climateOrg/wp-json/wp/v2/tags?include=${tagIds}`
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
getPostsBySubcategory("gallery", "images-gallery").then((posts) => {
  const contentWrapper = document.getElementById("content-gallery");

  if (posts.length > 0) {
    posts.reverse();
    posts.forEach((post) => {
      contentWrapper.innerHTML += `<div class="gallery-column three columns">
                    <div class="gallery-item">
                      <a
                        href="upload/shutterstock_49617541.jpg"
                        data-fancybox-group="greennature-gal-1"
                        data-rel="fancybox"
                        ><img
                          src=${post._embedded["wp:featuredmedia"][0].source_url}
                          alt=""
                          width="400"
                          height="300" /></a
                      ><span class="gallery-caption">${post.title.rendered}</span>
                    </div>
                  </div>
      `;
    });
  } else {
    console.log("No posts found in the specified subcategory");
  }
});
