function createGptButton() {
  const gptButton = document.createElement("button");
  gptButton.innerHTML =
    '<span class="gptbtn-text">Generate Response</span>\n' +
    '  <span class="spinner"></span>\n';
  gptButton.class = "gptbtn";

  gptButton.textContent = "Generate response";
  gptButton.style.backgroundColor = "#90EE90";
  gptButton.style.color = "#54656F";
  gptButton.style.padding = "10px";
  gptButton.style.border = "none";
  gptButton.style.borderRadius = "5px";

  gptButton.style.transition = "background-color 0.3s ease";
  gptButton.style.cursor = "pointer";

  gptButton.addEventListener("mouseover", () => {
    gptButton.style.backgroundColor = "#BCE5A7";
  });

  gptButton.addEventListener("mouseout", () => {
    gptButton.style.backgroundColor = "#D9FDD3";
  });

  gptButton.style.boxShadow = "inset 0 0 5px rgba(0, 0, 0, 0.2)";

  gptButton.addEventListener("mousedown", () => {
    gptButton.style.boxShadow = "inset 0 0 10px rgba(0, 0, 0, 0.4)";
  });

  gptButton.addEventListener("mouseup", () => {
    gptButton.style.boxShadow = "inset 0 0 5px rgba(0, 0, 0, 0.2)";
  });
  return {
    gptButton,
    setBusy(value) {
      if (value) {
        gptButton.style.backgroundColor = "#90EE90";
        gptButton.style.color = "#54656F";
        gptButton.textContent = "Generate response";
      } else {
        gptButton.style.backgroundColor = "#D9FDD3";
      }
    },
  };
}

function createButtonEmpty(title) {
  const buttonElement = document.createElement("button");
  buttonElement.innerHTML =
    '<button class="svlsagor"><span><svg height="32px" width="32px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#1b420a" stroke="#1b420a"></svg></span></button>';
  buttonElement.setAttribute("title", title);
  const svg = buttonElement.querySelector("svg");
  console.log("buttonElement: ", buttonElement);
  return { svg, buttonElement };
}

function creatCopyButton(newFooter, newButtonContainer) {
  const { svg: svgElement, buttonElement: copyButton } = createButtonEmpty(
    "Copy chat to Whatsapp's input"
  );
  svgElement.innerHTML = `
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style="fill:#1b420a;" d="M0,256c0,141.158,114.842,256,256,256V0C114.842,0,0,114.842,0,256z"></path> <path style="fill:#1b420a;" d="M256,0v512c141.158,0,256-114.842,256-256S397.158,0,256,0z"></path> <path style="fill:#51fb73;" d="M272.454,161.969c-4.366-4.364-10.283-6.817-16.457-6.817c-6.173,0-12.093,2.453-16.457,6.817 L115.422,286.09c-9.087,9.089-9.087,23.824,0.002,32.914c9.087,9.087,23.822,9.087,32.914-0.002l107.661-107.664l107.669,107.666 c4.541,4.541,10.498,6.814,16.454,6.814c5.956,0,11.913-2.273,16.455-6.817c9.089-9.089,9.089-23.824,0-32.914L272.454,161.969z"></path> </g>
  `;
  newFooter.querySelectorAll(".selectable-text.copyable-text")[0];
  copyButton.style.marginRight = "10px";
  newButtonContainer.appendChild(copyButton);
  return copyButton;
}

function createGptFooter(footer, mainNode) {
  const newFooter = footer.cloneNode(true);

  let mainFooterContainerDiv =
    newFooter.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
  const gptButtonObject = createGptButton();

  const buttonContainer = mainFooterContainerDiv.childNodes[0];
  buttonContainer.removeChild(buttonContainer.firstChild);
  buttonContainer.removeChild(buttonContainer.firstChild);
  const newButtonContainer = buttonContainer.cloneNode();
  mainFooterContainerDiv.appendChild(newButtonContainer);
  buttonContainer.appendChild(gptButtonObject.gptButton);
  mainFooterContainerDiv.querySelectorAll("div").forEach(function (div) {
    if (div.children.length === 0 && div.textContent.trim().length !== 0) {
      div.remove();
    }
  });

  const speechbutton = newFooter.querySelectorAll(
    '.svlsagor[aria-label="Voice message"]'
  )[0];
  const speechButtonParent = speechbutton.parentNode;

  speechButtonParent.remove();
  const copyButton = creatCopyButton(newFooter, newButtonContainer);

  let parentNode = footer.parentNode;
  parentNode.insertBefore(newFooter, footer.nextSibling);

  const contentEditable = newFooter.querySelector('[contenteditable="true"]');
  contentEditable.setAttribute("contenteditable", "false");

  return { newFooter, gptButtonObject: gptButtonObject, copyButton };
}
