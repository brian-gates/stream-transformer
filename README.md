# stream-transformer [![devDependency Status](https://david-dm.org/brian-gates/stream-transformer.png?theme=shields.io)](https://david-dm.org/brian-gates/stream-transformer.png#info=devDependencies)

A simple tool to transform streams via registered global or keyed handlers

## Basic Usage

``` js
var transformer = new StreamTransformer();
transformer.write({foo: 'bar'});
transformer.on('data', function (transformed) {
  transformed.should.eql({foo: 'bar'});
});
transformer.on('end', done);
```

## Global Transformers
``` js
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
```

## Keyed Transformers

``` js
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
```

## Extended Transformers
``` js
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

