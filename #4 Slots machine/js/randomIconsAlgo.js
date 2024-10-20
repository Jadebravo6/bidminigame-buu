const iconList = [
  "😀",
  "😍",
  "😎",
  "😂",
  "😊",
  "😇",
  "🫠",
  "😀",
  "😍",
  "😎",
  "😂",
  "😊",
  "😇",
  "🫠",
  "🍏",
  "🍎",
  "🍐",
  "🍊",
  "🍋",
  "🍌",
  "🍉",
  "🍇",
  "🍓",
  "🫐",
  "🍈",
  "🍒",
  "🍑",
  "🥭",
  "🍍",
  "🥥",
  "🥝",
  "🍅",
  "🍆",
  "🥑",
  "🥦",
  "🥬",
  "🥒",
  "🌶",
  "🫑",
  "🌽",
  "🥕",
  "🫒",
  "🧄",
  "🧅",
  "🥔",
  "🍠",
  "🎁",
  "🇨🇩",
];

const iconListLength = iconList.length;
const DOMIconsListPart1 = document.querySelector(".part-1 .icon-list");
const DOMIconsListPart2 = document.querySelector(".part-2 .icon-list");
const DOMIconsListPart3 = document.querySelector(".part-3 .icon-list");
const AleatoireIconList = [];

for (let i = 0; i < maxSlotSize * 2; i++) {
  let isNew = true;

  while (isNew) {
    const added = iconList[Math.floor(Math.random() * iconListLength)];
    if (!AleatoireIconList.includes(added)) {
      AleatoireIconList.push(added);
      isNew = false;
    }
  }
}

for (let i = 0; i < AleatoireIconList.length; i++) {
  DOMIconsListPart1.appendChild(document.createElement("li"));
  DOMIconsListPart2.appendChild(document.createElement("li"));
  DOMIconsListPart3.appendChild(document.createElement("li"));

  DOMIconsListPart1.querySelectorAll(".icon-list li")[i].classList.add("icon");
  DOMIconsListPart2.querySelectorAll(".icon-list li")[i].classList.add("icon");
  DOMIconsListPart3.querySelectorAll(".icon-list li")[i].classList.add("icon");

  DOMIconsListPart1.querySelectorAll(".icon-list li")[i].innerHTML =
    AleatoireIconList[i];
  DOMIconsListPart2.querySelectorAll(".icon-list li")[i].innerHTML =
    AleatoireIconList[i];
  DOMIconsListPart3.querySelectorAll(".icon-list li")[i].innerHTML =
    AleatoireIconList[i];
}
