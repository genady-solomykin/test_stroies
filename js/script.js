const storiesCircleArr = [];
let swiper;
let timer;
const allSlides = 5;


let storiesCircleElm = document.querySelectorAll('.stories-cirle-wrapper__circle');
    storiesCircleElm.forEach((item, index) => {
        storiesCircleArr.push(item)
        item.id = index;

        item.addEventListener('click', () => {
            document.querySelector('.slider-none').style.display = 'block';
            
            if(!swiper) {
                initSwiper(index);
            }
            else {
                swiper.slideTo(index)
                activateAll(swiper.slides[index]);
                runInterval(index, 5, 1)
            }
        });
    });


//Init swiper
function initSwiper(initIndex) {
    swiper = new Swiper(".stories-swiper", {
        slidesPerView: allSlides,
        spaceBetween: 30,
        centeredSlides: true,
        noSwiping: true, 
        noSwipingClass: 'swiper-slide',
        lazyLoad: true,
        on: {
            init() {
                this.slideTo(initIndex)
                activateAll(this.slides[initIndex]);
                runInterval(initIndex, 5, 1);
            }
        }
    });


    let step;

    const storiesMainElement = document.querySelector('.stories-swiper');

    document.querySelector('.slider-close').addEventListener('click', () => {
        document.querySelector('.slider').style.display = 'none';
        clearInterval(timer);
        deactivateAll(swiper.slides[swiper.activeIndex]);
    })  
    
    storiesMainElement.querySelectorAll('.swiper-slide').forEach((element, index) => {
        element.addEventListener('click', () => {
            swiper.slideTo(index)
        });
    })

    swiper.on('slideChange', () => {
        const curSlide = swiper.slides[swiper.activeIndex];
        const prevSlide = storiesMainElement.querySelector('.story-current-slide');

        if(prevSlide) {
            deactivateAll(prevSlide);
        }
        activateAll(curSlide);

        clearInterval(timer)
        runInterval(swiper.activeIndex, 5, 1)
    });
}

function activateAll(element) {
    element.classList.add('story-current-slide');
    element.querySelector('.player-chunk-prev').addEventListener('click',  prev);
    element.querySelector('.player-chunk-next').addEventListener('click',  next);
}

function deactivateAll(element) {
    element.classList.remove('story-current-slide');
    element.querySelector('.player-chunk-prev').removeEventListener('click',  prev);
    element.querySelector('.player-chunk-next').removeEventListener('click',  next);

    const activeTimeline = element.querySelector('.timeline-chunk-active').querySelector('.timeline-chunk-inner');

    activeTimeline.style.width = 0;
}



const moveClass = (el, className, method, pred) => {
    const active = el.querySelector('.' + className),
        next = active[method];

    if (pred && !pred(active)) {
        return null;
    }

    if (next) {
        active.classList.remove(className);
        next.classList.add(className);
        return active;
    }

    return null;
}

function prev(e) {
    const target = e.target.closest('.player');
    console.log(target)

    moveClass(target, 'player-chunk-active', 'previousElementSibling');
    const hasPrev = moveClass(target, 'timeline-chunk-active', 'previousElementSibling', (el) =>  {
        const inner = el.querySelector('.timeline-chunk-inner'),
                width = parseFloat(inner.style.width) || 0;

        el.querySelector('.timeline-chunk-inner').style.width = '';
        return width <= 100;
    });

    if(!hasPrev) {
        swiper.slidePrev();
    }

    e.stopPropagation();
}    

function next(e) {
    const target = e.target.closest('.player');

    moveClass(target, 'player-chunk-active', 'nextElementSibling');
    const el = moveClass(target, 'timeline-chunk-active', 'nextElementSibling');
    if (el) {
        el.querySelector('.timeline-chunk-inner').style.width = '';
        target.querySelector('video');
        // target.querySelector('video')?.play()
        console.log(target);
    }
    else {
        swiper.slideNext();
    }

    if(e.stopPropagation) {
        e.stopPropagation();
    }
}


//Ставим выидео на паузу при удержании клика мыши на самом видео --- Рабочий код
let videoTagPlayer = document.querySelectorAll('.player-chunk video');
    // videoTagPlayer.forEach(itemVideo => {
    //     itemVideo.addEventListener('mousedown', e => {
    //         let ev = e.target;
    //         (ev.paused) ? ev.play() : ev.pause();
    //     });
        
    //     itemVideo.addEventListener('mouseup', e => {
    //         let ev = e.target;
    //         (ev.paused) ? ev.play() : ev.pause();
    //     });
    // });


    // videoTagPlayer.forEach(item => {
    //     item.addEventListener('loadedmetadata', function() {
    //         console.log(document.getElementById("myvideo").duration);
    //     });
    // });

    


            //     videoTagPlayer.forEach(item => { 
            //         item.muted = !item.muted; 
            //         // item.pause();
                    
            //         item.addEventListener('click', (e) => {
            //             videoTagPlayer.forEach(el=> {
            //              el.pause();
            //             });
            //         item.play();
                    
            //     })
            // });

            // console.log(111);


        // videoTagPlayer.forEach(item => {
        //     // item.classList.add('play__video');
        //     item.pause();
        //     item.addEventListener('click', (e) => {
        //         let ev = e.target;
                
                    // if(!e.currentTarget.classList.contains('play__video')) {
                    //     e.target.classList.add('play__video');
                    //     ev.play();
                    //     console.log('ok');
                    // }else{
                    //     console.log('no');
                    // }
                   
            // });
        // });
        


//     videoVolume.addEventListener('click', () => {
//         videoTag.muted = !videoTag.muted;    
// })

// let videoVolume = document.querySelector('.muted_volume');
// videoTag.addEventListener('click', () => {
//     if(videoTag.paused) {
//       videoTag.play();
//       console.log('play');
//     }else
//       videoTag.pause();
//       console.log('pause');
//   });


// Авто прееключение сладеров по TimeLine...

function runInterval(elIndex, time, step) {
    clearInterval(timer);
    // let step;

   timer = setInterval(() => {
        const main = document.querySelectorAll('.swiper-slide')[elIndex];
        const active = main.querySelector('.timeline-chunk-active').querySelector('.timeline-chunk-inner');
        const allStories = main.querySelectorAll('.player-chunk');

        const activeStoryIndex = [...allStories].findIndex((story) => story.classList.contains('player-chunk-active'))
        const width = parseFloat(active.style.width) || 0;

        if (width === 100) {
            if(activeStoryIndex !== allStories.length - 1) {
                next({ target: active })
            }
            else {
                swiper.slideNext();
            }

            return;
        }

        active.style.width = String(width + step) + '%';

    }, time * 2000 * step / 100);
}