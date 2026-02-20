import "./style.css";

// element var
let search = document.getElementById("search");
let state = document.getElementById("state");
let containerEl = document.getElementById("con");
const institutionTypeEl = document.getElementById("institution");

// data var
const BASE_API_KEY = "https://indian-colleges-list.vercel.app/api";
let collageDataArr = [];

async function getState() {
  try {
    const response = await fetch(`${BASE_API_KEY}/institutions/states`);

    if (!response.ok) {
      throw new Error("Network response was not working");
    }

    const data = await response.json();

    data.states.forEach((item) => {
      let option = document.createElement("option");
      option.textContent = `${item.name}`;
      option.value = item.name;

      state.append(option);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// onloaded
getState();

async function getSearchByState(stateName) {
  try {
    const STATE_API_KEY = `https://indian-colleges-list.vercel.app/api/institutions/states/${stateName}`;

    const response = await fetch(STATE_API_KEY);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // const collageArr = data.data;
    // console.log(collageArr);

    collageDataArr = data.data;
    renderFn(collageDataArr);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getApiByCollageName(state = "Tamil Nadu", collageQuery = "sona") {
  try {
    const API_KEY = `/api/api/institutions/search?state=${encodeURIComponent(state)}&q=${encodeURIComponent(collageQuery)}`;
    const response = await fetch(API_KEY);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);
    
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

getApiByCollageName();

function renderFn(collageData) {
  const fragment = document.createDocumentFragment();
  fragment.replaceChildren();
  containerEl.innerHTML = "";

  collageData.forEach((collage) => {
    const cardEl = document.createElement("div");
    cardEl.className =
      "bg-blue-300 w-full sm:w-87.5 min-h-50 space-y-2 rounded-lg shadow-lg p-5 flex flex-col content-center border border-white/20";

    const collageNameEl = document.createElement("h3");
    collageNameEl.className = "font-semibold text-lg text-center";
    collageNameEl.textContent = collage.institute_name;

    const institutionTypeEL = document.createElement("p");
    institutionTypeEL.textContent = `Institutes Type: ${collage.institution_type}`;

    const stateEl = document.createElement("p");
    stateEl.textContent = `State: ${collage.state}`;

    const districtEl = document.createElement("p");
    districtEl.textContent = `District: ${collage.district}`;

    const addressEl = document.createElement("p");
    addressEl.textContent = `Address: ${collage.address}`;

    // append
    cardEl.append(
      collageNameEl,
      institutionTypeEL,
      stateEl,
      districtEl,
      addressEl,
    );
    fragment.append(cardEl);
  });

  containerEl.append(fragment);
}

// event handling

// state change
state.addEventListener("change", function () {
  // search.value = state.value;
  getSearchByState(state.value);
});

//institution type
institutionTypeEl.addEventListener("change", () => {
  let institutionType = institutionTypeEl.value;
  // console.log(institutionType);

  if (institutionType === "All") {
    renderFn(collageDataArr);
  } else {
    const filteredData = collageDataArr.filter(
      (collage) => collage.institution_type === institutionType,
    );
    // console.log(filteredData);
    renderFn(filteredData);
  }
});

// input search
search.addEventListener("input", function () {
  getSearchByState();
});
