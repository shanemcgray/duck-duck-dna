// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
}


// Footer year
const yearEl = document.getElementById('year');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}


// Homepage elements
const duckWrap = document.getElementById('duckWrap');
const seqOut = document.getElementById('seqOut');

// Generate QUAK DNA sequence
function generateDNA() {
  if (!seqOut) return;

  const bases = ['Q', 'U', 'A', 'K'];

  // Configuration
  const groups = 4;        // Number of groups
  const blockSize = 4;     // Bases per group
  const totalBases = groups * blockSize;

  const seq = Array.from(
    { length: totalBases },
    () => bases[Math.floor(Math.random() * bases.length)]
  ).join("");

  const regex = new RegExp(`.{1,${blockSize}}`, "g");

  seqOut.textContent = seq.match(regex).join(" ");
}


// Homepage: generate a slightly-different duck each time
function renderDuck() {

  if (!duckWrap) return;

  const rand = (min, max) =>
    +(Math.random() * (max - min) + min).toFixed(1);


  const bodyCx = 95;
  const bodyCy = 130;

  const bodyRx = rand(48, 60);
  const bodyRy = rand(32, 40);


  const headCx = rand(132, 148);
  const headCy = rand(76, 90);
  const headR = rand(25, 32);


  const eyeCx = headCx + rand(6, 12);
  const eyeCy = headCy - rand(4, 9);
  const eyeR = rand(2.5, 4);


  const beakTipX = headCx + headR + rand(14, 22);
  const beakTipY = headCy + rand(-6, 4);

  const beakTopX = headCx + headR - 5;
  const beakTopY = headCy - rand(2, 8);

  const beakBotX = headCx + headR - 5;
  const beakBotY = headCy + rand(6, 14);


  const wingStartX = bodyCx - bodyRx * 0.65;
  const wingStartY = bodyCy - bodyRy * 0.4;

  const wingCtrlY =
    bodyCy - bodyRy * rand(0.9, 1.3);

  const wingMidX =
    bodyCx + bodyRx * 0.3;


  const tailStartX =
    bodyCx - bodyRx * 0.85;

  const tailStartY =
    bodyCy + bodyRy * 0.4;

  const tailCtrlX =
    tailStartX - rand(12, 20);

  const tailCtrlY =
    tailStartY + rand(3, 10);

  const tailEndX =
    tailCtrlX - rand(3, 8);

  const tailEndY =
    tailStartY - rand(5, 12);


  duckWrap.innerHTML = `
    <svg class="duck"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="A randomly generated line drawing of a duck">

      <ellipse
        cx="${bodyCx}"
        cy="${bodyCy}"
        rx="${bodyRx}"
        ry="${bodyRy}"
        fill="#FAFAF7"
        stroke="#17181A"
        stroke-width="4"/>

      <path
        class="duck-wing"
        d="M${wingStartX} ${wingStartY}
           Q${bodyCx} ${wingCtrlY}
           ${wingMidX} ${wingStartY}
           Q${bodyCx} ${bodyCy - bodyRy * 0.1}
           ${wingStartX} ${wingStartY} Z"
        fill="#F2B705"
        stroke="#17181A"
        stroke-width="4"
        stroke-linejoin="round"/>

      <circle
        cx="${headCx}"
        cy="${headCy}"
        r="${headR}"
        fill="#FAFAF7"
        stroke="#17181A"
        stroke-width="4"/>

      <circle
        cx="${eyeCx}"
        cy="${eyeCy}"
        r="${eyeR}"
        fill="#17181A"/>

      <path
        d="M${beakTopX} ${beakTopY}
           L${beakTipX} ${beakTipY}
           L${beakBotX} ${beakBotY} Z"
        fill="#F2B705"
        stroke="#17181A"
        stroke-width="4"
        stroke-linejoin="round"/>

      <path
        d="M${tailStartX} ${tailStartY}
           Q${tailCtrlX} ${tailCtrlY}
           ${tailEndX} ${tailEndY}"
        fill="none"
        stroke="#17181A"
        stroke-width="4"
        stroke-linecap="round"/>

    </svg>
  `;
}


// Web audio version
// Duck sound
let audioContext;
let quackBuffer;

// Preload and decode the sound
async function loadQuack() {
  audioContext = new AudioContext();

  const response = await fetch('/sounds/qua.ogg');
  const arrayBuffer = await response.arrayBuffer();

  quackBuffer = await audioContext.decodeAudioData(arrayBuffer);
}

loadQuack();


function createReverb() {
  const duration = 2.5;
  const decay = 1.5;

  const length = audioContext.sampleRate * duration;
  const impulse = audioContext.createBuffer(
    2,
    length,
    audioContext.sampleRate
  );

  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);

    for (let i = 0; i < length; i++) {
      data[i] =
        (Math.random() * 2 - 1) *
        Math.pow(1 - i / length, decay);
    }
  }

  return impulse;
}


// Play the duck sound
async function playQuack() {
  if (!quackBuffer) return;

  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  const source = audioContext.createBufferSource();
  const gain = audioContext.createGain();

  source.buffer = quackBuffer;

  // Random pitch: 0.9x to 1.1x
  source.playbackRate.value =
    0.9 + Math.random() * 0.2;

  // Consistent volume
  gain.gain.value = 0.8;

  source.connect(gain);

  // 1% chance of reverb
  if (Math.random() < 0.01) {
    const reverb = audioContext.createConvolver();
    reverb.buffer = createReverb();

    // Dry signal
    gain.connect(audioContext.destination);

    // Reverb signal
    const reverbGain = audioContext.createGain();
    reverbGain.gain.value = 0.7;

    gain.connect(reverb);
    reverb.connect(reverbGain);
    reverbGain.connect(audioContext.destination);
  } else {
    gain.connect(audioContext.destination);
  }

  // Start 0.1 seconds into the sound
  source.start(0, 0.1);
}


// Generate duck
function generateDuck() {
  renderDuck();
  generateDNA();
  playQuack();
}

/*
// simple audio version
const quackSound = new Audio('/sounds/qua.ogg');

// Single generator action and make quack
function generateDuck() {
  renderDuck();
  generateDNA();
  quackSound.currentTime = 0.1;
  quackSound.play();
}
*/

// Initialize duck generator
if (duckWrap) {
  generateDuck();

  duckWrap.addEventListener('click', generateDuck);
}


// Wikipedia loader
function loadWikipedia(article, elementId) {

  const container = document.getElementById(elementId);

  if (!container) {
    return;
  }


  fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${article}`)
    .then(response => response.json())
    .then(data => {

      let html = `
        <h2>${data.title}</h2>
      `;


      if (data.thumbnail) {

        html += `
          <img src="${data.thumbnail.source}"
               alt="${data.title}">
        `;
      }


      html += `
        <p>${data.extract}</p>

        <p>
          <a href="${data.content_urls.desktop.page}"
             target="_blank">
             Read the full article on Wikipedia →
          </a>
        </p>
      `;


      container.innerHTML = html;

    })
    .catch(error => {

      container.innerHTML =
        "Couldn't load Wikipedia article.";

      console.error(error);

    });

}
