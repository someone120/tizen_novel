(function() {
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

    function getOffset(file) {
        var offset = 0;
        try {
            var index = tizen.filesystem.openFile(file + ".idx", "r");

            var i = index.readString();
            offset = i.split("/")[0];
            index.close();
        } catch (e) {

            var index = tizen.filesystem.openFile(file + ".idx", "w");
            var filea = tizen.filesystem.openFile(file, "r");
            var output = filea.readData()
            console.log("File content: " + output.length);
            index.writeString("0/" + output.length)
            index.close();
            return parseInt(output.length);
        }
        return parseInt(offset);
    }

    function getlength(file) {
        var offset = 0;
        try {
            var index = tizen.filesystem.openFile(file + ".idx", "r");

            var i = index.readString();
            offset = i.split("/")[1];
            index.close();
        } catch (e) {

            var index = tizen.filesystem.openFile(file + ".idx", "w");
            var filea = tizen.filesystem.openFile(file, "r");
            var output = filea.readData()
            console.log("File content: " + output.length);
            index.writeString("0/" + output.length)
            index.close();
            return parseInt(output.length);
        }
        return parseInt(offset);
    }
    function encodeUtf8(text) {
        const code = encodeURIComponent(text);
        const bytes = [];
        for (var i = 0; i < code.length; i++) {
            const c = code.charAt(i);
            if (c === '%') {
                const hex = code.charAt(i + 1) + code.charAt(i + 2);
                const hexVal = parseInt(hex, 16);
                bytes.push(hexVal);
                i += 2;
            } else bytes.push(c.charCodeAt(0));
        }
        return bytes;
    }
    function setOffset(file, offset) {

        try {
            var index = tizen.filesystem.openFile(file + ".idx", "r");
            var i = index.readString();
            var length = i.split("/")[1];
            index.close();
            var index = tizen.filesystem.openFile(file + ".idx", "w");
            index.writeString(offset + "/" + length);
            index.close();
        } catch (e) {
            var index = tizen.filesystem.openFile(file + ".idx", "w");
            var filea = tizen.filesystem.openFile(file, "r");
            var output = filea.readData()
            console.log("File content: " + output.length);
            index.writeString("0/" + output.length)
            index.close();
            return parseInt(output.length);
        }
        return parseInt(offset);
    }

    function readContent(file, offset, length) {
        file.seek(offset);
        return file.readString(length);
    }
    var a=0;
    var dest = decodeURI(location.hash.replace("#", ""));
    if(dest==""){
    	dest=localStorage.getItem("dest");
    }
    localStorage.setItem("dest", dest);
    function nextPage(offset, linemax,readLenght) {
//        if (offset + readLenght > length) {
//            setOffset("documents/books/" + dest, length);
//            offset = length;
//            var content = readContent(file, offset, readLenght);
//            console.log(content)
//            document.getElementById("content").innerHTML = content;
//            return
//        }
        document.getElementById("content").innerHTML = "";
        
       offset +=a;
        var content = readContent(file, offset, readLenght);

        for(i=0;i<content.length;i++){
        	var origin= document.getElementById("content").innerHTML
        	document.getElementById("content").innerHTML += content.split("")[i]; 
        	if( document.getElementById("content").getClientRects().length>linemax){
        		document.getElementById("content").innerHTML = origin;
        		
        		a = encodeUtf8(origin).length;
        		break;
        	 }
        }
        setOffset("documents/books/" + dest, offset);
        
        return offset;
    }

    function prevPage(offset, linemax,readLenght) {
//        if (offset - 30 < 0) {
//            setOffset("documents/books/" + dest, 0);
//            offset = 0;
//            var content = readContent(file, offset, readLenght);
//            console.log(content)
//            document.getElementById("content").innerHTML = content;
//            return
//        }
//
//        setOffset("documents/books/" + dest, offset - 30);
//
//        offset -= 30;
//        var content = readContent(file, offset, readLenght);
//        console.log(content)
//        document.getElementById("content").innerHTML = content;
//        return offset
    	document.getElementById("content").innerHTML = "";
        
        
        var content = readContent(file, offset, readLenght);
        offset -= a
        for(i=0;i<content.length;i++){
        	var origin= document.getElementById("content").innerHTML
        	document.getElementById("content").innerHTML += content.split("")[i]; 
        	if( document.getElementById("content").getClientRects().length>linemax){
        		document.getElementById("content").innerHTML = origin;
        		a = encodeUtf8(origin).length;
        		break;
        	 }
        }
        setOffset("documents/books/" + dest, offset);
        
        return offset;
    }


    console.log(dest)
    var file = tizen.filesystem.openFile("documents/books/" + dest, "r");
    var length = getlength("documents/books/" + dest)
    console.log(length);
    var offset = getOffset("documents/books/" + dest)
    var content = readContent(file, offset, 30);
    console.log(content)
    document.getElementById("content").innerHTML = content;
    rotaryEventHandler = function(e) {
        var length = getlength("documents/books/" + dest)
        console.log(length);
        var offset = getOffset("documents/books/" + dest)
        if (e.detail.direction === "CW") { // Right direction
            offset = nextPage(offset, 6,100)
        } else if (e.detail.direction === "CCW") { // Left direction
            offset = prevPage(offset, 6,100)
        }

    };

    // register rotary event.
    document.addEventListener("rotarydetent", rotaryEventHandler, false);

    
    var startx, starty;
    
  //获得角度
  function getAngle(angx, angy) {
      return Math.atan2(angy, angx) * 180 / Math.PI;
  };
   
  //根据起点终点返回方向 1向上滑动 2向下滑动 3向左滑动 4向右滑动 0点击事件
  function getDirection(startx, starty, endx, endy) {
      var angx = endx - startx;
      var angy = endy - starty;
      var result = 0;
   
      //如果滑动距离太短
      if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
          return result;
      }
   
      var angle = getAngle(angx, angy);
      if (angle >= -135 && angle <= -45) {
          result = 1;
      } else if (angle > 45 && angle < 135) {
          result = 2;
      } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
          result = 3;
      } else if (angle >= -45 && angle <= 45) {
          result = 4;
      }
      return result;
  }
   
  //手指接触屏幕
  document.addEventListener("touchstart", function(e){
      startx = e.touches[0].pageX;
      starty = e.touches[0].pageY;
  }, false);
   
  //手指离开屏幕
  document.addEventListener("touchend", function(e) {
      var endx, endy;
      endx = e.changedTouches[0].pageX;
      endy = e.changedTouches[0].pageY;
      var direction = getDirection(startx, starty, endx, endy);
      switch (direction) {
         
          case 3:
        	  location.href="progress.html#"+dest;
              break;
          }
  }, false);
}())