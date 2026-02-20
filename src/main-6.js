import "./style.css";
document.addEventListener("DOMContentLoaded", async function () {
  // element var
  const districtEl = document.getElementById("district");
  const searchInputEL = document.getElementById("search");
  const searchBtnEl = document.getElementById("search-btn");
  const stateEl = document.getElementById("state");
  const containerEl = document.getElementById("con");
  const institutionTypeEl = document.getElementById("institution");
  const UniversityEl = document.getElementById("University");
  const programmeEl = document.getElementById("programme");

  // data var
  const BASE_API_KEY = "https://indian-colleges-list.vercel.app/api";
  let collageDataArr = [];
  const allStateArr = await getState();

  getState();
  setStatesInOption(allStateArr);

  // append the state value in a state dropdown values
  async function getState() {
    try {
      const response = await fetch(`${BASE_API_KEY}/institutions/states`);

      if (!response.ok) {
        throw new Error("Network response was not working");
      }

      const data = await response.json();
      
      return data.states;
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // set state options to the state dropdown menu
  function setStatesInOption(stateArr) {
    stateArr.forEach((item) => {
      const option = document.createElement("option");
      option.textContent = `${item.name}`;
      option.value = item.name;

      stateEl.append(option);
    });
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
      collageDataArr = data.data;

      renderFn(collageDataArr);

      // this clear inside content of the district tag prevent previous values
      districtEl.innerHTML = "";

      // unique district name using the set method remove the duplicates
      const uniqueDistricts = [
        ...new Set(collageDataArr.map((item) => item.district)),
      ].sort();

      // district name add to the drop down list
      uniqueDistricts.forEach((dist) => {
        const option = document.createElement("option");
        option.textContent = dist;
        option.value = dist;

        districtEl.append(option);

        // this clear inside the content of the university tag prevent previous values
        UniversityEl.innerHTML = "";

        // unique university name using set method to remove the duplicates
        const uniqueUniversity = [
          ...new Set(collageDataArr.map((item) => item.university)),
        ].sort();

        console.log(uniqueUniversity);

        // const filterSameUniversity = uniqueUniversity.map(university => {
        //   switch (university) {
        //     case "Anna University,Chennai-600025"
              
        //       break;
          
        //     default:
        //       break;
        //   }
        // })

        const valuesToRemove = ["NOT APPLICABLE", "NONE", "None", "Self", "SELF"];

        const finalValues = uniqueUniversity.filter(
          (item) => !valuesToRemove.includes(item),
        );

        finalValues.forEach((univ) => {
          let option = document.createElement("option");

          option.textContent = univ;
          option.value = univ;
          UniversityEl.append(option);
        });
      });

      // programme drop add ti
      programmeEl.innerHTML = "";

      const uniqueprogrammes = [
        ...new Set(
          collageDataArr.flatMap((item) =>
            item.programmes.map((p) => p.programme),
          ),
        ),
      ].sort();

      uniqueprogrammes.forEach((prog) => {
        let option = document.createElement("option");

        option.textContent = prog;
        option.value = prog;

        programmeEl.append(option);
      });

      // All option add in dropdown in district
      const allDistOptionEl = document.createElement("option");
      allDistOptionEl.textContent = "All Districts";
      allDistOptionEl.value = "All";
      allDistOptionEl.selected = true;
      districtEl.prepend(allDistOptionEl);

      // All option add in dropdown in programme type
      const AllUniversityOptionEl = document.createElement("option");
      AllUniversityOptionEl.textContent = "All Universities";
      AllUniversityOptionEl.value = "All";
      AllUniversityOptionEl.selected = true;
      UniversityEl.prepend(AllUniversityOptionEl);

      // All option add in dropdown in programme type
      const AllProgrammeOptionEl = document.createElement("option");
      AllProgrammeOptionEl.textContent = "All Programmes";
      AllProgrammeOptionEl.value = "All";
      AllProgrammeOptionEl.selected = true;
      programmeEl.prepend(AllProgrammeOptionEl);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // search college name api
  // async function getApiByCollageName(state = "Tamil Nadu", collageQuery = "sona") {
  //   try {
  //     const API_KEY = `/api/api/institutions/search?state=${encodeURIComponent(state)}&q=${encodeURIComponent(collageQuery)}`;
  //     const response = await fetch(API_KEY);

  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }

  //     const data = await response.json();
  //     console.log(data);

  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // }
  // getApiByCollageName()

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

      const universityEl2 = document.createElement("p");
      universityEl2.textContent = `University: ${collage.university}`;

      const addressEl = document.createElement("p");
      addressEl.textContent = `Address: ${collage.address}`;

      const programmeEl = document.createElement("p");
      programmeEl.textContent = `Programme: ${collage.programmes[0].programme}`;

      // append
      cardEl.append(
        collageNameEl,
        institutionTypeEL,
        stateEl,
        districtEl,
        addressEl,
        universityEl2,
        programmeEl,
      );
      fragment.append(cardEl);
    });

    containerEl.append(fragment);
  }

  // event handling

  // state change
  stateEl.addEventListener("change", function () {
    // search.value = state.value;
    getSearchByState(stateEl.value);
  });

  //  district  filter method
  districtEl.addEventListener("change", () => {
    // value is extract the html page
    const districtType = districtEl.value;

    if (districtType === "All") {
      getSearchByState(stateEl.value);
      renderFn(collageDataArr);
    } else {
      const filteredDistrictArr = collageDataArr.filter(
        (college) => college.district == districtType,
      );
      // collageDataArr = filteredDistrictArr;
      //  console.log(filteredDistrictArr);
      renderFn(filteredDistrictArr);
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

  // search by university
  UniversityEl.addEventListener("change", () => {
    let university = UniversityEl.value;

    if (university === "All") {
      renderFn(collageDataArr);
    } else {
      const filteredData = collageDataArr.filter(
        (collage) => collage.university === university,
      );
      renderFn(filteredData);
    }
  });

  // filter by programme
  programmeEl.addEventListener("change", () => {
    let programmeVal = programmeEl.value;
    if (programmeVal == "All") {
      renderFn(collageDataArr);
    } else {
      const filteredData = collageDataArr.filter((collage) => {

        const hasMatch = collage.programmes.some((programme) => {
          // console.log("programme: ", programme.programme);

          const isMatch = programme.programme === programmeVal;
          // console.log(isMatch);

          return isMatch;
        });

        // console.log("This collage had the course? ", hasMatch);
        // console.log("---------------------------");

        return hasMatch;
      });

      renderFn(filteredData)
    }
  });

  // input search
  searchBtnEl.addEventListener("click", collageSearchByName);

  const allCollagesArrValue = await getAllCollages(allStateArr);

  console.log(allCollagesArrValue);

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

  // search by collage name
  function collageSearchByName() {
    const searchValue = searchInputEL.value.toUpperCase();
    // console.log("fscscst aBctxx ".includes("aBct"));
    const filteredData = allCollagesArrValue.filter((collage) =>
      collage.institute_name.includes(searchValue),
    );
    renderFn(filteredData);
  }
});
