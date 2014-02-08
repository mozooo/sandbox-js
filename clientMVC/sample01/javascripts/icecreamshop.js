/* 
 * Model
 */

// アイスクリームメニュー
var Icecreams = {
  // ** data **
  list: [
    {id:'i1', name:"バニラ"},
    {id:'i2', name:"チョコチップ"},
    {id:'i3', name:"チョコミント"},
    {id:'i4', name:"オレンジシャーベット"},
    {id:'i5', name:"ストロベリー"},
    {id:'i6', name:"抹茶"}
  ],

  // ** method **
  getAll: function() {
    return this.list;
  },

  // idで指定したアイスクリームを返す
  findById: function(id) {
    return $.grep(this.list, function(val) {
                    return id == val.id;
                  })[0];
  }

};

// 選択済アイスクリームリスト
var SelectedIcecreams = {
  // ** data **
  // 選択済リスト
  list: [],

  // 選択できるアイスクリームの個数
  selectableUpperLimit: 2,

  // ** method **
  // アイスクリームを追加する
  add: function(item) {
    var list = this.list;
    list.push(item);
    if (list.length > this.selectableUpperLimit) {
      // 上限以上は古いものから削除
      list.shift();
    }
    console.log("選択可能制限：" + this.selectableUpperLimit);
    this.updateViews();
  },

  clear: function() {
    this.list = [];
    this.updateViews();
  },

  changeSelectableUpperLimit: function(n) {
    if (n < 1 || n > Icecreams.list.length ) {
      console.log("選択可能制限の異常")
    } else {
      this.selectableUpperLimit = n;
      this.clear();
    }
  },

  // 指定したアイスクリームが選択済かを評価
  checkItemSelected: function(icecream) {
    return this.list.indexOf(icecream) >= 0;
  },

  // idで指定したアイスクリームが選択済か評価
  checkItemSelectedById: function(id) {
    return this.checkItemSelected(Icecreams.findById(id));
  },

  // 選択されているアイスクリームを返す
  getSelectedIcecreams: function() {
    return this.list;
  },

  // 選択可能制限数を返す
  getSelectableUpperLimit: function() {
    return this.selectableUpperLimit;
  },

  // ビューを更新する
  updateViews: function() {
    updateSelection();
    updateSelectedIcecreams();
    updateLimitNumbers();
  }

};


/* 
 * View
 */

// オンロード
$(function () {
  var icecreams = $('#icecreams');
  var limitNumbers = $('#limit-numbers');
  $.each(Icecreams.getAll(),
    function(i, icecream) {
      icecreams.append(
        $("<li>")
          .append($("<input type='checkbox'>").attr('name', icecream.id))
            .append($("<span>").text(icecream.name))
          .click(function(event) {
            onclickIcecream(event);
          })
      );
      limitNumbers.append(
        $("<option>").text(i + 1))
      .change(function(event) {
        $("select option:selected").each(function() {
          onchangeLimitNumber($(this).text());
        })
      });
    }
  );

  $('#clear-button').click(function(event) {
    onclickClearButton(event);
  })

  SelectedIcecreams.updateViews();
});

// チェックボックス更新
function updateSelection() {
  $('#icecreams input[type="checkbox"]').each(function(i, elm) {
    elm.checked = SelectedIcecreams.checkItemSelectedById(elm.name);
  });
}

// 選択順序更新
function updateSelectedIcecreams() {
  $("#selected-icecreams").text(
    $.map(SelectedIcecreams.getSelectedIcecreams(), function(val) {
      return val.name;
    }).join(" と ")
  );
}

// 選択可能制限数プルダウン更新
function updateLimitNumbers() {
  $("#limit-numbers").val(SelectedIcecreams.getSelectableUpperLimit());
  console.log(SelectedIcecreams.getSelectableUpperLimit());
}


/* 
 * Controller
 */

// チェックボックスイベント処理
function onclickIcecream(event) {
  var checkbox = $(event.currentTarget)
                  .find("input[type='checkbox']");
  if (checkbox[0].checked) {
    SelectedIcecreams.add(
      Icecreams.findById(checkbox.attr("name")));
  }
}

function onclickClearButton(event) {
  SelectedIcecreams.clear();
}

function onchangeLimitNumber(n) {
  SelectedIcecreams.changeSelectableUpperLimit(n);
}


/* 
 * Test
 */

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
  var all = Icecreams.getAll();

  ok("Icecreams:個数", all.length, 6);
  ok("Icecreams.findById", Icecreams.findById("i4"), all[3]);

  ok("SelectedIcecreams:最初の個数", SelectedIcecreams.getSelectedIcecreams().length, 0);
  ok("SelectedIcecreams.getSelectedIcecreams:空の場合", false, SelectedIcecreams.checkItemSelected(all[0]));
  ok("SelectedIcecreams.getSelectableUpperLimit:初期値", 2, SelectedIcecreams.getSelectableUpperLimit());

  SelectedIcecreams.add(all[0]);
  ok("SelectedIcecreams:1つめを追加したときの個数", SelectedIcecreams.getSelectedIcecreams().length, 1);
  ok("SelectedIcecreams.getSelectedIcecreams:1つめを追加したときのチェック", true, SelectedIcecreams.checkItemSelected(all[0]));
  ok("SelectedIcecreams.getSelectableUpperLimit:初期値", 2, SelectedIcecreams.getSelectableUpperLimit());

  SelectedIcecreams.add(all[1]);
  ok("SelectedIcecreams:2つめを追加したときの個数", SelectedIcecreams.getSelectedIcecreams().length, 2);
  ok("SelectedIcecreams.getSelectedIcecreams:2つめを追加したときのチェック", true, SelectedIcecreams.checkItemSelected(all[1]));
  ok("SelectedIcecreams.getSelectableUpperLimit:初期値", 2, SelectedIcecreams.getSelectableUpperLimit());

  SelectedIcecreams.add(all[2]);
  ok("SelectedIcecreams:3つめを追加したときの個数", SelectedIcecreams.getSelectedIcecreams().length, 2);
  ok("SelectedIcecreams.getSelectedIcecreams:3つめを追加したときのチェック", true, SelectedIcecreams.checkItemSelected(all[2]));
  ok("SelectedIcecreams.getSelectedIcecreams:3つめを追加したときに1つめが消えるチェック", false, SelectedIcecreams.checkItemSelected(all[0]));
  ok("SelectedIcecreams.getSelectableUpperLimit:初期値", 2, SelectedIcecreams.getSelectableUpperLimit());

  SelectedIcecreams.clear();
  ok("SelectedIcecreams:クリアしたときの個数", SelectedIcecreams.getSelectedIcecreams().length, 0);
  ok("SelectedIcecreams.getSelectedIcecreams:クリアしたときのチェック", false, SelectedIcecreams.checkItemSelected(all[0]));
  ok("SelectedIcecreams.getSelectableUpperLimit:初期値", 2, SelectedIcecreams.getSelectableUpperLimit());

  SelectedIcecreams.changeSelectableUpperLimit(4);
  ok("SelectedIcecreams.getSelectableUpperLimit:4に変更", 4, SelectedIcecreams.getSelectableUpperLimit());


}

// テスト実行
test();
