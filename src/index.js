document.addEventListener("DOMContentLoaded", () => {
  const QUOTES_URL = "http://localhost:3000/quotes?_embed=likes";
  const LIKES_URL = "http://localhost:3000/likes";
  const quoteList = document.getElementById("quote-list");
  const quoteForm = document.getElementById("new-quote-form");

  // Fetch and render all quotes
  fetchQuotes();

  function fetchQuotes() {
    fetch(QUOTES_URL)
      .then(res => res.json())
      .then(quotes => {
        quoteList.innerHTML = "";
        quotes.forEach(renderQuote);
      });
  }

  function renderQuote(quote) {
    const li = document.createElement("li");
    li.className = "quote-card";

    const block = document.createElement("blockquote");
    block.className = "blockquote";

    const p = document.createElement("p");
    p.className = "mb-0";
    p.textContent = quote.quote;

    const footer = document.createElement("footer");
    footer.className = "blockquote-footer";
    footer.textContent = quote.author;

    const br = document.createElement("br");

    const likeBtn = document.createElement("button");
    likeBtn.className = "btn-success";
    const likeCount = quote.likes ? quote.likes.length : 0;
    likeBtn.innerHTML = `Likes: <span>${likeCount}</span>`;
    likeBtn.addEventListener("click", () => addLike(quote, likeBtn));

    const delBtn = document.createElement("button");
    delBtn.className = "btn-danger";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => deleteQuote(quote.id, li));

    block.append(p, footer, br, likeBtn, delBtn);
    li.appendChild(block);
    quoteList.appendChild(li);
  }

  function addLike(quote, likeBtn) {
    fetch(LIKES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quoteId: quote.id,
        createdAt: Math.floor(Date.now() / 1000)
      })
    })
    .then(res => res.json())
    .then(() => {
      const span = likeBtn.querySelector("span");
      span.textContent = parseInt(span.textContent) + 1;
    });
  }

  function deleteQuote(id, li) {
    fetch(`http://localhost:3000/quotes/${id}`, {
      method: "DELETE"
    })
    .then(() => li.remove());
  }

  quoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const quoteText = document.getElementById("new-quote").value;
    const author = document.getElementById("author").value;

    fetch("http://localhost:3000/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ quote: quoteText, author })
    })
    .then(res => res.json())
    .then(newQuote => {
      newQuote.likes = [];
      renderQuote(newQuote);
      quoteForm.reset();
    });
  });
});
