(function(tau) {
    function onsuccessPermission(result, privilege) {
        console.log("Success" + result);
        var successCallback = function(newPath) {
            console.log('New directory has been created: ' + newPath);
        }
        var errorCallback = function(error) {
            console.log(error);
        }
        tizen.filesystem.createDirectory("documents/books", successCallback, errorCallback);

        function onsuccess(files) {
            var list = []
            for (var i = 0; i < files.length; i++) {
            	if(files[i].endsWith(".idx")){
            		continue;
            	}
                /* Display the file path with name */
                list.push(files[i]);
                //                                        console.log('File path and name is: ' + files[i]);
                //            
                //                                        var header = document.createElement("li");
                //                                        var a = document.createElement("a");
                //                                        a.setAttribute("href", "book.html");
                //                                        var node = document.createTextNode(files[i]);
                //            
                //                                        a.appendChild(node);
                //                                        header.appendChild(a);
                //            
                //                                        dom.appendChild(header);
            }

            localStorage.setItem("list", list.join(","));
            location.replace("book.html");
            //                        
            //                        list = document.getElementById('book_list');
            //                        console.log(list);
            //                        tau.widget.SnapListview(list).refresh();

        }


        function onerror(error) {
            console.log(error);
        }
        tizen.filesystem.listDirectory("documents/books", onsuccess, onerror);
    }
    tizen.ppm.requestPermission("http://tizen.org/privilege/mediastorage",
        onsuccessPermission,
        function() {});

}(tau));