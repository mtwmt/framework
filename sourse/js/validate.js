(function( $ ) {
  $.fn.validate = function( options ) {
    
    options = $.extend({
      success: function(){ alert('success'); },
      error: function(){},
      errcls: 'err-msg'
    }, options);

    var
    $form = $(this),
    $verify = $form.find('[data-verify]'),
    $submit = $form.find('[data-submit]'),
    check = {
      name: function(){
        return RegExp(/^[a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/);
      },
      mail: function(){
        return RegExp(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/);
      },
      mobile: function(){
        return RegExp(/^09[0-9]{8}$/);
      },
      password: function(dom, min, max){
        var min = min || '',
            max = max || '';
        return RegExp(`[a-zA-Z0-9_-]{${min},${max}}$`);
      },
      same: function( dom ){
        var target = dom.data('same'),
            $target = $('.'+ target +'');
        return RegExp(`${$target.find('input').val()}`);
      }
    },
    chkErr = function($select,msg){
      $select.addClass('error');
      if( !$select.is('[data-msg]') ){
        $select.find('[data-msg]').append(msg);
      }else{
        $select.append(`<em class="${options.errcls}">${msg}</em>`);
      }
    },
    chk = function( $select, obj, msg ){
      var str,
          newStr,
          minLen = $select.data('min') || '',
          maxLen = $select.data('max') || '';
          $select.removeClass('error');
  
          if( !$select.is('[data-msg]') ){
            str = $select.find('[data-msg]').text();
            newStr = str.replace(msg ,'');
            $select.find('[data-msg]').text(newStr);

            
          }else{
            $select.find('.'+ options.errcls +'').remove('.'+ options.errcls +'');
          }
      if( !check[obj]( $select, minLen, maxLen ).test( $select.find('input').val() ) ){
        chkErr( $select,msg );
      }
    },
    actValidate = function(){
      var $self = $(this),
          log = [],
          msg = $self.data('msg') || $self.find('[data-msg]').data('msg');
      for( var i in check ){
        if( i.indexOf($self.data('verify')) >= 0 ){
          chk( $self, i ,msg);
        }
      }
    },
    actSubmit = function(){
      var log = [];
      $verify.each(function( i,e ){
          if($(this).hasClass('error') || !$(this).find('input').val()){
            $(this).addClass('error');
            log.push('err');
          }
      });

      if( !(log.length) ){
        $(this).one('success',options.success).trigger('success');
      }else{
        $(this).one('error',options.error).trigger('error');
      }
      return false;
    };
    $verify.on('test',actValidate)
          .on('blur','input',function(){
            $(this).trigger('test');
          });
    $submit.on('click',actSubmit);
  };

}( jQuery ));