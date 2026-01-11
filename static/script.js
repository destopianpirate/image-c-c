const fileInput = document.getElementById("fileInput");
const dropBox = document.getElementById("dropBox");
const chooseBtn = document.getElementById("chooseBtn");

const slider = document.getElementById("slider");
const bubble = document.getElementById("bubble");

const sizeInput = document.getElementById("sizeInput");
const unit = document.getElementById("unit");

const previewImg = document.getElementById("previewImg");

let originalSize = 0;

/* FILE PICKER */
chooseBtn.addEventListener("click", e => {
  e.preventDefault();
  fileInput.click();
});

dropBox.addEventListener("click", e => {
  if (e.target !== chooseBtn) fileInput.click();
});

/* DRAG DROP */
dropBox.addEventListener("dragover", e => e.preventDefault());
dropBox.addEventListener("drop", e => {
  e.preventDefault();
  fileInput.files = e.dataTransfer.files;
  loadFile();
});

fileInput.addEventListener("change", loadFile);

function loadFile() {
  const file = fileInput.files[0];
  if (!file) return;

  originalSize = file.size;

  const reader = new FileReader();
  reader.onload = e => {
    previewImg.src = e.target.result;
    previewImg.style.display = "block";
  };
  reader.readAsDataURL(file);

  updateFromSlider();
}

/* SLIDER → SIZE */
slider.addEventListener("input", updateFromSlider);

function updateFromSlider() {
  bubble.innerText = slider.value + "%";
  bubble.style.left = slider.value + "%";

  let bytes = originalSize * slider.value / 100;

  if (bytes >= 1024 * 1024) {
    sizeInput.value = (bytes / 1024 / 1024).toFixed(2);
    unit.innerText = "MB";
  } else {
    sizeInput.value = (bytes / 1024).toFixed(2);
    unit.innerText = "KB";
  }
}

/* SIZE → SLIDER */
sizeInput.addEventListener("input", () => {
  if (!originalSize) return;

  let v = parseFloat(sizeInput.value);
  if (isNaN(v)) return;

  let bytes = unit.innerText === "MB"
    ? v * 1024 * 1024
    : v * 1024;

  slider.value = Math.min(100, Math.max(0, bytes / originalSize * 100));
  updateFromSlider();
});
