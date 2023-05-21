const container = document.querySelector(".container-4");
const text = document.querySelector(".quote");
const back = document.querySelector(".back");
const search_input = document.querySelector(".search-input");
const search_button = document.querySelector(".search-output");
const first = document.querySelector(".container");
const button = document.querySelector(".btn");
const animeNAME = document.querySelector(".anime-name");
const animePic = document.querySelector(".parent-anime-pic");
const afterSearchBtn = document.querySelector(".after-search-btn");
const afterSearch = document.querySelector(".after-search");
const container3 = document.querySelector(".container-3");
const charName = document.querySelector(".char-name");
const container4Subheader = document.querySelector(".container-4-subheader");
const container5 = document.querySelector(".container-5");
const contentElements = document.querySelectorAll("body > *:not(.container-5)");
const animeElements = container4Subheader.querySelectorAll(".anime");

// ! FETCHING ANIME QUOTE AND CHARACTER NAME
//* ------------------------------------------------------------------------------------

function fetchAnimeQuoteAndCharacter() {
  const fetchPromise = fetch("https://animechan.vercel.app/api/random");
  container3.classList.add("hidden");
  afterSearch.classList.remove("hidden");

  fetchPromise
    .then((response) => response.json())
    .then((character) => {
      const quote = `${character.quote}`;
      text.textContent = quote;
      const characterName = character.character;
      const animeTitle = character.anime;
      animeNAME.textContent = animeTitle;
      animePic.innerHTML = "";
      charName.innerHTML = "";

      // ! Fetching character image and appending the child to container
      //* ------------------------------------------------------------------------------------
      fetch(`https://graphql.anilist.co`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: `
            query ($search: String) {
              Character(search: $search) {
                image {
                  large
                }
              }
            }
          `,
          variables: {
            search: characterName,
          },
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          const characterImage = data.data.Character.image.large;

          // ! character image URL to display the image

          const img = document.createElement("img");
          img.src = characterImage;
          img.classList.add("anime-pic");
          const newElement = `<img src=${characterImage} class = "anime-pic">`;
          animePic.insertAdjacentHTML("beforeend", newElement);
          charName.textContent = characterName;
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      console.error(error);
    });
}
function fetchAnime(animeTitle) {
  // ! Fetching anime synopsis and anime background for the more information on this anime feature
  const fetchAnime = fetch(`https://graphql.anilist.co`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
                  query ($search: String) {
                    Media(search: $search, type: ANIME) {
                      title {
                        romaji
                      }
                      description
                      coverImage {
                        large
                      }
                      bannerImage
                      startDate{
                        year
                        month
                        day
                      }
                      endDate{
                        year
                        month
                        day
                      }
                      status
                      popularity
                      episodes
                      duration
                      characters {
                        edges {
                          node {
                            id
                            name {
                              full
                            }
                            image {
                              large
                            }
                          }
                        }
                      }
                    }
                  }
                `,
      variables: {
        search: animeTitle,
      },
    }),
  });
  fetchAnime
    .then((response) => response.json())
    .then((data) => {
      const animeTitle = data.data.Media.title.romaji; // get the title of the anime
      const animeImage = data.data.Media.coverImage.large; // get the image of the anime
      const animeSynopsis = data.data.Media.description; // get the synopsis of the anime
      const animeBackground = data.data.Media.bannerImage; // get the background image of the anime
      console.log(data.data.Media.startDate);
      console.log(data.data.Media.endDate);
      console.log(data.data.Media.status);
      console.log(data.data.Media.popularity);
      console.log(data.data.Media.characters);
      console.log(`Title: ${animeTitle}`);
      console.log(`Image URL: ${animeImage}`);
      console.log(`Synopsis: ${animeSynopsis}`);
      const img = document.createElement("img");
      img.src = animeBackground;
      back.appendChild(img);

      // use the title, image, and synopsis to display the information on your website
    })
    .catch((error) => {
      console.error(error);
    });
}
function fetchShows(search, container) {
  container.classList.remove("hidden");
  fetch(`https://graphql.anilist.co`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
        query ($search: String, $type: MediaType) {
          Page {
            media(search: $search, type: $type) {
              id
              title {
                romaji
                english
                native
              }
              coverImage {
                large
              }
              genres
              description
            }
          }
        }
      `,
      variables: {
        search: search,
        type: "ANIME",
      },
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const animeList = data.data.Page.media;
      container.innerHTML = ""; // Clear the container before adding new animeElements
      animeList.forEach((anime) => {
        const title =
          anime.title.romaji || anime.title.english || anime.title.native;
        const image = anime.coverImage.large;
        const genres = anime.genres.join(", ");
        const animeElement = document.createElement("div");
        animeElement.classList.add("anime");
        animeElement.style.color = "aliceblue";
        animeElement.innerHTML = `
          <img src="${image}" alt="${title}" class="show-pic">
          <h2 class="show-name">${title}</h2>
        `;
        // ? changing from insertAdjacentHTML to create element cause  it doesn't allow for direct event listener attachment
        // ? to the newly added elements. By using document.createElement to create the anime elements as actual DOM elements
        animeElement.addEventListener("click", () => {
          const FetchAnime = animeElement.innerText;
          contentElements.forEach((elements) => {
            elements.classList.add("hidden");
          });
          fetchAnime(FetchAnime);
        });
        container.appendChild(animeElement);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

button.addEventListener("click", fetchAnimeQuoteAndCharacter);
afterSearchBtn.addEventListener("click", fetchAnimeQuoteAndCharacter);

search_button.addEventListener("click", () => {
  const searchQuery = search_input.value;
  container.classList.remove("hidden");
  fetchShows(searchQuery, container);
});
