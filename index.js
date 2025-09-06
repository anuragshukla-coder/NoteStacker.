let addNote = document.querySelector("#add-note");
let formContainer = document.querySelector(".form-container");
let closeForm = document.querySelector(".closeForm");
const stack = document.querySelector(".stack");
const upBtn = document.querySelector("#upBtn");
const downBtn = document.querySelector("#downBtn");
const form = document.querySelector("form");

const imageUrlInput = form.querySelector("input[placeholder='https://example.com/photo.jpg']");
const fullNameInput = form.querySelector("input[placeholder='Enter full name']");
const homeTownInput = form.querySelector("input[placeholder='Enter home town']");
const purposeInput = form.querySelector("input[placeholder='e.g., Quick appointment note']");
const categoryRadios = form.querySelectorAll("input[name='category']");

// Save to LocalStorage
function saveToLocalStorage(obj) {
  let oldTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  oldTasks.push(obj);
  localStorage.setItem("tasks", JSON.stringify(oldTasks));
}

// Open form
addNote.addEventListener("click", () => {
  formContainer.style.display = "initial";
});

// Close form
closeForm.addEventListener("click", () => {
  formContainer.style.display = "none";
});

// Form submit
form.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const imageUrl = imageUrlInput.value.trim();
  const fullName = fullNameInput.value.trim();
  const homeTown = homeTownInput.value.trim();
  const purpose = purposeInput.value.trim();

  let category = false;
  categoryRadios.forEach((cat) => {
    if (cat.checked) category = cat.value;
  });

  if (!imageUrl || !fullName || !homeTown || !purpose || !category) {
    alert("Please fill all fields and select a category.");
    return;
  }

  saveToLocalStorage({ imageUrl, fullName, purpose, homeTown, category });
  form.reset();
  formContainer.style.display = "none";
  showCards();
});

// Show cards
function showCards() {
  stack.innerHTML = "";
  let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  allTasks.forEach((task) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const avatar = document.createElement("img");
    avatar.src = task.imageUrl;
    avatar.alt = "profile";
    avatar.classList.add("avatar");
    card.appendChild(avatar);

    const name = document.createElement("h2");
    name.textContent = task.fullName;
    card.appendChild(name);

    const hometownInfo = document.createElement("div");
    hometownInfo.classList.add("info-row");
    hometownInfo.innerHTML = `<span>Home town</span> <span>${task.homeTown}</span>`;
    card.appendChild(hometownInfo);

    const bookingsInfo = document.createElement("div");
    bookingsInfo.classList.add("info-row");
    bookingsInfo.innerHTML = `<span>Purpose</span> <span>${task.purpose}</span>`;
    card.appendChild(bookingsInfo);

    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("buttons");

    const callBtn = document.createElement("button");
    callBtn.classList.add("call");
    callBtn.innerHTML = '<i class="ri-phone-line"></i> Call';

    const msgBtn = document.createElement("button");
    msgBtn.classList.add("msg");
    msgBtn.textContent = "Message";

    // Delete Button
const deleteBtn = document.createElement("button");
deleteBtn.classList.add("delete");
deleteBtn.textContent = "Delete";

// Delete functionality
deleteBtn.addEventListener("click", () => {
  let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  allTasks = allTasks.filter(
    (taskItem) =>
      !(
        taskItem.imageUrl === task.imageUrl &&
        taskItem.fullName === task.fullName &&
        taskItem.homeTown === task.homeTown &&
        taskItem.purpose === task.purpose &&
        taskItem.category === task.category
      )
  );
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  showCards(); // re-render
});


    buttonsDiv.appendChild(callBtn);
    buttonsDiv.appendChild(msgBtn);
    buttonsDiv.appendChild(deleteBtn); 

    card.appendChild(buttonsDiv);

    stack.appendChild(card);
  });

  updateStack();
}

// Update stack UI
function updateStack() {
  const cards = document.querySelectorAll(".stack .card");
  for (let i = 0; i < cards.length && i < 3; i++) {
    cards[i].style.zIndex = 3 - i;
    cards[i].style.transform = `translateY(${i * 10}px) scale(${1 - i * 0.02})`;
    cards[i].style.opacity = `${1 - i * 0.02}`;
  }
}

// Move Up
upBtn.addEventListener("click", () => {
  let lastChild = stack.lastElementChild;
  if (lastChild) {
    stack.insertBefore(lastChild, stack.firstElementChild);
    updateStack();
  }
});

// Move Down
downBtn.addEventListener("click", () => {
  const firstChild = stack.firstElementChild;
  if (firstChild) {
    stack.appendChild(firstChild);
    updateStack();
  }
});

// Change background
document.querySelectorAll(".dot").forEach((dot) => {
  dot.addEventListener("click", function () {
    const color = this.classList[1];
    document.body.style.backgroundColor = color;
  });
});

showCards();
