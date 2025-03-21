console.log("MailGenie - Content Script Loaded");

function createAIButton() {
  const btn = document.createElement("div");
  btn.className = "T-I J-J5-Ji aoO v7 T-I-atl L3";
  btn.style.marginRight = "8px";
  btn.innerHTML = "AI Reply";
  btn.setAttribute("role", "btn");
  btn.setAttribute("data-tooltip", "Generate AI Reply");
  return btn;
}

function getEmailContent() {
  const selectors = [
    ".h7",
    ".a3s.aiL",
    ".gmail_quote",
    '[role="presentation"]',
  ];

  for (const selector of selectors) {
    const content = document.querySelector(selector);
    if (content) {
      return content.innerText.trim();
    }
    return "";
  }
}

function findComposeToolbar() {
  const selectors = [".btC", ".aDh", '[role="toolbar"]', ".gU.Up"];

  for (const selector of selectors) {
    const toolbar = document.querySelector(selector);
    if (toolbar) {
      return toolbar;
    }
    return null;
  }
}

function injectButton() {
  const existingButton = document.querySelector(".ai-reply-btn");
  //remove the existing btn
  if (existingButton) existingButton.remove();

  //get toolbar
  const toolbar = findComposeToolbar();
  if (!toolbar) {
    console.log("Toolbar not found");
    return;
  }
  console.log("Toolbar found, creating AI button");

  //create AI btn
  const btn = createAIButton();
  btn.classList.add("ai-reply-btn");
  btn.addEventListener("click", async () => {
    try {
      btn.innerHTML = "Generating...";
      btn.disabled = true;

      const emailContent = getEmailContent();
      const response = await fetch(
        "https://mailgenie-backend.onrender.com/api/email/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailContent: emailContent,
            tone: "professional",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("API Request Failed");
      }

      const generatedReply = await response.text();
      const composeBox = document.querySelector(
        '[role="textbox"][g_editable="true"]'
      );

      if (composeBox) {
        composeBox.focus();
        document.execCommand("insertText", false, generatedReply);
      } else {
        console.error("ComposeBox was not found");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to generate reply");
    } finally {
      btn.innerHTML = "AI Reply";
      btn.disabled = false;
    }
  });

  toolbar.insertBefore(btn, toolbar.firstChild);
}

//define our own mutation observer(bcoz whenever the compose window is added, we need to inject our own AI button )
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes); //addedNodes contains the nodes that were added to dom
    const hasComposeElements = addedNodes.some(
      //check whether node is an element or not(It shud be HTML, not text)
      (node) =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node.matches('.aDh, .btC, [role="dialog"]') ||
          node.querySelector('.aDh, .btC, [role="dialog"]'))
    );

    //We will see the composeButton if we find any of the element
    if (hasComposeElements) {
      console.log("Compose Window Detected");
      setTimeout(injectButton, 500); //call inject btn at delay of 500ms
    }
  }
});

//Now, Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
