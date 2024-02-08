var HelperFunctions = {};

/* window.ready */
$(document).ready(function () {
  HelperFunctions.bindFunctions();
});

HelperFunctions.bindFunctions = function () {};

HelperFunctions.fetchPost = async function (url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    mode: "same-origin",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return response.json();
};

HelperFunctions.fetchGet = async function (url = "") {
  const response = await fetch(url, {
    method: "GET",
    mode: "same-origin",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });
  return response.json();
};

HelperFunctions.debounce =
  (fn, delay, timeout = 0) =>
  (args) => {
    clearTimeout(timeout);
    // adds `as unknown as number` to ensure setTimeout returns a number
    // like window.setTimeout
    timeout = setTimeout(() => fn(args), delay);
  };
