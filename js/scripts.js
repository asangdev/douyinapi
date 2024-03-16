document.addEventListener("DOMContentLoaded", (event) => {
  const lightbox = document.getElementById("videoLightbox");
  const lightboxVideo = document.getElementById("lightboxVideo");
  const progressBar = document.createElement("div");
  progressBar.className = "video-progress";
  lightbox.appendChild(progressBar);
  const photoCards = document.querySelectorAll(".photo-card");
  let currentVideoIndex = -1; // Khởi tạo không có video nào được chọn

  // Hàm để chuyển sang video tiếp theo
  function playNextVideo() {
    currentVideoIndex++; // Tăng chỉ số video hiện tại lên
    if (currentVideoIndex < photoCards.length) {
      const videoSrc =
        photoCards[currentVideoIndex].querySelector("video source").src;
      lightboxVideo.querySelector("source").src = videoSrc;
      lightboxVideo.load();
      lightboxVideo.play();
      updateOpenCount(currentVideoIndex); // Cập nhật số lần mở cho video hiện tại
    } else {
      currentVideoIndex = photoCards.length - 1; // Giữ nguyên chỉ số cuối cùng nếu đã đến video cuối cùng
    }
  }

  // Hàm để chuyển sang video trước đó
  function playPreviousVideo() {
    currentVideoIndex--; // Giảm chỉ số video hiện tại
    if (currentVideoIndex >= 0) {
      const videoSrc =
        photoCards[currentVideoIndex].querySelector("video source").src;
      lightboxVideo.querySelector("source").src = videoSrc;
      lightboxVideo.load();
      lightboxVideo.play();
      updateOpenCount(currentVideoIndex); // Cập nhật số lần mở cho video hiện tại
    } else {
      currentVideoIndex = 0; // Giữ nguyên chỉ số đầu tiên nếu đã ở video đầu tiên
    }
  }

  photoCards.forEach((card, index) => {
    card.addEventListener("click", function () {
      currentVideoIndex = index; // Cập nhật chỉ số video hiện tại khi một card được click
      const videoSrc = this.querySelector("video source").src;

      lightboxVideo.querySelector("source").src = videoSrc;
      lightboxVideo.load();
      lightbox.style.display = "flex";
      setTimeout(() => {
        lightbox.classList.add("active");
        lightboxVideo.play();
      }, 10);

      updateOpenCount(index); // Cập nhật số lần mở cho card được click
    });
  });

  // Lắng nghe sự kiện mousemove trên tất cả các phần tử .media để kích hoạt hiệu ứng glow
  document.querySelectorAll(".media").forEach((media) => {
    media.addEventListener("mousemove", (e) => {
      const bounds = media.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      const threshold = 20; // Khoảng cách từ viền để kích hoạt hiệu ứng

      if (
        mouseX < threshold ||
        mouseX > bounds.width - threshold ||
        mouseY < threshold ||
        mouseY > bounds.height - threshold
      ) {
        media.classList.add("glow");
      } else {
        media.classList.remove("glow");
      }
    });

    media.addEventListener("mouseleave", () => {
      media.classList.remove("glow");
    });
  });

  document.querySelectorAll(".photo-card").forEach((card, index) => {
    const cardId = index;
    let openCount =
      parseInt(localStorage.getItem(`lightboxOpens_${cardId}`)) || 0;
    updateHeartCount(card, openCount);

    const media = card.querySelector(".media");
    const video = media.querySelector("video");

    card.addEventListener("click", function () {
      const videoSrc = this.querySelector("video source").src;

      lightboxVideo.querySelector("source").src = videoSrc;
      lightboxVideo.load();
      lightbox.style.display = "flex";
      setTimeout(() => {
        lightbox.classList.add("active");
        lightboxVideo.play();
      }, 10);

      openCount++;
      localStorage.setItem(`lightboxOpens_${cardId}`, openCount.toString());
      updateHeartCount(card, openCount);
    });

    // Xử lý chức năng phát/tạm dừng video
    lightboxVideo.addEventListener("click", function () {
      if (!this.paused) {
        this.pause();
      } else {
        this.play();
      }
    });

    // Xử lý sự kiện hover chuột
    media.addEventListener("mouseenter", () => {
      video.style.display = "block";
      video.play();
    });

    media.addEventListener("mouseleave", () => {
      video.style.display = "none";
      video.pause();
      video.currentTime = 0;
    });
  });

  function updateOpenCount(index) {
    let openCount =
      parseInt(localStorage.getItem(`lightboxOpens_${index}`)) || 0;
    openCount++;
    localStorage.setItem(`lightboxOpens_${index}`, openCount.toString());
    updateHeartCount(photoCards[index], openCount);
  }

  function updateHeartCount(card, count) {
    const heartIcon = card.querySelector(".icon-heart");
    if (heartIcon) {
      heartIcon.textContent = `❤️ ${count}`;
    }
  }

  lightboxVideo.addEventListener("ended", playNextVideo); // Chơi video tiếp theo khi video hiện tại kết thúc

  // Điều khiển video bằng phím mũi tên
  document.addEventListener("keydown", function (event) {
    if (lightbox.style.display === "flex") {
      // Chỉ xử lý khi lightbox đang hiển thị
      if (event.key === "ArrowDown") {
        playNextVideo();
      } else if (event.key === "ArrowUp") {
        playPreviousVideo();
      }
    }
  });

  // Lắng nghe sự kiện nhấn phím trên toàn bộ tài liệu
  document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
      event.preventDefault();
      lightboxVideo.paused ? lightboxVideo.play() : lightboxVideo.pause();
    }
  });

  // Ngăn chặn việc bấm chuột phải trên toàn trang
  document.addEventListener(
    "contextmenu",
    function (e) {
      e.preventDefault();
    },
    false
  );

  // Hàm cập nhật chiều rộng dòng tiến trình
  lightboxVideo.addEventListener("timeupdate", () => {
    if (lightboxVideo.duration) {
      const progress =
        (lightboxVideo.currentTime / lightboxVideo.duration) * 100;
      progressBar.style.width = progress + "%";
    }
  });

  // Đóng lightbox khi click vào vùng ngoài video
  document
    .getElementById("videoLightbox")
    .addEventListener("click", function (event) {
      if (
        event.target === this ||
        event.target.className.includes("cinema-lights")
      ) {
        this.classList.remove("active");
        setTimeout(() => {
          this.style.display = "none";
          lightboxVideo.pause();
          lightboxVideo.currentTime = 0;
        }, 500);
      }
    });
});
