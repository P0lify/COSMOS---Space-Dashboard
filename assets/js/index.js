// Mobile Sidebar
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebar-toggle");

const overlay = document.createElement("div");
overlay.classList.add("sidebar-overlay");

sidebarToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  sidebar.classList.add("sidebar-open");
  document.body.appendChild(overlay);
});

document.addEventListener("click", (e) => {
  if (
    sidebar.classList.contains("sidebar-open") &&
    !sidebar.contains(e.target)
  ) {
    sidebar.classList.remove("sidebar-open");
    overlay.remove();
  }
});
// Links Sidebar
const links = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section");

function resetLinks() {
  links.forEach((link) => {
    link.classList.add("text-slate-300", "hover:bg-slate-800");
    link.classList.remove("bg-blue-500/10", "text-blue-400");
  });
}

links.forEach((link) => {
  link.addEventListener("click", () => {
    resetLinks();
    link.classList.remove("text-slate-300", "hover:bg-slate-800");
    link.classList.add("bg-blue-500/10", "text-blue-400");

    overlay.remove();
    sidebar.classList.remove("sidebar-open");

    sections.forEach((section) => {
      section.classList.add("hidden");

      const targetSectionId = link.getAttribute("data-section");
      const targetSection = document.getElementById(targetSectionId);

      targetSection.classList.remove("hidden");
    });
  });
});
// Formate Date
function formattedDate(dateString) {
  const dateObj = new Date(dateString);

  const dateLong = dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const dateShort = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const time =
    dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }) + " UTC";

  return { dateLong, dateShort, time };
}
// Section: Today In Space
// Api: Today In Space
async function getTodayInSpaceData() {
  try {
    const response = await fetch(
      "https://api.nasa.gov/planetary/apod?api_key=0t49Qt7VEea9MQd9uvZHns330fZtuJLJsGC0Hfkp",
    );

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }

    const data = await response.json();
    displayDataToday(data);
  } catch (error) {
    console.error("Error: ", error);
  }
}
getTodayInSpaceData();
// Display
function displayDataToday(data) {
  const dt = formattedDate(data.date);

  const dateL = dt.dateLong;
  const dateS = dt.dateShort;

  const apodDateInput = document.querySelector("#apod-date-input + span");
  const apodDated = document.getElementById("apod-date");
  const apodImage = document.getElementById("apod-image");
  const apodDateDetail = document.getElementById("apod-date-detail");
  const apodExplanation = document.getElementById("apod-explanation");
  const apodDataInfo = document.getElementById("apod-date-info");
  const apodTitle = document.getElementById("apod-title");

  apodTitle.textContent = data.title;
  apodDated.textContent = `Astronomy Picture of the Day - ${dateL}`;
  apodImage.src = data.url;
  apodDateInput.textContent = dateS;
  apodDateDetail.innerHTML = `<i class="mr-2" data-fa-i2svg=""><svg class="svg-inline--fa fa-calendar" aria-hidden="true" focusable="false" data-prefix="far" data-icon="calendar" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z"></path></svg></i>${dateL}`;
  apodExplanation.textContent = data.explanation;
  apodDataInfo.textContent = dateL;
}
// Section: Launches
// Api: Launches
async function getLaunchesData() {
  try {
    const response = await fetch(
      "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10",
    );

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }

    const data = await response.json();
    featuredLaunch(data.results[0]);
    launchesGrid(data.results.slice(1));
  } catch (error) {
    console.error("Error: ", error);
  }
}
getLaunchesData();
// Big Card
function featuredLaunch(launch) {
  const featuredContainer = document.getElementById("featured-launch");

  const dt = formattedDate(launch.net);

  const date = dt.dateLong;
  const time = dt.time;

  featuredContainer.innerHTML = `
            <div
              class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all"
            >
              <div
                class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              ></div>
              <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
                <div class="flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-3 mb-4">
                      <span
                        class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2"
                      >
                        <i class="fas fa-star"></i>
                        Featured Launch
                      </span>
                      <span
                        class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold"
                      >
                        Go
                      </span>
                    </div>
                    <h3 class="text-3xl font-bold mb-3 leading-tight">
                      ${launch.name}
                    </h3>
                    <div
                      class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400"
                    >
                      <div class="flex items-center gap-2">
                        <i class="fas fa-building"></i>
                        <span>${launch.launch_service_provider.name}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <i class="fas fa-rocket"></i>
                        <span>${launch.rocket.configuration.name}</span>
                      </div>
                    </div>
                    <div
                      class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6"
                    >
                      <i class="fas fa-clock text-2xl text-blue-400"></i>
                      <div>
                        <p class="text-2xl font-bold text-blue-400">2</p>
                        <p class="text-xs text-slate-400">Days Until Launch</p>
                      </div>
                    </div>
                    <div class="grid xl:grid-cols-2 gap-4 mb-6">
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-calendar"></i>
                          Launch Date
                        </p>
                        <p class="font-semibold">${date}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-clock"></i>
                          Launch Time
                        </p>
                        <p class="font-semibold">${time}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-map-marker-alt"></i>
                          Location
                        </p>
                        <p class="font-semibold text-sm">${launch.pad.location.name}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-globe"></i>
                          Country
                        </p>
                        <p class="font-semibold">${launch.pad.country.name}</p>
                      </div>
                    </div>
                    <p class="text-slate-300 leading-relaxed mb-6">
                      ${launch.mission.description}
                    </p>
                  </div>
                  <div class="flex flex-col md:flex-row gap-3">
                    <button
                      class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <i class="fas fa-info-circle"></i>
                      View Full Details
                    </button>
                    <div class="icons self-end md:self-center">
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                      >
                        <i class="far fa-heart"></i>
                      </button>
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                      >
                        <i class="fas fa-bell"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="relative">
                  <div
                    class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50"
                  >
                    <img
                    src="${launch.image?.thumbnail_url}"
                    class="w-full h-full object-cover"
                    onerror="
                      this.onerror = null;
                      this.src = './assets/images/launch-placeholder.png';
                    "
                    alt="${launch.name}"
                    />
                    <div
                      class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
  `;
}
// Small Cards
function launchesGrid(launches) {
  const gridContainer = document.getElementById("launches-grid");

  gridContainer.innerHTML = launches
    .map((launch) => {
      const dt = formattedDate(launch.net);
      const date = dt.dateLong;
      const time = dt.time;

      return `
            <div
              class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer"
            >
              <div
                class="relative h-48 overflow-hidden bg-slate-900/50"
              >
                <img
                  src="${launch.image.image_url}"
                  alt="Falcon 9 Block 5 | Starlink Group 15-25""https://thespacedevs-dev.nyc3.digitaloceanspaces.com/media/images/falcon2520925_image_20221009234147.png""
                  alt="Falcon 9 Block 5 | Starlink Group 15-25"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onerror="
                    this.onerror = null;
                    this.src = './assets/images/launch-placeholder.png';
                  "
                />
                <div class="absolute top-3 right-3">
                  <span
                    class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold"
                  >
                    Go
                  </span>
                </div>
              </div>
              <div class="p-5">
                <div class="mb-3">
                  <h4
                    class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
                  >
                    ${launch.name}
                  </h4>
                  <p class="text-sm text-slate-400 flex items-center gap-2">
                    <i class="fas fa-building text-xs"></i>
                    ${launch.launch_service_provider.name}
                  </p>
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-calendar text-slate-500 w-4"></i>
                    <span class="text-slate-300">${date}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-clock text-slate-500 w-4"></i>
                    <span class="text-slate-300">${time}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-rocket text-slate-500 w-4"></i>
                    <span class="text-slate-300">${launch.rocket.configuration.name}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                    <span class="text-slate-300 line-clamp-1">${launch.pad.location.name}</span>
                  </div>
                </div>
                <div
                  class="flex items-center gap-2 pt-4 border-t border-slate-700"
                >
                  <button
                    class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
                  >
                    Details
                  </button>
                  <button
                    class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <i class="far fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
  `;
    })
    .join("");
}
// Section: Planet
// Api: Planet
async function getPlanetData() {
  try {
    const response = await fetch(
      "https://solar-system-opendata-proxy.vercel.app/api/planets",
    );

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }

    const data = await response.json();
    planetsGrid(data.bodies.slice(0));
    planetsTable(data.bodies.slice(0));
  } catch (error) {
    console.error("Error: ", error);
  }
}
getPlanetData();
// Display Row Planets
function planetsGrid(planets) {
  const planetsGrid = document.getElementById("planets-grid");

  planetsGrid.innerHTML = planets
    .map(
      (planet) =>
        `
        <div
          class="planet-card bg-slate-800/50 border border-slate-700 rounded-2xl p-4 transition-all cursor-pointer group"
          data-planet-id="${planet.id}"
          style="--planet-color: #eab308"
          onmouseover="this.style.borderColor = '#eab30880'"
          onmouseout="this.style.borderColor = '#334155'"
          onclick='displayPlanetDetails(${JSON.stringify(planet)})'
        >
          <div class="relative mb-3 h-24 flex items-center justify-center">
            <img
              class="w-20 h-20 object-contain group-hover:scale-110 transition-transform"
              src="${planet.image}"
              alt="${planet.name}"
            />
          </div>
          <h4 class="font-semibold text-center text-sm">${planet.name}</h4>
          <p class="text-xs text-slate-400 text-center">${planetDistanceInAU(planet)}</p>
        </div>
  `,
    )
    .join("");
}

function planetDistanceInAU(planetObj) {
  if (!planetObj.semimajorAxis) return "N/A";

  const distanceAU = planetObj.semimajorAxis / 149597870.7;

  return `${distanceAU.toFixed(2)} AU`;
}
// Display Planet Details
function displayPlanetDetails(planet) {
  const detailImage = document.getElementById("planet-detail-image");
  if (detailImage && planet.image) {
    detailImage.src = planet.image;
  }

  const detailName = document.getElementById("planet-detail-name");
  if (detailName && planet.name) {
    detailName.textContent = planet.name;
  }

  const detailDescription = document.getElementById(
    "planet-detail-description",
  );
  if (detailDescription && planet.description) {
    detailDescription.textContent = planet.description;
  }

  const semimajorEl = document.getElementById("planet-distance");
  if (semimajorEl && planet.semimajorAxis) {
    semimajorEl.innerText =
      (planet.semimajorAxis / 1000000).toFixed(1) + "M km";
  }

  const radiusEl = document.getElementById("planet-radius");
  if (radiusEl) {
    radiusEl.innerText = planet.meanRadius ? planet.meanRadius + " km" : "N/A";
  }

  const massEl = document.getElementById("planet-mass");
  if (massEl && planet.mass) {
    massEl.innerText = `${planet.mass.massValue} × 10^${planet.mass.massExponent} kg`;
  } else if (massEl) {
    massEl.innerText = "N/A";
  }

  const densityEl = document.getElementById("planet-density");
  if (densityEl) {
    densityEl.innerText = planet.density ? planet.density + " g/cm³" : "N/A";
  }

  const orbitEl = document.getElementById("planet-orbital-period");
  if (orbitEl) {
    orbitEl.innerText = planet.sideralOrbit
      ? planet.sideralOrbit + " days"
      : "N/A";
  }

  const rotationEl = document.getElementById("planet-rotation");
  if (rotationEl) {
    rotationEl.innerText = planet.sideralRotation
      ? planet.sideralRotation + " hours"
      : "N/A";
  }

  const moonsEl = document.getElementById("planet-moons");
  if (moonsEl) {
    moonsEl.innerText = planet.moons ? planet.moons.length : "0";
  }
  const gravityEl = document.getElementById("planet-gravity");
  if (gravityEl) {
    gravityEl.innerText = planet.gravity ? planet.gravity + " m/s²" : "N/A";
  }

  const planetDiscoverer = document.getElementById("planet-discoverer");
  if (planetDiscoverer) {
    planetDiscoverer.innerText = planet.discoveredBy;
  }
  if (planet.discoveredBy === "") {
    planetDiscoverer.innerText = "Known since antiquity";
  }

  const discoveryDate = document.getElementById("planet-discovery-date");
  if (discoveryDate) {
    discoveryDate.innerText = planet.discoveryDate;
  }
  if (planet.discoveryDate === "") {
    discoveryDate.innerText = "Ancient times";
  }

  const bodyType = document.getElementById("planet-body-type");
  if (bodyType) {
    bodyType.innerText = planet.bodyType;
  }
  if (planet.bodyType === "") {
    bodyType.innerText = "Ancient times";
  }

  const planetVolume = document.getElementById("planet-volume");
  if (planetVolume) {
    planetVolume.innerText = `${planet.vol.volValue} × 10^${planet.vol.volExponent} km³`;
  }

  const planetFacts = document.getElementById("planet-facts");
  if (planetFacts) {
    planetFacts.innerHTML = `
                  <li class="flex items-start">
                    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                    <span class="text-slate-300"
                      >"Mass: ${planet.mass.massValue} × 10^${planet.mass.massExponent} kg"</span
                    >
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                    <span class="text-slate-300"
                      >"Surface gravity: ${planet.gravity || "N/A"} m/s²"</span
                    >
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                    <span class="text-slate-300"
                      >"Density: ${planet.density || "N/A"} g/cm³"</span
                    >
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                    <span class="text-slate-300"
                      >"Axial tilt: ${planet.axialTilt || "N/A"}°"</span
                    >
                  </li>
    `;
  }

  const planetPerihelion = document.getElementById("planet-perihelion");
  if (planetPerihelion) {
    planetPerihelion.textContent = planet.perihelion
      ? (planet.perihelion / 1000000).toFixed(1) + "M km"
      : "N/A";
  }
  const planetAphelion = document.getElementById("planet-aphelion");
  if (planetAphelion) {
    planetAphelion.textContent = planet.aphelion
      ? (planet.aphelion / 1000000).toFixed(1) + "M km"
      : "N/A";
  }

  const planetEccentricity = document.getElementById("planet-eccentricity");
  if (planetEccentricity) {
    planetEccentricity.textContent = planet.eccentricity || "N/A";
  }

  const planetInclination = document.getElementById("planet-inclination");
  if (planetInclination) {
    planetInclination.textContent = planet.inclination || "N/A";
  }

  const orbTilt = document.getElementById("planet-axial-tilt");
  if (orbTilt) {
    orbTilt.textContent = planet.axialTilt =
      planet.axialTilt !== undefined ? planet.axialTilt + "°" : "N/A";
  }

  const orbTemp = document.getElementById("planet-temp");
  if (orbTemp) {
    orbTemp.textContent = planet.axialTilt = planet.avgTemp
      ? planet.avgTemp + "°C"
      : "N/A";
  }

  const planetEscape = document.getElementById("planet-escape");
  if (planetEscape) {
    planetEscape.textContent = planet.escape
      ? (planet.escape / 1000).toFixed(2) + " km/s"
      : "N/A";
  }
}
// Display Table
function planetsTable(planets) {
  const planetComparisonTbody = document.getElementById(
    "planet-comparison-tbody",
  );
  planetComparisonTbody.innerHTML = planets
    .map(
      (planet) => `
                      <tr class="hover:bg-slate-800/30 transition-colors">
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10"
                      >
                        <div class="flex items-center space-x-2 md:space-x-3">
                          <img
                            src = "${planet.image}"
                            class="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0"
                          ></img>
                          <span
                            class="font-semibold text-sm md:text-base whitespace-nowrap"
                            >${planet.name}</span
                          >
                        </div>
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${planetDistanceInAU(planet)}
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        4,879
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        0.055
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        88 days
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        0
                      </td>
                      <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        <span
                          class="px-2 py-1 rounded text-xs bg-orange-500/50 text-orange-200"
                          style="background-color: #3b82f680; color: #60a5fa"
                          >${planet.type}</span
                        >
                      </td>
                    </tr>
  
  `,
    )
    .join("");
}
