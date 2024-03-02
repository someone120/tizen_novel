(function(tau) {
	window.addEventListener('tizenhwkey', function(ev) {
        if (ev.keyName === 'back') {
            var page = document.getElementsByClassName('ui-page-active')[0],
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
    /* Check for a circular device */
    var list = localStorage.getItem("list").split(",").map(function(i){return decodeURI(i)});
    var elList = document.getElementById("book_list"),
        vlist = tau.widget.VirtualListview(elList, {
            dataLength: list.length,
            bufferSize: 40
        });
    vlist.setListItemUpdater(function(elListItem, newIndex) {
        var data = list[newIndex];
        elListItem.innerHTML =
            '<a onclick="window.location.href=\'show.html#'+ decodeURI(data)+'\'">' + data + '</a>';
    });
    vlist.draw();
}(tau));