(function() {
    var page = document.getElementById('pageCircleProgressBar'),
        progressBar = document.getElementById('circleprogress'),
        minusBtn = document.getElementById('minus'),
        plusBtn = document.getElementById('plus'),
        resultDiv = document.getElementById('result'),
        isCircle = tau.support.shape.circle,
        progressBarWidget,
        resultText,
        i;

    function printResult() {
       resultText = progressBarWidget.value();
       resultDiv.innerHTML = resultText + '%';
    }

    function clearVariables() {
       page = null;
       progressBar = null;
       minusBtn = null;
       plusBtn = null;
       resultDiv = null;
    }

    function unbindEvents() {
        page.removeEventListener('pageshow', pageBeforeShowHandler);
        page.removeEventListener('pagehide', pageHideHandler);
        page.removeEventListener('popstate', pageHideHandler);
        if (isCircle) {
            document.removeEventListener('rotarydetent', rotaryDetentHandler);
        } else {
            minusBtn.removeEventListener('click', minusBtnClickHandler);
            plusBtn.removeEventListener('click', plusBtnClickHandler);
        }
    }

    function minusBtnClickHandler() {
        i = i - 10;
        if (i < 0) {
            i = 0;
        }
        progressBarWidget.value(i);
        printResult();
    }

    function plusBtnClickHandler() {
        i = i + 10;
        if (i > 100) {
            i = 100;
        }
        progressBarWidget.value(i);
        printResult();
    }

    function rotaryDetentHandler() {
        /* Get the rotary direction */
        var direction = event.detail.direction,
            value = parseInt(progressBarWidget.value());

        if (direction === 'CW') {
            /* Right direction */
            if (value < 100) {
                value++;
            } else {
                value = 100;
            }
        } else if (direction === 'CCW') {
            /* Left direction */
            if (value > 0) {
                value--;
            } else {
                value = 0;
            }
        }

        progressBarWidget.value(value);
        printResult();
    }
    var dest=decodeURI(location.hash.replace("#", ""))
    console.log(dest)
    var index = tizen.filesystem.openFile("documents/books/"+dest+ ".idx", "r");

    var i = index.readString().split("/");
var length = parseInt(i[1]);
var offset = parseInt(i[0]);
index.close()

	window.addEventListener('tizenhwkey', function(ev) {
        if (ev.keyName === 'back') {
        	console.log("documents/books/"+dest+ ".idx");
        	var index = tizen.filesystem.openFile("documents/books/"+dest+ ".idx", "w");
        	console.log(length*progressBarWidget.value()/100 + "/" + length)
       	 index.writeString(length*progressBarWidget.value()/100 + "/" + length);
            index.close();
            var page = document.getElementsByClassName('ui-page-active')[1],
                pageid = page ? page.id : '';

            if (pageid === 'main') {
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (ignore) {}
            } else {
                window.history.back();
            }
        }
    });
    function pageBeforeShowHandler() {
        if (isCircle) {
            /* Make the circular progressbar object */
            progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {size: 'full'});
            document.addEventListener('rotarydetent', rotaryDetentHandler);
        } else {
            progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {size: 'large'});
            minusBtn.addEventListener('click', minusBtnClickHandler);
            plusBtn.addEventListener('click', plusBtnClickHandler);
        }
        progressBarWidget.value(offset/length*100);
        i = parseInt(progressBarWidget.value());
        resultDiv.innerHTML = i + '%';
    }

    function pageHideHandler() {
    	var index = tizen.filesystem.openFile("documents/books/"+decodeURI(location.hash.replace("#", ""))+ ".idx", "w");
    	 index.writeString(length*progressBarWidget.value()/100 + "/" + length);
         index.close();
        unbindEvents();
        clearVariables();
        /* Release the object */
        progressBarWidget.destroy();
    }

    page.addEventListener('pagebeforeshow', pageBeforeShowHandler);
    page.addEventListener('pagehide', pageHideHandler);
    page.addEventListener('popstate', pageHideHandler);
}());