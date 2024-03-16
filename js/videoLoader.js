document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("fetchVideo").addEventListener("click", async () => {
    const urlInput = document.getElementById("videoUrl");
    const url = urlInput.value.trim();
    if (!url) {
      alert("Vui lòng nhập URL");
      return;
    }

    showLoadingIndicator();
    const data = await fetchVideoData(url);
    if (data) {
      createPhotoCard(data);
    }
    hideLoadingIndicator();
  });
});

async function fetchVideoData(url) {
  const apiUrl = "https://apis.asang.dev/fetch-video"; // Sửa đổi theo endpoint thực tế
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: url }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

function startLoading() {
  const loadingBar = document.getElementById("loading-bar");
  loadingBar.classList.add("active");
  loadingBar.style.width = "0%"; // Khởi tạo lại độ rộng
  setTimeout(() => {
    loadingBar.style.width = "100%"; // Bắt đầu transition
  }, 0); // Đảm bảo CSS transition được áp dụng sau khi thêm class 'active'
}

function stopLoading() {
  const loadingBar = document.getElementById("loading-bar");
  setTimeout(() => {
    loadingBar.classList.remove("active");
    loadingBar.style.width = "0%"; // Reset độ rộng về 0
  }, 2000); // Chờ transition hoàn tất
}

function createPhotoCard({ imageUrl, videoUrl, caption }) {
  const gallery = document.querySelector(".gallery");
  const photoCard = document.createElement("div");
  photoCard.className = "photo-card";

  const media = document.createElement("div");
  media.className = "media";

  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = caption;

  const video = document.createElement("video");
  video.loop = true;
  video.muted = true;
  const source = document.createElement("source");
  source.src = videoUrl;
  source.type = "video/mp4";
  video.appendChild(source);

  const captionDiv = document.createElement("div");
  captionDiv.className = "caption";
  captionDiv.textContent = caption;

  media.appendChild(image);
  photoCard.appendChild(media);
  photoCard.appendChild(captionDiv);
  gallery.appendChild(photoCard);
}

function showLoadingIndicator() {
  const loader = document.createElement("div");
  loader.id = "loading-spinner";
  loader.className = "loading-spinner"; // Dùng class để áp dụng CSS
  document.querySelector(".douyinurl").appendChild(loader);
}

function hideLoadingIndicator() {
  const loader = document.getElementById("loading-spinner");
  if (loader) {
    loader.remove();
  }
}
