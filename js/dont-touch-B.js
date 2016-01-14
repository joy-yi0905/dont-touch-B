;~function(){
    
    var d = document,
        zzList = d.querySelector(".zz-list"),
        counter = d.querySelector(".counter"),
        startBtn = d.querySelector(".start-btn"),
        createBtn = d.querySelector(".create-btn"),
        roleSelect = d.querySelector(".role-select"),
        screenW = d.documentElement.clientWidth,
        screenH = d.documentElement.clientHeight,
        rowNum = 5,
        colNum = 4,
        randomColNum = 0,
        zzH = parseInt((screenH-50)/rowNum),
        totalTime = remainTime = 20,
        counterTimer = null,
        score = 0,
        isStart = false,
        isCreateRole = true,
        nowRoleName = "默认角色";

    // create role
    createBtn.onclick = function(){
        var createName = prompt("请输入角色名称",""),
            isExist = false;
        if(createName){
            if (window.localStorage) {
            　  for (var i = 0,len = localStorage.length; i < len; i++) {
            　　    var iKey = localStorage.key(i),
                　　  iItem = localStorage[iKey];
                   if(createName === iItem){
                        isExist = true;
                        alert("角色已存在，请重新设置");
                        break;
                   }
                   else{
                        isExist = false;        
                   }
               }
            }
            if(!isExist){
                var option = d.createElement ("option");
                option.value = createName;
                option.innerText = createName;
                roleSelect.appendChild (option);
                roleSelect.options[roleSelect.length-1].selected = true;
                localStorage["role-" + createName] = createName;
                nowRoleName = createName;
            }
        }
        else{
            alert("创建失败！角色名不能为空");
        }
    }   

    // select role
    roleSelect.addEventListener( "change" , function(){
        nowRoleName = roleSelect.options[roleSelect.selectedIndex].text;
    } , false );

    startBtn.addEventListener( "click" , function(){
        clearInterval(counterTimer);
        counterTimer = setInterval(function(){
            remainTime--;
            counter.innerHTML = remainTime;
            if(remainTime == 0){
                gameOver();
            }
        },1000);
        this.disabled = isStart = true;
    
        // is first init 
        if(!this.getAttribute("data-init")){
            this.setAttribute("data-init","yes");
        }
        else{
            gameInit();
        }
    } , false );

    // change size
    window.addEventListener( "resize" , function(){
        document.documentElement.style["font-size"] = 20 * (d.documentElement.clientWidth / 320) + "px";
    } , false );

    document.documentElement.style["font-size"] = 20 * (screenW / 320) + "px";

    function gameInit(){
        counter.innerHTML = remainTime = totalTime;
        zzList.innerHTML = "";
        score = 0;
        for(var i = 0 ; i<rowNum ;i++){
            randomColNum = Math.floor(Math.random()*4);
            insertZz(randomColNum , i);
        }
        if (window.localStorage && isCreateRole) {
            isCreateRole = false; 
        　  for (var n = 0,len = localStorage.length; n < len; n++) {
        　　    var iKey = localStorage.key(n),
            　　  iItem = localStorage[iKey];
                if(iKey.substring(0,5) === "role-"){  // is role name ?
                    var option = d.createElement ("option");
                    option.value = iItem;
                    option.innerText = iItem;
                    roleSelect.appendChild (option);
                }
            }
        }
    }

    function gameOver(){
        clearInterval(counterTimer);
        startBtn.disabled = isStart =  false;
        // compute score
        if(window.localStorage){ 
            if(localStorage["bestScore"] || localStorage["bestScore"] == 0){
                if(score>localStorage["bestScore"]){
                    localStorage["bestScore"] = score;
                    localStorage["bestRole"] = nowRoleName;
                }
            }
            else{  // first play
                localStorage["bestScore"] = score;
                localStorage["bestRole"] = nowRoleName;
            }
        }       
        alert("游戏结束！"+ "\n" +
               "本次得分　　" + nowRoleName + " : " + score + "分" + "\n" + 
               "最高得分　　" + localStorage["bestRole"] + " : " + localStorage["bestScore"] + "分"
               );
    }

    function insertZz(randomColNum , num){
        for(var j = 0 ; j<colNum ; j++){
            var zz = d.createElement("li"),
                firstZz = zzList.getElementsByTagName("li")[0];
            zz.innerHTML = "<span class='black'>B</span>";
            zz.style["height"] = zzH + "px";
            zz.style["line-height"] = zzH + "px";
            zz.setAttribute("index" , num + ";" + j); 
            if(num >1 && j == randomColNum){
                zz.innerHTML = "<span class='blue'>A</span>";
            }
            if(firstZz){
                zzList.insertBefore(zz,firstZz);
            }
            else{
                zzList.appendChild(zz);
            }
        }
        zzAction();
    }

    function zzAction(){
        var zz = zzList.getElementsByTagName("li");
        for(var i = 0 ; i < zz.length ; i++){
            zz[i].index = i;
            zz[i].addEventListener( "click" , function(){
                if(isStart){
                    if(this.innerHTML === '<span class="blue">A</span>'){
                        var computeNum = this.index;
                        for(computeNum ; computeNum < 20 ; computeNum++){
                            if(zz[computeNum+1] &&  zz[computeNum+1].innerHTML === '<span class="blue">A</span>'){
                                return false;
                            }
                        }
                        randomColNum = Math.floor(Math.random()*4);
                        insertZz(randomColNum , i);
                        zzList.style["top"] = -(zzH+2) + "px";
                        move(zzList , 0);
                        score++;
                        this.innerHTML = "<span></span>";
                    }
                    else{
                        gameOver();
                    }
                }
            } , false );
        }
    }


    function move(obj,iTarget){
        clearInterval(obj.timer);
        var iSpeed = 0;
        obj.timer = setInterval(function(){
            iSpeed = (iTarget - obj.offsetTop)/3;
            iSpeed = iSpeed>0 ? Math.floor(iSpeed) : Math.ceil(iSpeed);
            if(obj.offsetTop == iTarget){
                clearInterval(obj.timer);
            }
            obj.style["top"] = obj.offsetTop + iSpeed + "px";
        },30);
    }

    gameInit();

}()
