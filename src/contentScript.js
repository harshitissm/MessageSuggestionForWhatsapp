"use strict";

const link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = chrome.runtime.getURL("content.css");
document.head.appendChild(link);

let sendHistory = false;
let apiKey = null;

function readData() {
  try {
    chrome.storage.local.get(
      {
        apiKey: "",
        sendHistory: "manual",
      },
      (result) => {
        apiKey = result.apiKey;
        sendHistory = result.sendHistory;
      }
    );
  } catch (e) {
    
  }
}

readData();

async function copyToSendField(text) {
  try {
    const textareaEl = globalMainNode.querySelector('[contenteditable="true"]');
    textareaEl.focus();
    document.execCommand("insertText", false, text);
  } catch (e) {}
}

let delayTimer;

let parseHtmlFunction;

function triggerEvent() {
  if (delayTimer) {
    clearTimeout(delayTimer);
  }
  delayTimer = setTimeout(parseHtmlFunction, 100);
}

let globalMainNode;
let newFooterParagraph;

function createPrompt(lastIsMine, chatHistoryShort) {
  let promptPrefix;
  let promptInstructions = "Me: ";
  if (lastIsMine) {
    promptPrefix =
      "As me, give a double texting utterance completing the following chat conversation flow. Use Emoji and my writing style and do not repeat the contents of the last utterance:\n\n";
  } else {
    promptPrefix =
      "As me, give an utterance completing the following chat conversation flow. Use Emoji and my writing style:\n\n";
  }
  let prompt = promptPrefix + chatHistoryShort + "\n\n" + promptInstructions;
  console.log("prompt:", prompt);
  return prompt;
}

let globalGptButtonObject;

function gptButtonClicked() {
  chrome.storage.local.get(
    {
      askedForPermission: false,
    },
    (result) => {
      if (!result.askedForPermission) {
        let message =
          "<ul>" +
          "<li>The last 10 messages of your chat-conversation will be sent to openai, each time you press this button.</li>" +
          "<li>They are handled by openai according to their <a href='https://openai.com/policies/api-data-usage-policies' target='_blank'>api-documentation</a> and <a href='https://openai.com/policies/privacy-policy' target='_blank'>privacy policy</a>.</li>" +
          "<li>This is less secure than the end-to-end encryption that <a href='https://faq.whatsapp.com/820124435853543/?helpref=uf_share' target='_blank'>WhatsApp(tm) uses</a>.</li>" +
          "</ul><br><br>" +
          '<p style="display: inline-block; text-align: center; width: 100%;">Are you ok with that?</p>';
        confirmDialog(message).then((result) => {
          if (result) {
            chrome.storage.local.set(
              {
                askedForPermission: true,
              },
              () => {}
            );
            triggerEvent();
          }
        });
      } else {
        triggerEvent();
      }
    }
  );
}

chrome.storage.local.onChanged.addListener((changes) => {
  if (changes.sendHistory || changes.apiKey || changes.apiChoice) {
    location.reload();
  }
});

function processMainNodeAdded(addedNode) {
  const mainNode = addedNode;
  globalMainNode = addedNode;
  readData();
  const footer = mainNode.getElementsByTagName("footer")[0];
  footer.querySelectorAll(".selectable-text.copyable-text")[0];
  const { newFooter, gptButtonObject, copyButton } = createGptFooter(
    footer,
    addedNode
  );
  globalGptButtonObject = gptButtonObject;
  newFooterParagraph = newFooter.querySelectorAll(
    ".selectable-text.copyable-text"
  )[0];
  copyButton.addEventListener("click", () => {
    copyToSendField(newFooterParagraph.textContent);
  });
  // console.log("sendHistory:", sendHistory);
  parseHtmlFunction = async function () {
    const { chatHistoryShort, lastIsMine } = parseHtml(addedNode); //parse HTML Function
    let prompt = createPrompt(lastIsMine, chatHistoryShort); // creating the prompt
    gptButtonObject.setBusy(true);
    await chrome.runtime.sendMessage({
      message: "sendChatToGpt",
      prompt: prompt,
    });
  };
  if (sendHistory === "auto") {
    triggerEvent();
  }
  const gptButton = gptButtonObject.gptButton;
  console.log("gptButton:", gptButton);
  gptButton.addEventListener("click", () => {
    gptButtonClicked();
  });
}

const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach(function (addedNode) {
        const addedNodeId = addedNode.id;
        if (addedNodeId === "main") {
          processMainNodeAdded(addedNode);
        } else if (addedNode.role === "row") {
          if (sendHistory === "auto") {
            console.log("uploadButton present");
            triggerEvent();
          }
        }
      });
    }
  });
});

let confirmVisible = false;

observer.observe(document.body, {
  childList: true, 
  subtree: true,
});

async function writeTextToSuggestionField(response) {
  try {
    newFooterParagraph.innerHTML = response;
  } catch (e) {
    console.error(e);
  }
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "gptResponse") {
    const response = request.response;
    globalGptButtonObject.setBusy(false);
    if (response.error !== null && response.error !== undefined) {
      writeTextToSuggestionField(response.error.message);
      return;
    }
    writeTextToSuggestionField(response.text);
  }
});