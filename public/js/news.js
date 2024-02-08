let News = {};
News.skip = 0;

/* window.ready */
$(document).ready(function () {
  News.skip = $("#news-more").data("skip");
  News.bindFunctions();
});

News.bindFunctions = function () {
  News.loadMore();
};

News.loadMore = function () {
  $("#news-more").on("click", function () {

    const filters = $("#news-more").data("filters");
    const ids = $("#news-more").data("ids");
    const idsToSkipSend = ids.split(",");
    const deleteEmptyPosition = idsToSkipSend.pop();

    const formData = new FormData();
    formData.append("filters", filters);
    formData.append("skip", News.skip);
    formData.append("idsToSkip", idsToSkipSend);

    NavBar.showLoading();

    $.ajax({
      type: "POST",
      url: "/newsletter",
      data: formData,
      processData: false, // tell jQuery not to process the data
      contentType: false, // tell jQuery not to set contentType
      success: function (res) {
        const news = res.news;
        const more = res.moreNews;
        const idsToSkip = res.idsToSkipClient;
        const newsContainer = $(".newsletter-card--container");
        news.forEach((post) => {
          newsContainer.append(`
          <div class="newsletter-card">
          <img src="${post.principal_img}" alt="Imagen de novedad" />
          <p class="newsletter-card--title">${post.title}</p>
          <div class="newsletter-card--content">
            <small>${post.description}</small>
          </div>

          <div class="newsletter-card--more">
            <a href="/newsletter/${post.id}">Leer más</a>
          </div>
        </div>
          `);
        });

        const totalPropsInPage = $(
          ".newsletter-card--container > .newsletter-card"
        ).length;

        if (more) {
          // console.log("hay mas para traer");
        } else {
          // console.log("NO hay mas para traer");
          $("#news-more").hide();
        }

        $("#news-more").attr("data-skip", totalPropsInPage);
        $("#news-more").attr("data-ids", idsToSkip);
        News.skip = totalPropsInPage;
        NavBar.hiddenLoading();
        // console.log(Properties.skip);
      },
      error: function (err) {
        NavBar.hiddenLoading();
        const { msg } = err.responseJSON;
        alert(msg);
      },
    });
  });
};
