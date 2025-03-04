// ==UserScript==
// @name        UserScript Search
// @namespace        http://tampermonkey.net/
// @version        0.2
// @description        Tampermonkey の登録スクリプトのリストを表示　ショートカット「F10」
// @author        Personwritep
// @match        https://*/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @noframes
// @grant        none
// @updateURL        https://github.com/personwritep/UserScript_Search/raw/main/UserScript_Search.user.js
// @downloadURL        https://github.com/personwritep/UserScript_Search/raw/main/UserScript_Search.user.js
// ==/UserScript==


if(!location.hostname.includes('example.com')){
    window.addEventListener('keydown', check_key);
    function check_key(event){
        if(event.ctrlKey && event.keyCode==121){ // ショートカット「Ctrl+ F10」
            event.preventDefault();
            event.stopImmediatePropagation();
            let win_apper='left=800, top=100, width=525, height=400';
            window.open('https://example.com/', null , win_apper); }}}


if(location.hostname.includes('example.com')){
    env();
    main(); }


function env(){
    let head=document.head;
    if(head){
        let lang='<meta http-equiv="Content-Language" content="ja">';
        head.insertAdjacentHTML('beforeend', lang);

        let pre_style=head.querySelector('style');
        if(pre_style){
            pre_style.remove(); }}

    let pre_div=document.querySelector('body > div');
    if(pre_div){
        pre_div.remove(); }}




function main(){

    let data; // バックアップデータの中身
    let raw_list=[]; // リスト表示元の配列
    let usl_set=[]; //「UserScript List」のコントロール
    //  usl_set[0]：windowの高さ
    //  usl_set[1]：windowのX位置
    //  usl_set[2]：windowのY位置
    //  usl_set[3]：配列の降順表示：「0」昇順「1」降順

    let read_json=localStorage.getItem('USSearch'); // ストレージ 保存名
    usl_set=JSON.parse(read_json);
    if(usl_set==null){
        usl_set=[400, 800, 100, 0]; } // 初期値

    window.moveTo(usl_set[1], usl_set[2]);
    window.resizeTo(525, usl_set[0]); // 前回のウインドウサイズを指定

    display();
    disp_last_data();
    file_read();



    function disp_last_data(){
        let file_name;
        let read_json=localStorage.getItem('USList_data'); // アイテム名 リストデータ 🔵
        if(read_json){
            raw_list=JSON.parse(read_json);
            if(raw_list.length>1){
                file_name=raw_list.shift();

                let fname=document.querySelector('.file_reader_USS .fname');
                if(file_name && fname){
                    fname.textContent=file_name; }

                if(raw_list.length>0){
                    if(usl_set[3]==1){
                        raw_list.reverse(); }
                    disp_list(); }}}

        name_search();

    } // disp_last_data()




    function display(){

        let pos_SVG=
            '<svg viewbox="0 0 512 512" style="height: 18px; vertical-align: -3px;">'+
            '<path d="M512 256c0 7-3 13-8 18l-80 72C420 350 414 352 408 352c-3 0-7-1-'+
            '10-2C390 346 384 338 384 328V288h-96v96l40-0c9 0 18 6 22 14s2 19-4 26l-7'+
            '2 80C269 509 263 512 255 512s-13-3-18-8l-71-80c-6-7-8-17-4-26s12-14 22-1'+
            '4l39 0V288H128v40c0 9-6 18-14 22C111 351 107 352 104 352c-6 0-12-2-16-6l'+
            '-80-72C3 269 0 263 0 256s3-13 8-18l80-72C95 160 105 158 114 162C122 166 '+
            '128 175 128 184V224h95V128l-39-0c-9 0-18-6-22-14S160 95 166 88l71-80c9-1'+
            '0 27-10 36 0l72 80c6 7 8 17 4 26s-12 14-22 14l-40 0V224H384V184c0-9 6-18'+
            ' 14-22c9-4 19-2 26 4l80 72C509 243 512 249 512 256z"></path>'+
            '</svg>';

        let rev_SVG=
            '<svg viewBox="0 0 530 530" style="height: 22px; padding-top: 1px;">'+
            '<path style="fill: #04a0ec;" d="M109 306L46 306C36 306 26 305 20 31'+
            '5C11 330 31 343 40 352L119 431C126 438 139 457 150 457C161 457 174 438 1'+
            '81 431L260 352C269 343 289 330 280 315C274 305 264 306 254 306L191 306L1'+
            '91 153C191 131 196 103 190 82C189 77 185 73 179 71C164 68 147 71 132 71C'+
            '125 71 118 70 113 75C108 80 109 87 109 94L109 136L109 306M340 231L340 40'+
            '1L340 443C340 450 339 457 344 462C349 467 356 466 363 466C378 466 395 46'+
            '9 410 466C416 464 420 460 421 455C427 434 422 406 422 384L422 231L485 23'+
            '1C495 231 505 232 511 222C519 207 499 194 490 185L411 106C404 99 391 80 '+
            '381 80C371 80 358 99 351 106L272 185C263 194 243 207 251 222C257 232 267'+
            ' 231 277 231L340 231z"></path>'+
            '</svg>';

        let panel=
            '<div id="panel_USS">'+
            '<div class="main_panel">'+
            '<div id="search_panel">'+
            'Script name<input type="text" class="script_name">'+
            'As standard file<button class="sw4 sw" type="submit">Set</button>'+
            'Position<button class="sw5 sw" type="submit">'+ pos_SVG +'</button>'+
            '</div>'+

            '<div class="file_reader_USS">'+
            '<input class="sw1 sw" type="submit" value="File">'+
            '<input class="sw2" type="file">'+
            '<span class="fname"></span>'+
            '<button class="sw3 sw" type="submit">'+ rev_SVG +'</button>'+
            '</div>'+
            '<div class="us_list">'+
            '<ul></ul>'+
            '</div></div></div>'+

            '<style>'+
            'html { overflow: hidden; } '+
            'body { margin: 0; } '+
            '#panel_USS { font: 16px Meiryo; color: #666; box-sizing: border-box; } '+
            '#panel_USS .main_panel { display: flex; flex-direction: column; width: fit-content; '+
            'padding: 8px 15px; background: #73a9d4; box-shadow: 0 0 0 100vw #b6d2df; } '+

            '#search_panel * { font: normal 16px Meiryo; } '+
            '#search_panel { Meiryo; padding: 6px 12px; color: #fff; background: #333; '+
            'white-space: nowrap; } '+
            '.script_name { width: 48px; height: 20px; padding: 2px 6px 0; margin: 0 18px 0 6px; } '+
            '.script_name:focus-visible { outline: 1px solid #4FC3F7; } '+

            '.file_reader_USS { position: relative; z-index: 1; display: flex; align-items: center; '+
            'padding: 0 15px; height: 40px; margin-bottom: 6px; color: #000; background: #fff; } '+

            '#panel_USS .sw { font: normal 16px/27px Meiryo; width: 26px; height: 26px; '+
            'padding: 0; border: 1px solid #aaa; border-radius: 2px; } '+
            '#panel_USS .sw1 { height: 26px; width: 38px; cursor: pointer; } '+
            '#panel_USS .sw2 { display: none; } '+
            '#panel_USS .fname { font: normal 16px/24px Meiryo; margin: 0 12px; height: 21px; } '+
            '#panel_USS .sw3 { position: absolute; top: 7px; right: 15px; cursor: pointer; } '+
            '#panel_USS .sw4 { margin: 0 15px 0 6px; width: auto; padding: 0 4px; cursor: pointer; } '+
            '#panel_USS .sw5 { margin-left: 6px; cursor: pointer; } '+

            '#panel_USS .us_list { width: 480px; height: calc(100vh - 100px); '+
            'overflow-y: scroll; overflow-x: hidden; color: #000; background: #fff; outline: none; } '+
            '#panel_USS .us_list ul { padding: 0; margin: 0; } '+
            '#panel_USS .us_list li { line-height: 22px; height: 23.2px; box-sizing: content-box; '+
            'padding: 12px 0 8px 4px; border-bottom: 1px solid #ccc; list-style: none; } '+
            '#panel_USS .us_list li:hover { box-shadow: inset 0 0 0 40px #aaaaaa20; } '+
            '#panel_USS .us_list li >* { display: inline-block; } '+
            '#panel_USS .dp { width: 55px; text-align: center; } '+
            '#panel_USS .dn { width: 300px; white-space: nowrap; overflow-x: scroll; '+
            'scrollbar-width: none; vertical-align: -6px; } '+
            '#panel_USS .dv { width: 80px; padding: 0 6px; margin: 0 -20px 2px 15px; } '+
            '</style>'+
            '</div>';

        if(!document.querySelector('#panel_USS')){
            document.body.insertAdjacentHTML('beforeend', panel); }

    } // display()




    function file_read(){
        let sw1=document.querySelector('.file_reader_USS .sw1');
        let sw2=document.querySelector('.file_reader_USS .sw2');
        sw1.onclick=()=>{
            sw2.value=null; // 同じファイルの再読み込みを可能にする
            sw2.click(); }

        sw2.addEventListener("change" , function(){
            if(!(sw2.value)) return; // ファイルが選択されない場合
            let file_list=sw2.files;
            if(!file_list) return; // ファイルリストが選択されない場合
            let file=file_list[0];
            if(!file) return; // ファイルが無い場合

            let fname=document.querySelector('.file_reader_USS .fname');
            fname.textContent=file_time(file.name);

            let file_reader=new FileReader();
            file_reader.readAsText(file);
            file_reader.onload=function(){
                let data_in=JSON.parse(file_reader.result);
                extract_data(data_in); }}); // データの表示


        function file_time(filename){
            if(filename){
                let full=filename.split('T');
                full[0]=full[0].replace('tampermonkey', 'TM');
                let tail=full[1];
                if(tail){
                    tail=tail.substring(0, 5);
                    return full[0] +'　T'+ tail; }}}


        let sw3=document.querySelector('#panel_USS .sw3');
        if(sw3){
            sw3.onclick=()=>{
                nor_rev(); }}


        let sw4=document.querySelector('#panel_USS .sw4');
        if(sw4){
            sw4.onclick=()=>{
                let ok=confirm(
                    '💢 現在のリストを「基準リスト」に設定しますか？\n'+
                    '「基準リスト」はツール起動時に常に読み込まれ 最初の検索対象になります\n\n'+
                    '　　●  「OK」➔ 基準リストに設定する\n'+
                    '　　●  「キャンセル」➔ 設定しない');
                if(ok){
                    set_standerd();
                }
                else{ ; }}}


        let sw5=document.querySelector('#panel_USS .sw5');
        if(sw5){
            sw5.onclick=()=>{
                let ok=confirm(
                    '💢 現在のウインドウサイズと位置を標準設定にしますか？\n'+
                    'ツール起動時に現在のサイズ・位置でウインドウが開きます\n\n'+
                    '　　●  「OK」➔ 表示のサイズ・位置に設定する\n'+
                    '　　●  「キャンセル」➔ 設定しない');
                if(ok){
                    set_window(); }
                else{ ; }}}

    } //  file_read()




    function extract_data(dat){
        raw_list=[]; // 初期化

        let scripts=dat.scripts;
        for(let k=0; k<scripts.length; k++){
            let name=scripts[k].name;
            let position=scripts[k].position;
            let source=scripts[k].source;
            source=source.substring(0, 300);

            let decoded;
            let version;
            if(source){
                try {
                    decoded=atob(source);
                    let decoded_array=
                        new Uint8Array(Array.prototype.map.call(decoded, c => c.charCodeAt()));
                    decoded=new TextDecoder().decode(decoded_array);

                    let ver=decoded.substring(decoded.indexOf('// @version')+12);
                    ver=ver.substring(0, ver.indexOf('// @'));
                    version=ver.trim(); }
                catch {
                    version=''; }}

            raw_list.push([position, name, version]); }


        if(raw_list.length>0){
            if(usl_set[3]==1){
                raw_list.reverse(); }
            disp_list(); }

    } // extract_data()




    function disp_list(){
        let get=[]; // 初期化
        for(let k=0; k<raw_list.length; k++){
            get.push([raw_list[k][0], raw_list[k][1], raw_list[k][2]]); }


        let ul=document.querySelector('#panel_USS .us_list ul');
        let li='';
        if(ul){
            ul.innerHTML=''; // 書込みをクリア

            for(let k=0; k<get.length; k++){
                li+=
                    '<li><span class="dp">'+ get[k][0] +'</span>'+
                    '<span class="dn">'+ get[k][1] +'</span>'+
                    '<span class="dv">'+ get[k][2] +'</span></li>'; }

            ul.insertAdjacentHTML('beforeend', li ); }

    } // disp_list()




    function name_search(){
        let script_name=document.querySelector('.script_name');
        if(script_name){
            script_name.focus();
            script_name.oninput=()=>{
                search_do(script_name); }

            document.addEventListener('keydown', function(event){
                if(event.keyCode==27){ //「ESC」で検索終了
                    script_name.value='';
                    end_name_search(); }});

        } // if(script_name)


        function search_do(script_name){
            let ask=script_name.value;

            let list=document.querySelector('.us_list');
            if(list){
                search_list(list, ask); }

            function search_list(list, ask){
                let items=list.querySelectorAll('li');
                for(let k=0; k<items.length; k++){
                    let dn=items[k].querySelector('.dn')
                    if(dn){
                        if(dn.textContent.startsWith(ask)){
                            items[k].style.display=''; }
                        else{
                            items[k].style.display='none'; }}
                    else{
                        items[k].style.display='none'; }}}

        } // search_do()


        function end_name_search(){
            let list_li=document.querySelectorAll('.us_list li');
            for(let k=0; k<list_li.length; k++){
                list_li[k].style.display=''; }

            let list=document.querySelector('.us_list');
            if(list){
                list.scrollTop=0; }}

    } // name_search()




    function nor_rev(){
        if(usl_set[3]==0){
            usl_set[3]=1;
            sort_reverse(); } // 降順
        else{
            usl_set[3]=0;
            sort_normal(); } // 昇順

        let write_json=JSON.stringify(usl_set);
        localStorage.setItem('USSearch', write_json); // ローカルストレージ名


        function sort_reverse(){
            if(raw_list.length>1){
                if(raw_list[0][0]<raw_list[1][0]){
                    raw_list.reverse();
                    disp_list(); }}}


        function sort_normal(){
            if(raw_list.length>1){
                if(raw_list[0][0]>raw_list[1][0]){
                    raw_list.reverse();
                    disp_list(); }}}

    } // nor_rev()




    function set_standerd(){
        let fname=document.querySelector('.file_reader_USS .fname');
        if(fname){
            let file_name=fname.textContent;
            if(file_name.length>0){
                let header=[];
                header.push(file_name);

                if(raw_list[0][0]>raw_list[1][0]){
                    raw_list.reverse(); }

                let write=header.concat(raw_list);
                let write_json=JSON.stringify(write);
                localStorage.setItem('USList_data', write_json); }} // アイテム名 🔵 リストデータ保存

    } // set_standerd()




    function set_window(){
        usl_set[0]=window.outerHeight;
        usl_set[1]=window.screenX;
        usl_set[2]=window.screenY;
        let write_json=JSON.stringify(usl_set);
        localStorage.setItem('USSearch', write_json); // ローカルストレージ名

    } // set_window()


} // main()
