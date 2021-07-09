const app = {};

app.init = () => {
   app.body = document.querySelector("body");

   //converting from NodeList
   app.slides = [...document.querySelectorAll('.slide')];
   console.log(app.slides)

   //update later to swap every second 'app.sideScrollRows' slides
   //switch the 4th and 5th
   // [app.slides[4], app.slides[5]] = [app.slides[5], app.slides[4]];
   app.prepareElements();

   app.canScroll = true;

   app.slideIndex = 0;

   const slidesToDisable = app.loadSlides(app.slideIndex, app.slideIndex);
   console.log(slidesToDisable)
   // app.unloadSlides(slidesToDisable);

}

app.prepareElements = () => {

   //Get all rows of slides
   app.rows = document.querySelectorAll('.row');
   //get any rows that have a horizontal scroll (more than 1 slide on the row)
   app.sideScrollRows = [];
   app.rows.forEach(row => {
      if (row.children.length > 1) {
         app.sideScrollRows.push(row)
      }
   });
   //default the second sidescroll row to start at - far right slide
   // app.sideScrollRows[1].scrollLeft = app.sideScrollRows[1].offsetWidth;


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

      if (!app.canScroll) {
         return;
      }

      let scrollDirection = e.deltaY > 0 ? "down" : "up";

      app.scroll(scrollDirection);

      app.canScroll = false;
      setTimeout(() => {
         app.canScroll = true;
      }, 600);

   }, { passive: false })
}

app.scroll = (scrollDirection) => {
   let { slideIndex } = app;

   //if scroll down - next slide is slotted, if scroll up - previous slide is slotted
   // slideIndexNext = app.nextSlide(slideIndex, scrollDirection);

   slideIndexNext = scrollDirection === "down" ? slideIndex + 1 : slideIndex - 1;
   if (slideIndexNext >= app.slides.length) {
      slideIndexNext = slideIndex;
   } else if (slideIndexNext < 0) {
      slideIndexNext = 0;
   }

   //load required slides
   const slidesToDisable = app.loadSlides(slideIndex, slideIndexNext);

   console.log("scrolling here");

   app.slides[slideIndexNext].scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

   setTimeout(() => {
      app.unloadSlides(slidesToDisable);
   }, 600);

   // slidesToDisable.forEach(slide => {
   //    app.unloadSlides(slide);
   // });

   app.slideIndex = slideIndexNext;
   // app.slideIndexNext = slideIndexNext;
}

app.scrollIntoView = (slide) => {

}

app.nextSlide = (slideComparing, scrollDirection) => {
   let slideChanging = scrollDirection === "down" ? slideComparing + 1 : slideComparing - 1;

   if (slideChanging >= app.slides.length) {
      slideChanging = slideComparing;
   } else if (slideChanging < 0) {
      slideChanging = 0;
   }

   return slideChanging;
}

app.unloadSlides = (slidesToDisable) => {
   slidesToDisable.forEach(slide => {
      console.log(slide)
      slide.classList.add("disabled");
   })

   // app.changeScrollBars();
}

app.loadSlides = (slideIndex, slideIndexNext) => {

   console.log(slideIndex, slideIndexNext)
   const slidesToDisable = [];

   for (let i = 0; i < app.slides.length; i++) {
      const slide = app.slides[i];

      //if slideIndex and slideIndextNext are not the same; and i = slideIndex
      if (i === slideIndex && i !== slideIndexNext) {
         // setTimeout(() => {
         // slide.classList.add("disabled");
         // app.changeScrollBars();
         slidesToDisable.push(slide);
         // app.unloadSlides([slide]);
         // }, 600);
      }
      if (i === slideIndexNext) {
         slide.classList.remove("disabled");
         slidesToDisable.push(...app.changeEnabled(slide));
         // console.log(slide);
      } else {
         slidesToDisable.push(slide);
      }

      // if (i !== slideIndex && i !== slideIndexNext) {
      //    // slide.classList.add("disabled");
      // } else {
      // }
   }

   // app.changeScrollBars();
   return slidesToDisable;
}

app.changeEnabled = (element) => {

   const elementsToDisable = [];

   console.log(element);
   app.rows.forEach(row => {
      // console.log(row.children);
      children = [...row.children];
      // children.length;
      children.forEach(child => {
         // console.log("checking for", element);
         // console.log("return", child);
         if (child === element) {
            console.log(children);
            console.log(children.length);
            row.classList.remove("disabled");
            console.log("found it")
            if (children.length > 1) {
               row.classList.add("side-scroll");
            }
         } else {
            // child.classList.add('disabled')
            // console.log(child)
            elementsToDisable.push(child);
         }
      });
   });

   return elementsToDisable;
}

app.changeScrollBars = () => {
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