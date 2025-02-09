const encoder = new TextEncoder();

class LinkedSet {
  constructor() {
    this.map = new Map();
  }

  add(value) {
    if (!this.map.has(value)) {
      this.map.set(value, this.map.size + 1);
    }
  }

  getPosition(value) {
    return this.map.get(value);
  }
}

function parseHtml(main) {
  const chatHistory = [];
  const msgContainers = Array.from(
    main.querySelectorAll("div[role='row']")
  ).slice(-10);

  const linkedSet = new LinkedSet();
  msgContainers.forEach((el) => {
    let messageStringCollector = "";
    const elements = el.querySelectorAll(".copyable-text"); 
    elements.forEach((el) => {
      const messageLabel = el.getAttribute("data-pre-plain-text");
      if (messageLabel !== null) {
        if (el.closest(".message-out") !== null) {
          messageStringCollector += "Me: ";
        } else {
          let contactName = messageLabel.replace(/\[.*?\]\s*/, "").slice(0, -2);
          linkedSet.add(contactName);
          const contactNumber = linkedSet.getPosition(contactName);
          messageStringCollector += contactNumber + ": ";
        }
      } else {
        const messageContent = getTextWithEmojis(el);
        if (typeof messageContent !== "undefined") {
          messageStringCollector += messageContent;
        }
      }
    });
    if (messageStringCollector.length !== 0) {
      chatHistory.push(messageStringCollector);
    }
  });

  const lastExpression = chatHistory[chatHistory.length - 1] || "";
  const lastIsMine = lastExpression.startsWith("Me:");

  const chatHistoryShortAsString = chatHistory.join("\n\n");
  return { chatHistoryShort: chatHistoryShortAsString, lastIsMine };
}

function getTextWithEmojis(element) {
  return Array.from(element.childNodes)
    .map((childNode) => {
      if (childNode.nodeType === Node.TEXT_NODE) {
        return childNode.textContent;
      } else if (
        childNode.nodeType === Node.ELEMENT_NODE &&
        childNode.tagName === "IMG" &&
        childNode.hasAttribute("data-plain-text")
      ) {
        return childNode.getAttribute("data-plain-text");
      } else {
        return getTextWithEmojis(childNode);
      }
    })
    .join("");
}
