import "./src/style.css";

document.addEventListener("DOMContentLoaded",async function () {
  // element var
  const district = document.getElementById("district");
  const searchInputEL = document.getElementById("search");
  const searchBtnEl = document.getElementById("search-btn");
  const state = document.getElementById("state");
  const containerEl = document.getElementById("con");
  const institutionTypeEl = document.getElementById("institution");

  // data var
  const BASE_API_KEY = "https://indian-colleges-list.vercel.app/api";
  let collageDataArr = [];
  const allStateArr = await getState();
  const allCollagesArrValue = await getAllCollages(allStateArr);

  console.log(allCollagesArrValue);
  // console.log("hii");
  
  

  // append the state value in a state dropdown values
  async function getState() {
    try {
      const response = await fetch(`${BASE_API_KEY}/institutions/states`);

      if (!response.ok) {
        throw new Error("Network response was not working");
      }

      const data = await response.json();

      // console.log(data.states);
      // allCollageDataArr(data.states)

      data.states.forEach((item) => {
        let option = document.createElement("option");
        option.textContent = `${item.name}`;
        option.value = item.name;

        state.append(option);
      });
      return data.states;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  // onloaded
  getState();

  async function getAllCollages(arr) {

    try {
     const results = [];

     for (const state of arr) {
       const response = await fetch(
         `${BASE_API_KEY}/institutions/states/${state.name}`,
       );

       if (!response.ok) {
        throw new Error("Network response war not ok");
     }
       const data = await response.json();
       results.push(...data.data);
     }
     return results; 
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    
  }

  // search the state name and append the district value
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

      // data is  the object format ,
      // data.data is a array format ,
      // console.log(typeof data);

      collageDataArr = data.data;

      // console.log(collageDataArr);

      //  Array.isArray(data.data);

      renderFn(collageDataArr);

      // this clear inside content of the district tag prevent previous values
      district.innerHTML = "";

      // unique district name using the set method remove the duplicates
      const uniqueDistricts = [
        ...new Set(collageDataArr.map((item) => item.district)),
      ].sort();

      // console.log(uniqueDistricts);

      // district name add to the drop down list

      uniqueDistricts.forEach((dist) => {
        let option = document.createElement("option");

        option.textContent = dist;
        option.value = dist;

        district.append(option);
      });

      // All option add
      const allDistOptionEl = document.createElement("option");
      allDistOptionEl.textContent = "All Districts";
      allDistOptionEl.value = "All";
      allDistOptionEl.selected = true;
      district.prepend(allDistOptionEl);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // result output div
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

  //  district  filter method
  district.addEventListener("change", () => {
    // value is extract the html page
    const districtType = district.value;

    if (districtType === "All") {
      getSearchByState(state.value);
      renderFn(collageDataArr);
    } else {
      const filteredDistrictArr = collageDataArr.filter(
        (college) => college.district == districtType,
      );
      collageDataArr = filteredDistrictArr;
      //  console.log(filteredDistrictArr);
      renderFn(collageDataArr);
    }
  });

  //institution type
  institutionTypeEl.addEventListener("change", () => {
    // value extract in the html page
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

  // search by collage name
  function collageSearchByName() {
    const searchValue = searchInputEL.value.toUpperCase();
    // console.log("fscscst aBctxx ".includes("aBct"));
    const filteredData = allCollagesArrValue.filter((collage) =>
      collage.institute_name.includes(searchValue),
    );
    renderFn(filteredData);
  }

  // input search
  searchBtnEl.addEventListener("click", collageSearchByName);
});
