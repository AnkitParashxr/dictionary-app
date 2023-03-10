let input = document.querySelector("#input");
let searchbtn = document.querySelector("#search");
let notFound = document.querySelector(".not_found");
let defBox = document.querySelector(".def");
let audioBox = document.querySelector(".audio");
let loading = document.querySelector(".loading");
let apiKey = "98e6f7fa-edce-4544-b0f8-14bad7a2962f";

searchbtn.addEventListener("click", function (e) {
  e.preventDefault();

  //clearing previous data

  audioBox.innerHTML = "";
  notFound.innerText = "";
  defBox.innerText = "";

  // get input data
  let word = input.value;
  //alert(word)

  if (word === "") {
    alert("word is required");
    return;
  }

  // call api get data

  getData(word);
});

async function getData(word) {
  loading.style.display = "block";
  //ajax call
  const response = await fetch(
    `https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`
  );

  const data = await response.json();

  // if result is empty or word is not found

  if (data.length == 0) {
    loading.style.display = "block";
    notFound.innerText = "No result found!";
    return;
  }

  // if result is suggestions

  if (typeof data[0] === "string") {
    loading.style.display = "block";
    let heading = document.createElement("h3");
    heading.innerText = "Did you mean?";

    notFound.appendChild(heading);

    // now for adding words suggestions

    data.forEach((element) => {
      let suggestion = document.createElement("span");
      suggestion.classList.add("suggested");
      suggestion.innerText = element;
      // now we append this in notfound
      notFound.appendChild(suggestion);
    });
    return;
  }

  // result found
  loading.style.display = "none";
  let definition = data[0].shortdef[0];
  defBox.innerText = definition;

  // sound
  const soundName = data[0].hwi.prs[0].sound.audio;
  if (soundName) {
    // if sound file is available
    renderSound(soundName);
  }
  //console.log(data);
}

function renderSound(soundName) {
  let subfolder = soundName.charAt(0);

  let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key=${apiKey}`;

  let aud = document.createElement("audio");
  aud.src = soundSrc;
  aud.controls = true;
  audioBox.appendChild(aud);
}
