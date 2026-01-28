let draggedItem = null;

function handleCredentialResponse(response) {
  // Send the JWT token to your backend
  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: response.credential }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.err) {
        console.error("Login failed:", data.err);
      } else {
        console.log("Logged in as:", data.name);
        // Update UI: hide login button, show user name
        const loginBox = document.querySelector(".login-box");
        loginBox.innerHTML = `<p>Welcome, ${data.name}!</p><button id="logout">Logout</button>`;
        document.getElementById("logout").addEventListener("click", () => {
          fetch("/api/logout", { method: "POST" }).then(() => {
            location.reload(); // Simple way to reset UI
          });
        });
      }
    })
    .catch((err) => console.error("Error:", err));
}

function createCheckboxItem(text) {
  const itemDiv = document.createElement("div");
  itemDiv.className = "checkbox-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "checkbox";

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.className = "checkbox-text";
  textInput.value = text;
  textInput.placeholder = "Enter task...";

  const motivatorSlot = document.createElement("div");
  motivatorSlot.className = "motivator-slot";

  // Handle checkbox toggle
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      textInput.style.textDecoration = "line-through";
      textInput.style.opacity = "0.6";
    } else {
      textInput.style.textDecoration = "none";
      textInput.style.opacity = "1";
    }
  });

  // Handle text input changes
  textInput.addEventListener("input", () => {
    // Auto-resize or handle as needed
  });

  // Handle Enter key to create new item and Backspace to delete empty item
  textInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const dropzone = itemDiv.parentElement;
      if (dropzone && dropzone.classList.contains("dropzone")) {
        const newItem = createCheckboxItem("");
        dropzone.appendChild(newItem);
        newItem.querySelector(".checkbox-text").focus();
      }
    } else if (e.key === "Backspace" && textInput.value === "") {
      e.preventDefault();
      // Remove the current checkbox item
      itemDiv.remove();
    }
  });

  // Add drop event listener for motivators
  itemDiv.addEventListener("dragover", (e) => {
    if (draggedItem && draggedItem.classList.contains("motivator")) {
      e.preventDefault();
    }
  });

  itemDiv.addEventListener("drop", (e) => {
    e.preventDefault();
    if (draggedItem && draggedItem.classList.contains("motivator")) {
      // Clear any existing motivator
      motivatorSlot.innerHTML = "";

      // Clone only the image from the motivator container
      const motivatorImage = draggedItem.querySelector("img").cloneNode(true);
      motivatorImage.draggable = false; // Make it non-draggable in the slot
      motivatorSlot.appendChild(motivatorImage);
      motivatorSlot.classList.add("has-motivator");
      draggedItem = null;
    }
  });

  itemDiv.appendChild(checkbox);
  itemDiv.appendChild(textInput);
  itemDiv.appendChild(motivatorSlot);

  return itemDiv;
}

// Removed global dragstart listener to avoid conflicts

document.addEventListener("DOMContentLoaded", () => {
  // Add drag handlers for tasks
  document.querySelectorAll(".task").forEach((task) => {
    task.addEventListener("dragstart", (e) => {
      draggedItem = task;
      e.dataTransfer.effectAllowed = "copy";
      e.dataTransfer.setData("text/plain", task.textContent);
    });
  });

  // Add specific drag handlers for motivator images
  document.querySelectorAll(".motivator").forEach((motivator) => {
    motivator.addEventListener("dragstart", (e) => {
      draggedItem = motivator;
      e.dataTransfer.effectAllowed = "copy";
      e.dataTransfer.setData("text/html", motivator.outerHTML);
      e.dataTransfer.setData("text/plain", motivator.alt);
    });
  });
});

// Initialize Google Sign-In
fetch("/api/google-client-id")
  .then((res) => res.json())
  .then((data) => {
    if (data.clientId) {
      google.accounts.id.initialize({
        client_id: data.clientId,
        callback: handleCredentialResponse,
      });
    }
  })
  .catch((err) => console.error("Error fetching client ID:", err));

// Check if user is already logged in
fetch("/api/whoami")
  .then((res) => res.json())
  .then((user) => {
    if (user.name) {
      const loginBox = document.querySelector(".login-box");
      loginBox.innerHTML = `<p>Welcome, ${user.name}!</p><button id="logout">Logout</button>`;
      document.getElementById("logout").addEventListener("click", () => {
        fetch("/api/logout", { method: "POST" }).then(() => {
          location.reload();
        });
      });
    }
  });

document.querySelectorAll(".dropzone").forEach((zone) => {
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    if (draggedItem && draggedItem.classList.contains("task")) {
      // Create a checkbox item only for tasks
      const checkboxItem = createCheckboxItem(draggedItem.textContent.trim());
      zone.appendChild(checkboxItem);
      draggedItem = null;
    }
  });

  // Allow clicking on dropzone to add the first checkbox item only
  zone.addEventListener("click", (e) => {
    // Only create new item if clicking on the dropzone itself and it has no checkbox items yet
    if (e.target === zone && zone.querySelectorAll(".checkbox-item").length === 0) {
      const checkboxItem = createCheckboxItem("");
      zone.appendChild(checkboxItem);
      // Focus on the newly created item
      const input = checkboxItem.querySelector(".checkbox-text");
      input.focus();
    }
  });
});

function goHome() {
  window.location.href = "index.html";
}

document.getElementById("add-column").addEventListener("click", () => {
  const column = document.createElement("div");
  column.className = "column";
  column.setAttribute("data-column", "");

  const h3 = document.createElement("h3");
  h3.textContent = "____________";
  h3.contentEditable = "true";
  h3.className = "placeholder";

  const removeButton = document.createElement("button");
  removeButton.className = "remove-column";
  removeButton.textContent = "×";
  removeButton.addEventListener("click", () => {
    column.remove();
  });

  h3.appendChild(removeButton);

  h3.addEventListener("input", () => {
    if (h3.classList.contains("placeholder")) {
      h3.classList.remove("placeholder");
    }
  });

  const dropzone = document.createElement("div");
  dropzone.className = "dropzone";

  // Add drag and drop listeners to the new dropzone
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    if (draggedItem && draggedItem.classList.contains("task")) {
      // Create a checkbox item only for tasks
      const checkboxItem = createCheckboxItem(draggedItem.textContent.trim());
      dropzone.appendChild(checkboxItem);
      draggedItem = null;
    }
  });

  // Allow clicking on dropzone to add the first checkbox item only
  dropzone.addEventListener("click", (e) => {
    // Only create new item if clicking on the dropzone itself and it has no checkbox items yet
    if (e.target === dropzone && dropzone.querySelectorAll(".checkbox-item").length === 0) {
      const checkboxItem = createCheckboxItem("");
      dropzone.appendChild(checkboxItem);
      // Focus on the newly created item
      const input = checkboxItem.querySelector(".checkbox-text");
      input.focus();
    }
  });

  column.appendChild(h3);
  column.appendChild(dropzone);

  document.querySelector(".board").appendChild(column);
});

// Add event listeners to existing remove buttons
document.querySelectorAll(".remove-column").forEach((button) => {
  button.addEventListener("click", () => {
    button.closest(".column").remove();
  });
});

// Night mode toggle
document.getElementById("night-mode-toggle").addEventListener("click", () => {
  const body = document.body;
  const toggle = document.getElementById("night-mode-toggle");

  body.classList.toggle("night-mode");

  if (body.classList.contains("night-mode")) {
    toggle.textContent = "☀️";
  } else {
    toggle.textContent = "🌙";
  }
});

// // Google login button event listener
// document.getElementById("google-login").addEventListener("click", () => {
//   google.accounts.id.prompt();
// });

/*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
function oauthSignIn() {
  // Google's OAuth 2.0 endpoint for requesting an access token
  var oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

  // Create <form> element to submit parameters to OAuth 2.0 endpoint.
  var form = document.createElement("form");
  form.setAttribute("method", "GET"); // Send as a GET request.
  form.setAttribute("action", oauth2Endpoint);

  // Parameters to pass to OAuth 2.0 endpoint.
  var params = {
    client_id: "565504767705-1qi0a3tha607dmd5pjc6nmv2rc94p0sn.apps.googleusercontent.com",
    redirect_uri: "http://127.0.0.1:5501/skeleton-main/client/quest.html",
    response_type: "token",
    scope: "openid profile email",
    include_granted_scopes: "true",
    state: "pass-through value",
  };

  // Add form parameters as hidden input values.
  for (var p in params) {
    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p]);
    form.appendChild(input);
  }

  // Add form to page and submit it to open the OAuth 2.0 endpoint.
  document.body.appendChild(form);
  form.submit();
}

document.getElementById("google-login").addEventListener("click", () => {
  const button = document.getElementById("google-login");
  if (button.textContent === "Log out") {
    // Logout: clear the access token from URL hash and reset button
    window.location.hash = "";
    button.textContent = "Log in with Google";
    // Reload to reset the page state
    location.reload();
  } else {
    oauthSignIn();
  }
});

// 1. Get the fragment identifier string part of the URL (starts with '#')
const fragmentIdentifier = window.location.hash;

// 2. Create a URLSearchParams object
const urlParams = new URLSearchParams(fragmentIdentifier.substring(1));

// 3. Use methods to access parameters
const access_token = urlParams.get("access_token");

// 4. Check if a parameter exists
const hasAccessToken = urlParams.has("access_token"); // true

// 5. Iterate over all parameters
urlParams.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
  method: "GET", // or 'POST', 'PUT', etc.
  headers: {
    // "Content-Type": "application/json",
    Authorization: `Bearer ${access_token}`,
    Accept: "application/json",
  },
  // body: JSON.stringify({ key: "value" }),
})
  .then(async (response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const json_obj = await response.json();
    alert(`Hello ${json_obj.name}! Welcome to your task organizer!`);
    return json_obj;
  })
  .then((data) => {
    console.log("User Name:", data.names?.[0]?.displayName);
    console.log("User Email:", data.emailAddresses?.[0]?.value);
    // Update button text after successful login
    const myButton = document.getElementById("google-login");
    if (myButton) {
      myButton.textContent = "Log out";
    }
  })
  .catch((error) => console.error("Error:", error));
