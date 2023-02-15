// .video
function initVideo() {
  if (document.querySelector(".video")) {
    let html = document.querySelector("html");
    let video = document.querySelector(".video");
    let videoHref = video.getAttribute("data-video");
    let sec3PictureButton = document.querySelector(".sec-3__picture__button");
    let deleteLenght = "https://youtu.be/".length;
    let videoSrc = videoHref.substring(deleteLenght, videoHref.length);

    function generateUrl(id) {
      let query = "?enablejsapi=1&version=3&playerapiid=ytplayer";
      return "https://www.youtube-nocookie.com/embed/" + id + query;
    };

    function createIframe(id) {
      if (!document.getElementById(videoHref)) {
        let iframe = document.createElement("iframe");
        iframe.setAttribute("allowfullscreen", "");
        iframe.setAttribute("id", videoHref);
        iframe.setAttribute("src", generateUrl(id));
        return iframe;
      } else {
        return "";
      }
    };

    sec3PictureButton.addEventListener("click", () => {
      html.classList.add("active");
      video.classList.add("active");
      video.append(createIframe(videoSrc));
    });

    video.addEventListener("click", () => {
      html.classList.remove("active");
      video.classList.remove("active");
      let searchIframe = document.getElementById(videoHref);
      searchIframe.contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
    });
  };
};
initVideo();