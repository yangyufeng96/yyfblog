// 定义地址
// var swfUrl = "http://chabudai.sakura.ne.jp/blogparts/honehoneclock/honehone_clock_tr.swf";
var swfUrl = "https://cdn.jsdelivr.net/gh/yangyfeng/yangyfeng.github.io@gh-pages/assets_blog/media/honehone_clock_tr.swf";
var swfTitle = "honehoneclock";

function LoadBlogParts() {
	var sUrl = swfUrl;
	// codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0"
	var sHtml = "";
	sHtml += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="https://cdn.jsdelivr.net/gh/yangyfeng/yangyfeng.github.io@gh-pages/assets_blog/media/swflash.cab#version=8,0,0,0" width="160" height="70" id="' + swfTitle + '" align="middle">';
	sHtml += '<param name="allowScriptAccess" value="always" />';
	sHtml += '<param name="movie" value="' + sUrl + '" />';
	sHtml += '<param name="quality" value="high" />';
	sHtml += '<param name="bgcolor" value="#ffffff" />';
	sHtml += '<param name="wmode" value="transparent" />';
	sHtml += '<embed wmode="transparent" src="' + sUrl + '" quality="high" bgcolor="#ffffff" width="160" height="70" name="' + swfTitle + '" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';
	sHtml += '</object>';
	var div = document.createElement('div')
	div.setAttribute('class', 'honehoneclock')
	div.style = 'position: fixed;left: 0;bottom: 0;z-index: 10;'
	div.innerHTML = sHtml
	document.body.appendChild(div);
}
LoadBlogParts();