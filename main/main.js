import "../style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { models } from "./models";
import { questions } from "./questions";
import gsap from "gsap";

import { GUI } from "dat.gui";
import * as lilGui from "lil-gui";

const modelScenes = [];
let modelsLoaded = 0;
let currentModelIndex = -1;
let currentModel;
let detailsModel;
const detailsOpened = {};
let hasHelp = false;
let currentQuestionIndex = 0;

// Html Elements
const canvas = document.querySelector(".canvas");

const introPage = document.getElementById("intro-page");
const introPageButton = document.getElementById("intro-page-button");

const lettersPage = document.getElementById("letters-page");
lettersPage.classList.add("hide");
const lettersPageButton = document.getElementById("letters-page-button");

const artsPage = document.getElementById("arts-page");
artsPage.classList.add("hide");
const artsPageButton = document.getElementById("arts-page-button");

const congratsPage = document.getElementById("congrats-page");
congratsPage.classList.add("hide");

const congratsPageTextWithHelp = document.getElementById(
  "congrats-page-text-with-help"
);
congratsPageTextWithHelp.classList.add("hide");
const congratsPageTextWithoutHelp = document.getElementById(
  "congrats-page-text-without-help"
);
congratsPageTextWithoutHelp.classList.add("hide");

const congratsPageExitButton = document.getElementById(
  "congrats-page-exit-button"
);
const congratsPageExercisesButton = document.getElementById(
  "congrats-page-exercises-button"
);

//exercises page
const exercisesPage = document.getElementById("exercises-page");
exercisesPage.classList.add("hide");
const exercisesPageMain = document.getElementById("exercises-page-main");
const exercisesPageText = document.getElementById("exercises-page-text");
const exercisesPageHelpButton = document.getElementById(
  "exercises-page-help-button"
);
exercisesPageHelpButton.classList.add("hide");
const exercisesPageNextButton = document.getElementById(
  "exercises-page-next-button"
);
const exercisesPageHelp = document.getElementById("exercises-page-help");
exercisesPageHelp.classList.add("hide");
const exercisesPageHelpText = document.getElementById(
  "exercises-page-help-text"
);
const exercisesPageExitHelpButton = document.getElementById(
  "exercises-page-exithelp-button"
);

const exercisesPageResult = document.getElementById("exercises-page-result");
exercisesPageResult.classList.add("hide");
const exercisesPageResultComment = document.getElementById(
  "exercises-page-result-comment"
);
const exercisesPageResultScore = document.getElementById(
  "exercises-page-result-score"
);
const exercisesPageResultScoreCircle = document.getElementById(
  "exercises-page-result-score-circle"
);

const exercisesPageResultExitButton = document.getElementById(
  "exercises-page-exitresult-button"
);

const content = document.getElementById("content");

const controlButtons = document.getElementById("control-buttons");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
previous.classList.add("hide");

const tooltip = document.getElementById("tooltip");
tooltip.classList.add("hide");
const statueName = document.getElementById("statue-name");
const statueDescription = document.getElementById("statue-description");
const showDetailsButton = document.getElementById("show-details");

const details = document.getElementById("details-wrapper");
details.classList.add("hide");
const detailsTitle = document.getElementById("details-title");
const detailsText = document.getElementById("details-text");
const detailsExtraUrl = document.getElementById("details-extra-url");
const detailsExitButton = document.getElementById("details-exit");

const s = document.getElementById("scene");
const element = document.createElement("div");
element.className = "list-item";
const sceneElement = document.createElement("div");
element.appendChild(sceneElement);
s.appendChild(element);

// Scene
const scene = new THREE.Scene();
const scene3 = new THREE.Scene();
scene3.userData.element = sceneElement;
scene3.background = new THREE.Color(0x0a192f);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(6.900846884604462, 2.6, 5.955925746783378);
camera.rotation.set(
  -0.26072026619867955,
  0.8417175855137602,
  0.1964060206240192
);

// Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Functions to move and rotate the camera
function cameraMovement(x, y, z) {
  gsap.to(camera.position, {
    x,
    y,
    z,
    duration: 0.7,
  });
}
function cameraRotation(x, y, z) {
  gsap.to(camera.rotation, {
    x,
    y,
    z,
    duration: 0.7,
  });
}

//event listeners

introPageButton.addEventListener("click", (e) => {
  if (modelsLoaded >= models.length + 1) introPage.classList.add("hide");
});
next.addEventListener("click", (e) => {
  tooltip.classList.add("hide");

  if (
    currentModelIndex !== -1 &&
    currentModelIndex !== 6 &&
    currentModelIndex !== models.length - 1
  ) {
    currentModelIndex = currentModelIndex + 1;
    currentModel = models[currentModelIndex];
    const camPos = currentModel.cameraPosition;
    const camRot = currentModel.cameraRotation;
    cameraMovement(camPos.x, camPos.y, camPos.z);
    cameraRotation(camRot.x, camRot.y, camRot.z);
    setTimeout(() => {
      statueName.textContent = currentModel.name;
      statueDescription.textContent = currentModel.miniDescription;
      tooltip.classList.remove("hide");
    }, 700);
  } else if (currentModelIndex === -1) {
    lettersPage.classList.remove("hide");
  } else if (currentModelIndex === 6) {
    artsPage.classList.remove("hide");
  } else if (currentModelIndex === models.length - 1) {
    if (Object.keys(detailsOpened).length === models.length) {
      hasHelp = true;
    }
    console.log(detailsOpened);
    console.log(Object.keys(detailsOpened).length === models.length);
    if (hasHelp) {
      congratsPageTextWithHelp.classList.remove("hide");
      congratsPageTextWithoutHelp.classList.add("hide");
    } else {
      congratsPageTextWithHelp.classList.add("hide");
      congratsPageTextWithoutHelp.classList.remove("hide");
    }
    congratsPage.classList.remove("hide");
  }

  if (currentModelIndex <= models.length - 1) {
    if (currentModelIndex < 0) {
      next.textContent = "Ξεκίνα την περιήγηση!";
      previous.classList.add("hide");
    } else if (currentModelIndex === 0) {
      previous.textContent = "Επιστροφή στην αρχή!";
      previous.classList.remove("hide");
      next.textContent = "Επόμενο";
    } else {
      previous.textContent = "Προηγούμενο";
      next.textContent = "Επόμενο";
    }

    if (currentModelIndex === models.length - 1) {
      next.textContent = "Τέλος!";
    }
  }
});

congratsPageExitButton.addEventListener("click", (e) => {
  congratsPage.classList.add("hide");
  next.textContent = "Τέλος!";
  cameraMovement(6.900846884604462, 2.6, 5.955925746783378);
  cameraRotation(-0.26072026619867955, 0.8417175855137602, 0.1964060206240192);
  next.textContent = "Ξεκίνα την περιήγηση!";
  previous.classList.add("hide");
  currentModelIndex = -1;
});
exercisesPageText.innerHTML = questions[currentQuestionIndex].innerHtml;

congratsPageExercisesButton.addEventListener("click", (e) => {
  congratsPage.classList.add("hide");
  exercisesPage.classList.remove("hide");
  exercisesPageText.innerHTML = questions[currentQuestionIndex].innerHtml;
  hasHelp && exercisesPageHelpButton.classList.remove("hide");
});

exercisesPageNextButton.addEventListener("click", (e) => {
  hasHelp && exercisesPageHelpButton.classList.remove("hide");
  const answer = document.querySelector(
    'input[name="selector"]:checked'
  )?.value;
  questions[currentQuestionIndex].givenAnswer = answer;

  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length - 1) {
    exercisesPageText.innerHTML = questions[currentQuestionIndex].innerHtml;
  } else if (currentQuestionIndex === questions.length - 1) {
    exercisesPageText.innerHTML = questions[currentQuestionIndex].innerHtml;
    exercisesPageNextButton.textContent = "Υποβολή";
  } else {
    exercisesPageMain.classList.add("hide");
    exercisesPageResult.classList.remove("hide");

    const wrongAnswers = questions.filter(
      (q) => q.rightAnswer !== q.givenAnswer
    );

    exercisesPageResultScore.textContent = (10 - wrongAnswers.length) * 10;
    exercisesPageResultScoreCircle.style.strokeDashoffset = `calc(440 - (440 * ${
      (10 - wrongAnswers.length) * 10
    }) / 100)`;
    exercisesPageResultComment.innerHTML =
      wrongAnswers.length === 0
        ? `Συγχαρητήρια! Φαίνεται πως έδωσες προσοχή σε όλα τα εκθέματα!`
        : `Μπράβο που ολοκλήρωσες την άσκηση! Σου προτείνω να ξαναδείς τα εκθέματα <b> ${[
            ...new Set(wrongAnswers.map((wa) => wa.relevantMuseumPart)),
          ].join(", ")}</b>, για να βελτιώσεις κι άλλο τις γνώσεις σου!`;
  }
});

exercisesPageHelpButton.addEventListener("click", (e) => {
  exercisesPageMain.classList.add("hide");
  exercisesPageHelp.classList.remove("hide");
  exercisesPageHelpText.textContent = questions[currentQuestionIndex].help;
});

exercisesPageExitHelpButton.addEventListener("click", (e) => {
  exercisesPageMain.classList.remove("hide");
  exercisesPageHelp.classList.add("hide");
  exercisesPageHelpButton.classList.add("hide");
  hasHelp = false;
});

exercisesPageResultExitButton.addEventListener("click", (e) => {
  exercisesPage.classList.add("hide");
  next.textContent = "Τέλος!";
  cameraMovement(6.900846884604462, 2.6, 5.955925746783378);
  cameraRotation(-0.26072026619867955, 0.8417175855137602, 0.1964060206240192);
  next.textContent = "Ξεκίνα την περιήγηση!";
  previous.classList.add("hide");
  currentModelIndex = -1;
});

lettersPageButton.addEventListener("click", (e) => {
  lettersPage.classList.add("hide");
  currentModelIndex = currentModelIndex + 1;
  currentModel = models[currentModelIndex];
  const camPos = currentModel.cameraPosition;
  const camRot = currentModel.cameraRotation;
  cameraMovement(camPos.x, camPos.y, camPos.z);
  cameraRotation(camRot.x, camRot.y, camRot.z);
  previous.textContent = "Επιστροφή στην αρχή!";
  previous.classList.remove("hide");
  next.textContent = "Επόμενο";
  setTimeout(() => {
    statueName.textContent = currentModel.name;
    statueDescription.textContent = currentModel.miniDescription;
    tooltip.classList.remove("hide");
  }, 700);
});

artsPageButton.addEventListener("click", (e) => {
  artsPage.classList.add("hide");
  currentModelIndex = currentModelIndex + 1;
  currentModel = models[currentModelIndex];
  const camPos = currentModel.cameraPosition;
  const camRot = currentModel.cameraRotation;
  cameraMovement(camPos.x, camPos.y, camPos.z);
  cameraRotation(camRot.x, camRot.y, camRot.z);
  setTimeout(() => {
    statueName.textContent = currentModel.name;
    statueDescription.textContent = currentModel.miniDescription;
    tooltip.classList.remove("hide");
  }, 700);
});

previous.addEventListener("click", (e) => {
  tooltip.classList.add("hide");

  currentModelIndex = currentModelIndex - 1;
  if (currentModelIndex < 0) {
    next.textContent = "Ξεκίνα την περιήγηση!";
    previous.classList.add("hide");
    cameraMovement(6.900846884604462, 2.6, 5.955925746783378);
    cameraRotation(
      -0.26072026619867955,
      0.8417175855137602,
      0.1964060206240192
    );
  } else {
    if (currentModelIndex === 0) {
      previous.textContent = "Επιστροφή στην αρχή!";
    } else {
      next.textContent = "Επόμενο";
      previous.classList.remove("hide");
      previous.textContent = "Προηγούμενο";
    }

    currentModel = models[currentModelIndex];

    const camPos = currentModel.cameraPosition;
    const camRot = currentModel.cameraRotation;

    cameraMovement(camPos.x, camPos.y, camPos.z);
    cameraRotation(camRot.x, camRot.y, camRot.z);

    setTimeout(() => {
      statueName.textContent = currentModel.name;
      statueDescription.textContent = currentModel.miniDescription;
      tooltip.classList.remove("hide");
    }, 700);
  }
});

showDetailsButton.addEventListener("click", (e) => {
  controlButtons.classList.add("hide");
  tooltip.classList.add("hide");
  detailsTitle.textContent = currentModel.name;
  detailsText.textContent = currentModel.description;
  detailsExtraUrl.href = currentModel.extraInfo;
  details.classList.remove("hide");

  detailsOpened[currentModelIndex] = true;

  const light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(1, 1, 1);

  const camera3 = new THREE.PerspectiveCamera(50, 1, 1, 10);
  camera3.position.z = 5;
  scene3.userData.camera = camera3;

  const currentModelScene = modelScenes[currentModelIndex];
  detailsModel = currentModelScene.clone();

  detailsModel.position.set(
    currentModel?.detailsPosition?.x || 0,
    currentModel?.detailsPosition?.y || 0,
    currentModel?.detailsPosition?.z || 0
  );
  detailsModel.rotation.set(
    currentModel?.detailsRotation?.x || 0,
    currentModel?.detailsRotation?.y || 0,
    currentModel?.detailsRotation?.z || 0
  );
  currentModel?.detailsScale &&
    detailsModel.scale.set(
      currentModel?.detailsScale?.x,
      currentModel?.detailsScale?.y,
      currentModel?.detailsScale?.z
    );

  // const gui = new lilGui.GUI();
  // //add the camera to the GUI

  // gui
  //   .add(detailsModel.scale, "x")
  //   .min(-100)
  //   .max(100)
  //   .step(0.00000000000000000000000000000000000000001)
  //   .name("Model X Axis scale");
  // gui
  //   .add(detailsModel.scale, "y")
  //   .min(-100)
  //   .max(100)
  //   .step(0.00000000000000000000000000000000000000001)
  //   .name("Model Y Axis scale");
  // gui
  //   .add(detailsModel.scale, "z")
  //   .min(-100)
  //   .max(100)
  //   .step(0.00000000000000000000000000000000000000001)
  //   .name("Model Z Axis scale");
  // gui
  //   .add(detailsModel.position, "x")
  //   .min(-100)
  //   .max(100)
  //   .step(0.00000000000000000000000000000000000000001)
  //   .name("Model X Axis Position");
  // gui
  //   .add(detailsModel.position, "y")
  //   .min(-100)
  //   .max(100)
  //   .step(0.00000000000000000000000000000000000000001)
  //   .name("Model Y Axis Position");
  // gui
  //   .add(detailsModel.position, "z")
  //   .min(-100)
  //   .max(100)
  //   .step(0.00000000000000000000000000000000000000001)
  //   .name("Model Z Axis Position");

  // gui
  //   .add(detailsModel.rotation, "x")
  //   .min(-100)
  //   .max(100)
  //   .step(0.00000000000000000000000000000000000000001)
  //   .name("Model X Axis rotation");
  // gui
  //   .add(detailsModel.rotation, "y")
  //   .min(-100)
  //   .max(100)
  //   .step(0.00000000000000000000000000000000000000001)
  //   .name("Model Y Axis rotation");
  // gui
  //   .add(detailsModel.rotation, "z")
  //   .min(-100)
  //   .max(100)
  //   .step(0.00000000000000000000000000000000000000001)
  //   .name("Model Z Axis rotation");
  const controls = new OrbitControls(
    scene3.userData.camera,
    scene3.userData.element
  );
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;
  controls.maxPolarAngle = Math.PI / 2;
  scene3.userData.controls = controls;

  scene3.add(detailsModel);
  scene3.add(light);
  renderer.setAnimationLoop(animate2); // this is the same as requestAnimationFrame(animate). It will call the animate function over and over again on every frame.
  animate2();
});

detailsExitButton.addEventListener("click", (e) => {
  controlButtons.classList.remove("hide");
  tooltip.classList.remove("hide");
  details.classList.add("hide");
  for (var i = scene3.children.length - 1; i >= 0; i--) {
    var obj = scene3.children[i];
    scene3.remove(obj);
  }

  renderer.setAnimationLoop(animate); // this is the same as requestAnimationFrame(animate). It will call the animate function over and over again on every frame.
  animate();
});

window.addEventListener("resize", () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
});

// const gui = new lilGui.GUI();
// //add the camera to the GUI

// gui
//   .add(camera.rotation, "x")
//   .min(-100)
//   .max(100)
//   .step(0.00000000000000000000000000000000000000001)
//   .name("Model X Axis rotation");
// gui
//   .add(camera.rotation, "y")
//   .min(-100)
//   .max(100)
//   .step(0.00000000000000000000000000000000000000001)
//   .name("Model Y Axis rotation");
// gui
//   .add(camera.rotation, "z")
//   .min(-100)
//   .max(100)
//   .step(0.00000000000000000000000000000000000000001)
//   .name("Model Z Axis rotation");
// gui
//   .add(camera.position, "x")
//   .min(-100)
//   .max(100)
//   .step(0.00000000000000000000000000000000000000001)
//   .name("Model X Axis Position");
// gui
//   .add(camera.position, "y")
//   .min(-100)
//   .max(100)
//   .step(0.00000000000000000000000000000000000000001)
//   .name("Model Y Axis Position");
// gui
//   .add(camera.position, "z")
//   .min(-100)
//   .max(100)
//   .step(0.00000000000000000000000000000000000000001)
//   .name("Model Z Axis Position");

window.addEventListener("mouseup", (e) => {
  console.log(detailsModel?.position);
  console.log(detailsModel?.rotation);
  // camera.position.set(9.36, 0.6, -2.6216304054672643);
  // camera.rotation.set(2.405195588750891, 1.321531210329145, 2.420790616484844);
});

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);

const light = new THREE.AmbientLight(0x404040);
light.position.set(20, 10, 10);
scene.add(light);
scene3.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const plight = new THREE.PointLight(0xff0000, 1, 100);
plight.position.set(150, 50, 50);
scene.add(plight);
const data111 = {
  color: plight.color.getHex(),
  mapsEnabled: true,
};
// const gui111 = new GUI();
// const lightFolder111 = gui111.addFolder("THREE.Light11");
// lightFolder111.addColor(data111, "color").onChange(() => {
//   plight.color.setHex(Number(data111.color.toString().replace("#", "0x")));
// });
// lightFolder111.add(plight, "intensity", 0, Math.PI * 2, 0.01);

// const directionalLightFolder111 = gui111.addFolder("THREE.DirectionalLight11");
// directionalLightFolder111.add(plight.position, "x", -100, 100, 0.01);
// directionalLightFolder111.add(plight.position, "y", -100, 100, 0.01);
// directionalLightFolder111.add(plight.position, "z", -100, 100, 0.01);
// directionalLightFolder111.open();

const dirLight11 = new THREE.DirectionalLight(0xffffff, Math.PI);
const helper11 = new THREE.DirectionalLightHelper(dirLight11, 5);
scene.add(helper11);
// dirLight11.position.set(-88.2, 1, 0);
dirLight11.position.set(-88.2, 46.87, 18.27);

scene.add(dirLight11);

const data11 = {
  color: dirLight11.color.getHex(),
  mapsEnabled: true,
};

// const gui11 = new GUI();
// const lightFolder11 = gui11.addFolder("THREE.Light11");
// lightFolder11.addColor(data11, "color").onChange(() => {
//   dirLight11.color.setHex(Number(data11.color.toString().replace("#", "0x")));
// });
// lightFolder11.add(dirLight11, "intensity", 0, Math.PI * 2, 0.01);

// const directionalLightFolder11 = gui11.addFolder("THREE.DirectionalLight11");
// directionalLightFolder11.add(dirLight11.position, "x", -100, 100, 0.01);
// directionalLightFolder11.add(dirLight11.position, "y", -100, 100, 0.01);
// directionalLightFolder11.add(dirLight11.position, "z", -100, 100, 0.01);
// directionalLightFolder11.open();

const dirLight1 = new THREE.DirectionalLight(0xffffff, Math.PI);
const helper1 = new THREE.DirectionalLightHelper(dirLight1, 5);
scene.add(helper1);
dirLight1.position.set(100, -50, 85.59);
scene.add(dirLight1);

const data1 = {
  color: dirLight1.color.getHex(),
  mapsEnabled: true,
};

// const gui1 = new GUI();
// const lightFolder1 = gui1.addFolder("THREE.Light1");
// lightFolder1.addColor(data1, "color").onChange(() => {
//   dirLight1.color.setHex(Number(data1.color.toString().replace("#", "0x")));
// });
// lightFolder1.add(dirLight1, "intensity", 0, Math.PI * 2, 0.01);

// const directionalLightFolder1 = gui1.addFolder("THREE.DirectionalLight1");
// directionalLightFolder1.add(dirLight1.position, "x", -100, 100, 0.01);
// directionalLightFolder1.add(dirLight1.position, "y", -100, 100, 0.01);
// directionalLightFolder1.add(dirLight1.position, "z", -100, 100, 0.01);
// directionalLightFolder1.open();

const dirLight = new THREE.DirectionalLight(0xffffff, Math.PI);
const helper = new THREE.DirectionalLightHelper(dirLight, 5);
scene.add(helper);
dirLight.position.set(28.39, 83.39, -100);
scene.add(dirLight);

const data = {
  color: dirLight.color.getHex(),
  mapsEnabled: true,
};
// const gui = new GUI();
// const lightFolder = gui.addFolder("THREE.Light");
// lightFolder.addColor(data, "color").onChange(() => {
//   dirLight.color.setHex(Number(data.color.toString().replace("#", "0x")));
// });
// lightFolder.add(dirLight, "intensity", 0, Math.PI * 2, 0.01);

// const directionalLightFolder = gui.addFolder("THREE.DirectionalLight");
// directionalLightFolder.add(dirLight.position, "x", -100, 100, 0.01);
// directionalLightFolder.add(dirLight.position, "y", -100, 100, 0.01);
// directionalLightFolder.add(dirLight.position, "z", -100, 100, 0.01);
// directionalLightFolder.open();

const init = () => {
  // gltf Loader
  const gltfLoader = new GLTFLoader();

  gltfLoader.load("/model/museum/scene.gltf", (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    modelsLoaded++;
    if (modelsLoaded >= models.length + 1) {
      introPageButton.textContent = "Είσοδος!";
      introPageButton.style.opacity = 1;
      introPageButton.style.cursor = "pointer";
    }
  });

  models.forEach((m, i) => {
    gltfLoader.load(m.url, (gltf) => {
      const model = gltf.scene;
      model.scale.set(m.scale.x, m.scale.y, m.scale.z);
      model.position.set(m.position.x, m.position.y, m.position.z);
      model.rotation.set(m.rotation.x, m.rotation.y, m.rotation.z);
      scene.add(model);
      modelScenes[i] = model;
      modelsLoaded++;
      if (modelsLoaded >= models.length + 1) {
        introPageButton.textContent = "Είσοδος!";
        introPageButton.style.opacity = 1;
        introPageButton.style.cursor = "pointer";
      }
      // const gui111 = new GUI();
      // const lightFolder111 = gui111.addFolder("THREE.Light11");
      // lightFolder111.addColor(data111, "color").onChange(() => {
      //   plight.color.setHex(Number(data111.color.toString().replace("#", "0x")));
      // });
      // lightFolder111.add(plight, "intensity", 0, Math.PI * 2, 0.01);

      // const directionalLightFolder111 = gui111.addFolder(
      //   "THREE.DirectionalLight11"
      // );
      // directionalLightFolder111.add(model.position, "x", -100, 100, 0.01);
      // directionalLightFolder111.add(model.position, "y", -100, 100, 0.01);
      // directionalLightFolder111.add(model.position, "z", -100, 100, 0.01);
      // directionalLightFolder111.open();

      // GUI Configurator
      // const gui = new lilGui.GUI();
      // //add the camera to the GUI

      // gui
      //   .add(model.rotation, "x")
      //   .min(-100)
      //   .max(100)
      //   .step(0.00000000000000000000000000000000000000001)
      //   .name("Model X Axis rotation");
      // gui
      //   .add(model.rotation, "y")
      //   .min(-100)
      //   .max(100)
      //   .step(0.00000000000000000000000000000000000000001)
      //   .name("Model Y Axis rotation");
      // gui
      //   .add(model.rotation, "z")
      //   .min(-100)
      //   .max(100)
      //   .step(0.00000000000000000000000000000000000000001)
      //   .name("Model Z Axis rotation");
      // gui
      //   .add(model.position, "x")
      //   .min(-100)
      //   .max(100)
      //   .step(0.00000000000000000000000000000000000000001)
      //   .name("Model X Axis Position");
      // gui
      //   .add(model.position, "y")
      //   .min(-100)
      //   .max(100)
      //   .step(0.00000000000000000000000000000000000000001)
      //   .name("Model Y Axis Position");
      // gui
      //   .add(model.position, "z")
      //   .min(-100)
      //   .max(100)
      //   .step(0.00000000000000000000000000000000000000001)
      //   .name("Model Z Axis Position");
    });
  });
};

init();

// Animation and loop
const animate = () => {
  renderer.autoClear = false; // important!
  renderer.clear();
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  renderer.clearDepth(); // important! clear the depth buffer
  renderer.setClearColor(0xffffff, 0);
  renderer.render(scene, camera);
  // controls.update();
};

// Animation and loop
const animate2 = () => {
  detailsModel.rotation.y += 0.01;

  renderer.autoClear = false; // important!

  renderer.clear();
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000, 0);

  // get the element that is a place holder for where we want to
  // draw the scene
  const element3 = scene3.userData.element;

  // get its position relative to the page's viewport
  let rect3;

  if (element3) rect3 = element3.getBoundingClientRect();

  // check if it's offscreen. If so skip it
  if (
    rect3.bottom < 0 ||
    rect3.top > renderer.domElement.clientHeight ||
    rect3.right < 0 ||
    rect3.left > renderer.domElement.clientWidth
  ) {
    return; // it's off screen
  }

  // set the viewport
  const width3 = rect3.right - rect3.left;
  const height3 = rect3.bottom - rect3.top;
  const left3 = rect3.left;
  const bottom3 = renderer.domElement.clientHeight - rect3.bottom;

  renderer.setViewport(left3, bottom3, width3, height3);
  renderer.setScissor(left3, bottom3, width3, height3);

  const camera3 = scene3.userData.camera;

  renderer.render(scene3, camera3);

  // controls.update();
};

setTimeout(() => {
  renderer.setAnimationLoop(animate); // this is the same as requestAnimationFrame(animate). It will call the animate function over and over again on every frame.

  animate();
}, 3000);
