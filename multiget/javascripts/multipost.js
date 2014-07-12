//---------------------------------------------------------
// Model
//---------------------------------------------------------

// リクエスト
var Requester = {
  // ** data **
  response: [],
  worker: [],

  // ** method **
  send: function(method, url, thread, count) {
    this.clear();

    if (window.Worker) {
      for (var i = 0; i < thread; i++) {
        this.worker[i] = new Worker('./javascripts/worker.js');
        this.worker[i].addEventListener('message', function(e) {
          Requester.response.push(e.data);
        }, false);

        this.worker[i].postMessage({'method': method, 'url': url, 'count': count});
      }
    } else {
      window.alert("本ブラウザでは並列処理ができませぬ。");
    }

    this.updateViews(thread);
  },

  clear: function() {
    this.response = [];
    this.worker = [];
  },

  wait: function(thread) {
    var end = true;
    var myTypeof = Object.prototype.toString;

    if (this.response.length == 0) {
      end = false;
    } else {
      for (var i = 0; i < thread; i++) {
        if (myTypeof.call(this.response[i]) != "[object Object]") {
          end = false;
        }
      }
    }
    return end;
  },

  updateViews: function(thread) { 
    var timerId;
    timerId = setInterval(function(){
                if (Requester.wait(thread)) {
                  clearInterval(timerId);
                  timerId = null;
                  updateResults();
                }
              }, 1000);
  }

};

//---------------------------------------------------------
// View
//---------------------------------------------------------

// オンロード
$(function () {
  $('#send-button').click(function(event) {
    onclickSendButton(event, $('#input-url').val(), $('#input-thread').val(), $('#input-count').val());
  })
});

function updateResults() {
  $('table#result-list tbody *').remove();
  $('table#result-list tbody').append('<tr id="tr_main">');
  for (var i in Requester.response) {
    $('tr#tr_main').append('<td><table id="thread_' + i + '" border="1">');
    var sum = 0;
    for (var j in Requester.response[i].status) {
      $('table#thread_' + i).append('<tr><td>&nbsp;' + (parseInt(j)+1) + '&nbsp;</td><td>&nbsp;' + Requester.response[i].status[j] + '&nbsp;</td><td>&nbsp;' + Requester.response[i].responseTime[j] + 's&nbsp;</td></tr>');
      sum += parseFloat(Requester.response[i].responseTime[j]);
    }
    $('table#thread_' + i).prepend('<tr><td colspan="2">&nbsp;average</td><td>&nbsp;' + ((Math.round((parseFloat(sum) * 1000) / Requester.response[i].status.length)) / 1000) + 's&nbsp;</td></tr>');
  }
}

//---------------------------------------------------------
// Controller
//---------------------------------------------------------

// チェックボックスイベント処理
function onclickSendButton(event, url, thread, count) {
  console.log(url);
  console.log(count);
  Requester.send("GET", url, thread, count);
}


//---------------------------------------------------------
// Test
//---------------------------------------------------------

// チェック関数
function ok(title, expect, value) {
  if (expect === value) {
    console.log("OK : " + title);
  } else {
    console.log("NG : " + title + " [" + expect + "] --> [" + value + "]");
  }
}

// テスト内容
function test() {

  //SelectedIcecreams.changeSelectableUpperLimit(4);
  //ok("SelectedIcecreams.getSelectableUpperLimit:4に変更", 4, SelectedIcecreams.getSelectableUpperLimit());


}

// テスト実行
test();
