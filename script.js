const container = document.querySelector(".container");
const text = document.querySelector(".text");
const back = document.querySelector(".back");
const search_input = document.querySelector(".search-input");
const search_button = document.querySelector(".search-output");
const first = document.querySelector(".container");

// ! FETCHING ANIME QUOTE AND CHARACTER NAME
//* ------------------------------------------------------------------------------------
const fetchPromise = fetch("https://animechan.vercel.app/api/random");
fetchPromise
  .then((response) => response.json())
  .then((character) => {
    const quote = `${character.character} once said ${character.quote}`;
    text.textContent = quote;
    const characterName = character.character;
    const animeTitle = character.anime;
    console.log(animeTitle);

    // ! FETCHING CHARACTER IMAGE AND APPENDING THE CHILD TO CONTAINER
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
        // use the character image URL to display the image on your website
        const img = document.createElement("img");
        img.src = characterImage;
        img.classList.add("size");
        container.appendChild(img);
//* ------------------------------------------------------------------------------------
        // ! FETCHING ANIME SYNOPSIS AND ANIME BACKGROUND FOR THE MORE INFORMATION ON THIS ANIME FEATURE
        // ! ADDITIONAL FEATURES:
        // ! STARTDATE,ENDATE,STATUS,POPULARITY,NEXT AIRING EPISODE, EPISODES,DURATION,CHARACTERS(NAME,IMAGE URL), STUDIO,GENRES,SOURCE
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
            const img = document.createElement('img');
            img.src = animeBackground;
            back.appendChild(img);

            // use the title, image, and synopsis to display the information on your website
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  })
  .catch((error) => {
    console.error(error);
  });
  function fetchAnime(search, container) {
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
        container.innerHTML = ""; // clear the container before adding new elements
        animeList.forEach((anime) => {
          const title = anime.title.romaji || anime.title.english || anime.title.native;
          const image = anime.coverImage.large;
          const genres = anime.genres.join(", ");
          // const description = anime.description;
          const animeElement = `
            <div class="anime" style="color: aliceblue;" >
              <img src="${image}" alt="${title}" class = "container_child">
              <h2>${title}</h2>
              <p><strong>Genres:</strong> ${genres}</p>
  
            </div>
          `;
  
          container.insertAdjacentHTML("beforeend", animeElement);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }


search_button.addEventListener('click',()=>{
  first.classList.add("container"); //? added
  const searchQuery = search_input.value;
  fetchAnime(searchQuery);
})
