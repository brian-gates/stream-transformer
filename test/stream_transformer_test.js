var should            = require("should");
var StreamTransformer = require('../index');

describe('StreamTransformer', function () {

  it('should work', function (done){
    var ds = new StreamTransformer();
    ds.write({foo: 'bar'});
    ds.on('data', function (transformed) {
      transformed.should.eql({foo: 'bar'});
    });
    ds.on('end', done);
  });

  it('should allow registering global tranformers', function (done){
    var ds = new StreamTransformer();
    ds.register(function (data, done){
      data.foo += '!';
      done(data);
    });
    ds.write({foo: 'bar'});
    ds.on('data', function (transformed){
      transformed.should.eql({foo: 'bar!'});
    });
    ds.on('end', done);
  });

  it('should allow registering keyed tranformers', function (done){
    var ds = new StreamTransformer();
    ds.register('foo', function (data, done){
      data.foo += '!';
      done(data);
    });
    ds.write(['foo', {foo: 'bar'}]);
    ds.on('data', function (transformed){
      transformed.should.eql({foo: 'bar!'});
    });
    ds.on('end', done);
  });

  it('should allow calling super', function (done){
    var ds = new StreamTransformer();
    ds.register('foo', function (data, done){
      data.foo += '!';
      done(data);
    });
    ds.register('foo', function (data, done){
      this._super(data, function (data){
        data.foo += '1';
        done(data);
      })
    });
    ds.write(['foo', {foo: 'bar'}]);
    ds.on('data', function (transformed){
      transformed.should.eql({foo: 'bar!1'});
    });
    ds.on('end', done);
  });

});