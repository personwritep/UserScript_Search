// ==UserScript==
// @name        UserScript Search
// @namespace        http://tampermonkey.net/
// @version        0.3
// @description        Tampermonkey の登録スクリプトの検索絞り込み　ショートカット「Ctrl+F10」
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
        let help_url='https://ameblo.jp/personwritep/entry-12888631973.html';

        let pos_SVG=
            '<svg viewBox="0 0 120 120" style="height: 20px; vertical-align: -4px;">'+
            '<path style="fill: #009688;" d="M60 5C53 12 45 19 39 27L58 27L58 57'+
            'L28 57L28 38C20 44 13 52 6 59C12 67 20 75 28 81L28 62L58 62L58 92L39 92C'+
            '45 100 53 107 60 114C68 108 76 100 82 92L63 92L63 62L93 62L93 81C101 75 '+
            '108 67 115 60C109 52 101 44 93 38L93 57L63 57L63 27L82 27C76 19 68 11 60'+
            ' 5z"></path>'+
            '</svg>';

        let rev_SVG=
            '<svg viewBox="0 0 120 120" style="height: 22px; padding-top: 1px;">'+
            '<path style="fill: #1976D2;" d="M83 13C74 22 63 31 56 41L77 41L77 1'+
            '03L90 103L90 41L111 41C104 31 93 20 83 13M30 18L30 81L9 81C16 91 27 100 '+
            '36 109C46 102 57 91 64 81L43 81L43 18L30 18z"></path>'+
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
            '<button class="sw7 sw" type="submit">'+
            '<a href="'+ help_url +'" target="_blank" rel="noopener noreferrer"><b>？</b>'+
            '</a></button>'+
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
            '#panel_USS .sw3 { position: absolute; top: 7px; right: 40px; cursor: pointer; } '+
            '#panel_USS .sw4 { margin: 0 15px 0 6px; width: auto; padding: 0 4px; cursor: pointer; } '+
            '#panel_USS .sw5 { margin-left: 6px; cursor: pointer; } '+
            '#panel_USS .sw7 { position: absolute; top: 10px; right: 8px; color: #999; '+
            'width: 21px; height: 21px; line-height: 22px; border-radius: 30px; } '+
            '#panel_USS .sw7 a { text-decoration: none; } '+

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
