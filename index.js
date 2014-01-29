var Transform = require('stream').Transform;
var util     = require('util');

util.inherits(StreamTransformer, Transform);

function StreamTransformer() {
  var processes = 0;
  var transformers = {};
  Transform.call(this, {
    objectMode: true
  });
  this.register = function (key, handler) {
    if(!handler) {
      handler = key;
      key = '_global';
    }
    function registeredHandler () {};
    registeredHandler.prototype.transform = handler;
    registeredHandler.prototype._super      = transformerFor(key) && transformerFor(key).transform;
    transformers[key] = new registeredHandler();
  }
  this._transform = function (data, encoding, done) {
    var key;
    if(data.length) {
      key = data[0];
      data = data[1];
    } else {
      key = '_global';
    }
    processes++;
    transformerFor(key).transform(data, function (transformed){
      processes--;
      this.push(transformed);
      if(!processes){
        this.push(null);
      }
      done();
    }.bind(this));
  };

  function transformerFor(key) {
    return transformers[key] || transformers['_global'];
  }
  this.register('_global', function global (data, done){
    done(data);
  });
  return this;
};


module.exports = StreamTransformer;