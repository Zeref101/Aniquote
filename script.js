const container = document.querySelector(".container-4");
const text = document.querySelector(".quote");
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
const container4 = document.querySelector(".container-4");
const container4Subheader = document.querySelector(".container-4-subheader");
const container5 = document.querySelector(".container-5");
const contentElements = document.querySelectorAll("body > *:not(.container-5)");
const animeElements = container4Subheader.querySelectorAll(".anime");
const footer = document.querySelector(".contain");

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
          charName.textContent = "-" + characterName;
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      console.error(error);
    });
}
function fetchAnime(animeTitle, container5) {
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
                      genres
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

      // ! BANNER WORK
      const parentBanner = document.createElement("div");
      parentBanner.classList.add("banner");
      const banner = document.createElement("img");
      banner.src = animeBackground;
      banner.classList.add("banner-img");
      parentBanner.appendChild(banner);
      container5.appendChild(parentBanner);

      // ! SUMMARY AND IMAGE WORK
      const infoContent = document.createElement("div");
      infoContent.classList.add("information-image-content");

      // ? ANIME SUMMARY
      const summary = document.createElement("div");
      const strong = document.createElement("p");
      strong.innerHTML = animeSynopsis;
      strong.classList.add("information-c5");
      summary.appendChild(strong);

      // ? ANIME IMAGE
      const divImg = document.createElement("div");
      const container5IMG = document.createElement("img");
      container5IMG.src = animeImage;
      container5IMG.classList.add("image-c5");
      divImg.classList.add("search-size");
      divImg.appendChild(container5IMG);

      // ! ADDING THE IMAGE AND SUMMARY TO infoContent
      infoContent.appendChild(divImg);
      infoContent.appendChild(summary);

      // * ADDING infoContent TO CONTAINER
      const tempContent2 = document.createElement("div");
      tempContent2.classList.add("space-between-two-containers");
      const header = document.createElement("div");
      header.classList.add("header");
      const sense = document.createElement("div");
      sense.classList.add("sense");
      header.appendChild(sense);
      header.appendChild(infoContent);
      container5.appendChild(header);
      container5.appendChild(tempContent2);

      // !ADDING OTHER INFORMATIONS
      const otherInfoMain = document.createElement("div");
      otherInfoMain.classList.add("container-other-info");
      // ! (START DATE)
      const sDate = document.createElement("div");
      const span1 = document.createElement("span");
      span1.classList.add("other-info-heading");
      const span1_2 = document.createElement("span");
      span1.innerHTML = "Release Date";
      if (data.data.Media.startDate) {
        const monthName = new Date(
          Date.UTC(2000, data.data.Media.startDate.month - 1, 1)
        ).toLocaleString("default", { month: "long" });
        span1_2.innerHTML = `${monthName} ${data.data.Media.startDate.day},${data.data.Media.startDate.year}`;
      } else {
        span1_2.innerHTML = "Unknown";
      }
      sDate.appendChild(span1);
      sDate.appendChild(span1_2);

      // ! END DATE

      const eDate = document.createElement("div");
      const span2 = document.createElement("span");
      span2.classList.add("other-info-heading");
      const span2_2 = document.createElement("span");
      span2.innerHTML = "End Date";
      if (data.data.Media.endDate) {
        const monthName = new Date(
          Date.UTC(2000, data.data.Media.endDate.month - 1, 1)
        ).toLocaleString("default", { month: "long" });
        span2_2.innerHTML = `${monthName} ${data.data.Media.endDate.day}, ${data.data.Media.endDate.year}`;
      } else {
        span2_2.innerHTML = "Unknown";
      }
      eDate.appendChild(span2);
      eDate.appendChild(span2_2);

      // ! STATUS
      const status = document.createElement("div");
      const span3 = document.createElement("span");
      span3.classList.add("other-info-heading");
      const span3_2 = document.createElement("span");
      span3.innerHTML = "Status";
      span3_2.innerHTML = data.data.Media.status;
      status.appendChild(span3);
      status.appendChild(span3_2);

      // ! POPULARITY
      const popularity = document.createElement("div");
      const span4 = document.createElement("span");
      span4.classList.add("other-info-heading");
      const span4_2 = document.createElement("span");
      span4.innerHTML = "Popularity";
      span4_2.innerHTML = data.data.Media.popularity;
      popularity.appendChild(span4);
      popularity.appendChild(span4_2);

      // ! GENRES
      const genre = document.createElement("div");
      const span6 = document.createElement("span");
      const span6_2 = document.createElement("span");
      span6.classList.add("other-info-heading");
      span6.innerHTML = "Genres";
      span6_2.innerHTML = data.data.Media.genres.join(", ");
      genre.appendChild(span6);
      genre.appendChild(span6_2);

      // ! CHARACTERS
      const cast = document.createElement("div");
      const span5 = document.createElement("span");
      const span5_2 = document.createElement("span");
      cast.classList.add("cast");
      span5_2.classList.add("cast2");
      span5.innerHTML = "Cast";
      const characters = data.data.Media.characters.edges;
      if (characters.length > 0) {
        characters.forEach((character) => {
          const characterName = character.node.name.full;
          // const role = character.role;
          const characterImage = character.node.image.large;
          const characterDiv = document.createElement("div");
          characterDiv.classList.add("characterDiv");
          const characterImg = document.createElement("img");
          characterImg.classList.add("characterImg");
          const characterSpan = document.createElement("span");
          characterSpan.classList.add("characterSpan");
          characterImg.src = characterImage;
          characterSpan.innerHTML = `${characterName}`;
          characterDiv.appendChild(characterImg);
          const charSpanName = document.createElement("div");
          charSpanName.classList.add("characters-cast");
          charSpanName.appendChild(characterSpan);
          characterDiv.appendChild(charSpanName);
          span5_2.appendChild(characterDiv);
        });
      } else {
        span5_2.innerHTML = "Unknown";
      }
      cast.appendChild(span5);
      cast.appendChild(span5_2);
      // !==========================================================
      // ? RESET BUTTON
      // const resetButton = document.createElement("button");
      // resetButton.classList.add("btn");
      // resetButton.classList.add("button-js");
      // const resetButtonParent = document.createElement("div");
      // resetButton.innerHTML = "Home";
      // resetButtonParent.style.width = "2.35%";
      // resetButtonParent.style.paddingBottom = "20px";
      // resetButtonParent.appendChild(resetButton);
      // container5.appendChild(resetButtonParent);
      // resetButton.addEventListener("click", () => {
      //   container5.innerHTML = "";
      //   contentElements.forEach((elements) => {
      //     elements.classList.remove("hidden");
      //   });
      //   container5.classList.add("hidden");
      //   container4.classList.add("hidden");
      //   afterSearch.classList.add("hidden");
      // });
      // !==========================================================

      // * ADDING ALL THE OTHER INFOS INTO otherInfoMain
      otherInfoMain.appendChild(sDate);
      otherInfoMain.appendChild(eDate);
      otherInfoMain.appendChild(status);
      otherInfoMain.appendChild(popularity);
      otherInfoMain.appendChild(genre);
      container5.appendChild(otherInfoMain);
      const tempContent = document.createElement("div");
      tempContent.classList.add("space-between-two-containers");
      container5.appendChild(tempContent);
      container5.appendChild(cast);
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
            container5.classList.remove("hidden");
          });
          fetchAnime(FetchAnime, container5);
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
