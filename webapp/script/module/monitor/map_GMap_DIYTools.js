/**
 * Item Name  : google 自定义控件
 *Creator         :cc
 *Email            :cc
 *Created Date:2017.1.17
 *@pararm     :
 */
(function($, window) {
  function NewControl(opts) {
    // 父级容器
    this.p_dom = opts.p_dom;
    this.map = opts.map;

    this.offset = opts.offset;
    this.btns = opts.btns;
  };
  NewControl.prototype = {
    // 入口函数
    init: function() {
      var me = this;
      var div = document.createElement('div');
      div.style.backgroundColor = '#fff';
      div.style.height = '36px';
      div.style.lineHeight = '36px';
      div.style.border = '2px solid #21536d';
      // div.style.borderRadius = '3px';
      div.style.boxShadow = '0 3px 6px rgba(0,0,0,.4)';
      div.style.cursor = 'pointer';
      div.style.marginTop = me.offset[0];
      div.style.marginRight = me.offset[1];
      div.style.marginBottom = me.offset[2];
      div.style.marginLeft = me.offset[3];
      div.style.textAlign = 'center';

      // btns
      me.make_son(div)
      me.p_dom.appendChild(div);
    },
    make_son: function(Pdom) {
      /* body... */
      var me = this;
      for (var i = 0; i < me.btns.length; i++) {
        var son_div = document.createElement('div');
        son_div.id = 'dom_' + me.btns[i].slice(-4);
        son_div.style.color = '#21536d';
        son_div.style.height = '36px';
        son_div.style.fontSize = '14px';
        son_div.style.paddingLeft = '8px';
        son_div.style.paddingRight = '8px';
        son_div.title = me.btns[i].slice(0,-4);
        son_div.innerHTML = me.btns[i].slice(0,-4);
        son_div.style.float = 'left';

        Pdom.appendChild(son_div);
      }
    },
  };
  window["NewControl"] = NewControl;
})(jQuery, window);
