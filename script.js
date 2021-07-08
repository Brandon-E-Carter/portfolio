const app = {};

app.init = () => {
   app.body = document.querySelector("body");

   //converting from NodeList
   app.slides = [...document.querySelectorAll('.slide')];
   //switch the 4th and 5th
   [app.slides[4], app.slides[5]] = [app.slides[5], app.slides[4]];

   app.slideIndex = 0;
   app.slideIndexNext = 1;

   app.prepareElements();

   app.loadSlides(app.slideIndex, app.slideIndex);
}

app.prepareElements = () => {

   //Get all rows of slides
   const rows = document.querySelectorAll('.row');
   //get any rows that have a horizontal scroll (more than 1 slide on the row)
   app.sideScrollRows = [];
   rows.forEach(row => {
      if (row.children.length > 1) {
         app.sideScrollRows.push(row)
      }
   });
   //default the second sidescroll row to start at - far right slide
   app.sideScrollRows[1].scrollLeft = app.sideScrollRows[1].offsetWidth;

   //get all the buttons that change slides
   const slideButtons = document.querySelectorAll('.slide-button');
   slideButtons.forEach(button => {
      //add event listener for the button to 'change slides'
      if (button.classList.contains('next-slide')) {
         button.addEventListener('click', function () {
            button.style.background = "black"; // tester
         })
      };
   });

   //get the mouse wheel event (when scrolling page)
   document.addEventListener('wheel', function (e) {
      //stop function if not purposely scrolling down page (ie. crtlKey + scroll controls window zoom)
      if (e.altKey || e.ctrlKey || e.shiftKey) {
         return;
      }
      console.log(e);
      //prevent default - added {passive: false} as second parameter to allow for this
      e.preventDefault();

      let scrollDirection = e.deltaY > 0 ? "down" : "up";

      app.scroll(scrollDirection);

   }, { passive: false })
}

app.scroll = (scrollDirection) => {
   let { slideIndex, slideIndexNext } = app;

   //if scroll down - next slide is slotted, if scroll up - previous slide is slotted
   slideIndexNext = scrollDirection === "down" ? slideIndex + 1 : slideIndex - 1;
   if (slideIndexNext >= app.slides.length) {
      slideIndexNext = slideIndex;
   } else if (slideIndexNext < 0) {
      slideIndexNext = 0;
   }

   //prepare slides
   app.loadSlides(slideIndex, slideIndexNext);

   console.log(slideIndex);
   console.log(slideIndexNext);

   app.slides[slideIndexNext].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });

   app.slideIndex = slideIndexNext;
   app.slideIndexNext = slideIndexNext;
}

app.unloadSlides = () => {

}

app.loadSlides = (slideIndex, slideIndexNext) => {

   for (let i = 0; i < app.slides.length; i++) {
      const slide = app.slides[i];
      
      if (i !== slideIndex && i !== slideIndexNext) {
         slide.classList.add("disabled");
      }
      else {
         slide.classList.remove("disabled");
      }
   }

   //any rows with horizontal scroll that have no children currently being displayed get 'disabled' 
   //(otherwise they display only a scroll bar - but no content)
   app.sideScrollRows.forEach(row => {
      const children = [...row.children];
      let childrenDisplayed = 0;

      //count the children being displayed
      children.forEach(child => {
         if (!child.classList.contains("disabled")) {
            childrenDisplayed++;
         }
      });
      //if no children are being displayed, disable the row
      if (childrenDisplayed === 0) {
         row.classList.add("disabled");
      } else {
         row.classList.remove("disabled");

         //if more than one child displayed, add side-scroll (overflow-x: scroll)
         if (childrenDisplayed > 1) {
            row.classList.add("side-scroll");
         } else {
            row.classList.remove("side-scroll");
         }
      }
   });
}

app.init();