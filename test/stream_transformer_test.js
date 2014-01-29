var should            = require("should");
var StreamTransformer = require('../index');

describe('StreamTransformer', function () {

  it('should work', function (done){
    var transformer = new StreamTransformer();
    transformer.write({foo: 'bar'});
    transformer.on('data', function (transformed) {
      transformed.should.eql({foo: 'bar'});
    });
    transformer.on('end', done);
  });

  it('should allow registering global tranformers', function (done){
    var transformer = new StreamTransformer();
    transformer.register(function (data, done){
      data.foo += '!';
      done(data);
    });
    transformer.write({foo: 'bar'});
    transformer.on('data', function (transformed){
      transformed.should.eql({foo: 'bar!'});
    });
    transformer.on('end', done);
  });

  it('should allow registering keyed tranformers', function (done){
    var transformer = new StreamTransformer();
    transformer.register('foo', function (data, done){
      data.foo += '!';
      done(data);
    });
    transformer.write(['foo', {foo: 'bar'}]);
    transformer.on('data', function (transformed){
      transformed.should.eql({foo: 'bar!'});
    });
    transformer.on('end', done);
  });

  it('should allow calling super', function (done){
    var transformer = new StreamTransformer();
    transformer.register('foo', function (data, done){
      data.foo += '!';
      done(data);
    });
    transformer.register('foo', function (data, done){
      this._super(data, function (data){
        data.foo += '1';
        done(data);
      })
    });
    transformer.write(['foo', {foo: 'bar'}]);
    transformer.on('data', function (transformed){
      transformed.should.eql({foo: 'bar!1'});
    });
    transformer.on('end', done);
  });

});