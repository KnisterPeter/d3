d3.Module('d3', function(m) {
  m.Class('Resource', {
    url: null,
    data: null,
    
    construct: function(url) {
      if (d3.isString(url)) {
        this.url = url;
      } else {
        this.data = url;
      }
    },
    
    get: function(callback) {
      if (this.data) {
        callback.call(this, this.data);
      } else {
        m.Resource.load(this.url, callback, this);
      }
    },
    
    statics: {
      load: function(url, callback, context) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            if (xhr.status == 200) {
              callback.call(context, xhr.responseText);
            }
          }
        };
        xhr.send(null);
      }
    }
  });
});
