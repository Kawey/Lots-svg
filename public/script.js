let stateStage = true;
let activeElement;

const elementsStage = document.querySelectorAll(".pathStage");
const elementsLot = document.querySelectorAll(".lot");
const mySvg = document.getElementById("mySvg");
const btnBack = document.getElementById("btn-back");

//Sidebar values
const lotIdElm = document.getElementById("lot-id");
const lotStatusElm = document.getElementById("status");
const lotStageElm = document.getElementById('stage');
const lotAreaElm = document.getElementById('area');
const lotSizeElm = document.getElementById('size');
const lotPriceElm = document.getElementById('price');
const btnAction = document.querySelector('action-btn');

let dataDb;

const colorRed = "#ef6f6cff";
const colorBlue = "#465775ff";
const colorGreen = "#56e39fff";
const colorOcean = "#59c9a5ff";
const colorYellow = "#D2C656";
const colorFeld = "#5b6c5dff";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  aspect: window.innerWidth / window.innerHeight
}

/**
 * Page Initialisation
 */

// LOAD event
window.addEventListener('load', (event) => {
  const endpoint = `/lots`;
  // Get lots data from db
  fetch(endpoint, {
    method: 'GET',
  })
    .then(response => response.json())
    .then((data) => {
      dataDb = data;
      for (let i = 0; i < elementsLot.length; i++) {
        switch (dataDb[i].status) {
          case "available":
            elementsLot[i].style.fill = colorGreen;
            break;
          case "reserved":
            elementsLot[i].style.fill = colorYellow;
            break;
          case "sold":
            elementsLot[i].style.fill = colorRed;
            break;
          default:
            console.log(i, dataDb[i].status)
            elementsLot[i].style.fill = colorBlue;
            break;
        }
      }
    })
    .catch(err => console.log(err));
});
/**
 * RESIZE and POSITION of SVG initial
 */
mySvg.width.baseVal.value = sizes.width
mySvg.height.baseVal.value = sizes.height

const viewBoxSizes = calcSVGsize(sizes.width, sizes.height)
mySvg.viewBox.baseVal.width = viewBoxSizes.width
mySvg.viewBox.baseVal.height = viewBoxSizes.height

const SVGpos = calcSVGpos(sizes.width / 2, sizes.height / 2);
mySvg.viewBox.baseVal.x = SVGpos.x
mySvg.viewBox.baseVal.y = SVGpos.y
scrToSvgIn = screenToSVG(sizes.width / 2, sizes.height / 2);

// RESIZE event
window.addEventListener('resize', () =>
{
  // Update screen sizes object
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  sizes.aspect = window.innerWidth / window.innerHeight
  
   // UPDATE svg viewbox
  if (stateStage) {
    mySvg.width.baseVal.value = sizes.width
    mySvg.height.baseVal.value = sizes.height
    const SVGsize = calcSVGsize(sizes.width, sizes.height)
    mySvg.viewBox.baseVal.width = SVGsize.width
    mySvg.viewBox.baseVal.height = SVGsize.height

    const SVGpos = calcSVGpos(sizes.width / 2, sizes.height / 2)
    mySvg.viewBox.baseVal.x = SVGpos.x
    mySvg.viewBox.baseVal.y = SVGpos.y
  } else {
    const bBox = activeElement.getBBox();

    mySvg.width.baseVal.value = sizes.width
    mySvg.height.baseVal.value = sizes.height
    mySvg.viewBox.baseVal.width = bBox.width+sizes.width/10,
    mySvg.viewBox.baseVal.height = bBox.height+sizes.height/10
  }
})

// Click event inside
elementsStage.forEach(function (elem) {
  elem.addEventListener("click", (e) => {
  const SVGpos = calcSVGpos(sizes.width / 2, sizes.height / 2)
  activeElement = elem;
  const bBox = elem.getBBox();
  gsap.fromTo(
    mySvg.viewBox.baseVal,
    {
      x: mySvg.viewBox.baseVal.x, y: mySvg.viewBox.baseVal.y,
      width: mySvg.viewBox.baseVal.width, height: mySvg.viewBox.baseVal.height
    },
    {
      x: bBox.x-bBox.width/10,
      y: bBox.y-bBox.height/10,
      width: bBox.width+sizes.width/10,
      height: bBox.height+sizes.height/10,
      duration: 2,
      ease: "slow"
    }
  );
  gsap.fromTo(".G" + elem.id.charAt(1), { opacity: 0 }, { opacity: 1 });

  elementsStage.forEach((elem) => {
    elem.style.pointerEvents = "none";
  });
    elem.style.opacity = 0;
    btnBack.style.opacity = 1;
    stateStage = false;
    
  });
  
  
});

// Click event BACK to top
btnBack.addEventListener("click", (e) => {
  stateStage = true
  bBox = activeElement.getBBox();

  const SVGsize = calcSVGsize(sizes.width, sizes.height)

  gsap.fromTo(
    mySvg.viewBox.baseVal,
    { x: bBox.x, y: bBox.y, width: bBox.width, height: bBox.height },
    {
      x: 866 - SVGsize.width / 2, y: 577 - SVGsize.height / 2,
      width: SVGsize.width, height: SVGsize.height,
        duration: 2,
        ease: "slow"
    }
  );
  gsap.fromTo(
    ".G" + activeElement.id.charAt(1),
    { opacity: 1 },
    { opacity: 0 }
  );

  elementsStage.forEach((elem) => {
    elem.style.pointerEvents = "auto";
  });
  activeElement.style.opacity = 1;
  btnBack.style.opacity = 0;
});

// click event for lots
elementsLot.forEach(function (elem) {
  elem.addEventListener("click", (e) => {
    lotIdElm.textContent = "#" + dataDb[e.target.id - 1].lotId;

    const lotStatus = dataDb[e.target.id - 1].status;
    lotStatusElm.textContent = lotStatus.charAt(0).toUpperCase() + lotStatus.slice(1);
    
    lotStageElm.textContent = dataDb[e.target.id - 1].stage;
    lotAreaElm.textContent = dataDb[e.target.id - 1].area + " m²";
    lotSizeElm.textContent = dataDb[e.target.id - 1].size;
    lotPriceElm.textContent = "$" +dataDb[e.target.id - 1].price;
  });
});

function screenToSVG(screenX, screenY) {
  const mySvg = document.getElementById("mySvg");
  let p = new DOMPoint(screenX, screenY);
  return p.matrixTransform(mySvg.getScreenCTM().inverse());
};

function calcSVGsize(width, height) {
  const VBWidth = 1520; // base svg ViewBox width 1920<=cause jump
  const VBHeight = 1520; // base svg ViewBox height 1080<=cause jump
  const minWidth = 960; // min screen width 960
  const minHeight = 960; // min screen height 540
  const minVBW = 1200; // minimum target ViewBox
  const minVBH = 1200; // minimum target ViewBox height

  const svgSize = {}
  
  if(sizes.aspect > 1) {
    svgSize.height = height >= VBHeight ? VBHeight :
      VBHeight - (VBHeight - height) / (VBHeight - minHeight) * (VBHeight - minVBH);
    svgSize.width = svgSize.height / sizes.aspect;
    return svgSize
  } else {
    svgSize.width = width >= VBWidth ? VBWidth :
      VBWidth - (VBWidth - width) / (VBWidth - minWidth) * (VBWidth - minVBW);
    svgSize.height = svgSize.width / sizes.aspect;
    return svgSize
  }
}

function calcSVGpos(width, height) {
  const svgCenter = { x: 966, y: 577 }
  const mySvg = document.getElementById("mySvg");
  const scrToSvg = screenToSVG(width, height);
  // console.log("screenCenterToSvg ",scrToSvg);
  const svgPos = {}
  if (scrToSvg.x > svgCenter.x || scrToSvg.x < svgCenter.x) {
    svgPos.x = mySvg.viewBox.baseVal.x + svgCenter.x -scrToSvg.x
    //mySvg.viewBox.baseVal.x = svgPosX;
    // mySvg.viewBox.baseVal.y = 200;
  } else { svgPos.x = mySvg.viewBox.baseVal.x }

  if (scrToSvg.y > svgCenter.y || scrToSvg.y < svgCenter.y) {
    svgPos.y = mySvg.viewBox.baseVal.y + svgCenter.y -scrToSvg.y
    //mySvg.viewBox.baseVal.y = svgPosY;
  } else { svgPos.y = mySvg.viewBox.baseVal.y }
  // console.log("return svgPos ",svgPos);
  return svgPos
}

function SVGToScreen(svgX, svgY) {
  const mySvg = document.getElementById("mySvg");
  let p = new DOMPoint(svgX, svgY);
    return p.matrixTransform(mySvg.getScreenCTM());
}