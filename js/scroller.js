// This code is heavily referenced from https://vallandingham.me/scroller.html

function scroller() {
    var container = d3.select('container')
    var sectionPositions = []
    var sections = null
    var currentIndex = -1
    var dispatch = d3.dispatch("active", "progress");

    // elements is a d3 selection of scrollable elements
    function scroll(elements) {
        console.log(elements)
        sections = elements

        d3.select(window)
        .on("scroll.scroller", position)
        .on("resize.scroller", resize);

        // manually call resize and position to setup scroller
        resize();
        position();
        
    }


    /**
     * Function to be called when page is resized
     * resets positions of sections
     */
    function resize() {
        sectionPositions = [];
        var startPos = 0;
        sections.each(function(d, i){
            var currPos = this.getBoundingClientRect().bottom;
            if (i == 0) {
                startPos = currPos;
            }
            sectionPositions.push(currPos - startPos);
        });
    }

    function position() {
        console.log("position")
        var currPos = window.pageYOffset - 60;
        console.log(currPos)
        var currentSectionIndex = d3.bisect(sectionPositions, currPos);
        currentSectionIndex = Math.min(sections.size() - 1, currentSectionIndex);
        if (currentIndex !== currentSectionIndex) {
            dispatch.call('active', this, currentSectionIndex);
            currentIndex = currentSectionIndex;
        }

        var prevIndex = Math.max(currentIndex - 1, 0);
        var prevTop = sectionPositions[prevIndex];
        var progress = (currPos - prevTop) / (sectionPositions[currentIndex] - prevTop);
        dispatch.call('progress', this, currentIndex, progress)
    }

    /**
   * container - get/set the parent element
   * of the sections. Useful for if the
   * scrolling doesn't start at the very top
   * of the page.
   *
   * @param value - the new container value
   */
    scroll.container = function (value) {
        if (arguments.length === 0) {
        return container;
        }
        container = value;
        return scroll;
    };

    // @v4 There is now no d3.rebind, so this implements
    // a .on method to pass in a callback to the dispatcher.
    scroll.on = function(action, callback) {
        dispatch.on(action, callback)
    }

    return scroll
}