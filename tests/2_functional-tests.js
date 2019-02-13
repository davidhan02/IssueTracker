/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http'),
      chai     = require('chai'),
      assert   = chai.assert,
      server   = require('../server');

//testing variables
var id1,
    id2;

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Test A',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Test A');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          assert.equal(res.body.open, true);
          assert.property(res.body, 'issue_title');
          assert.property(res.body, 'issue_text');
          assert.property(res.body, 'created_by');
          assert.property(res.body, 'assigned_to');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, '_id');
          assert.isBoolean(res.body.open);
          //set id1 variable for other tests
          id1 = res.body._id;
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Test B',
            issue_text: 'test',
            created_by: 'Required fields filled in test'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, 'Test B');
            assert.equal(res.body.issue_text, 'test');
            assert.equal(res.body.created_by, 'Required fields filled in test');
            assert.equal(res.body.assigned_to, '');
            assert.equal(res.body.status_text, '');
            assert.equal(res.body.open, true);
            assert.property(res.body, 'issue_title');
            assert.property(res.body, 'issue_text');
            assert.property(res.body, 'created_by');
            assert.property(res.body, 'assigned_to');
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'updated_on');
            assert.property(res.body, '_id');
            assert.property(res.body, 'open');
            assert.property(res.body, 'status_text');
            assert.isBoolean(res.body.open);
            //set id2 variable for other tests
            id2 = res.body._id;
            done();
        });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Test C',
            created_by: 'Missing required fields',
            assigned_to: 'Chai and Mocha'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'No updated field sent');
            done();
          });
        });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            _id: id1
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'No updated field sent');
            done();
          });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            _id: id1,
            issue_title: 'Updated Title Test'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'No updated field sent');
            done();
          });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            _id: id2,
            issue_title: 'Multiple fields Test',
            open: 'false'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'No updated field sent');
            done();
          });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({}) // filter here
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({assigned_to: 'Chai and Mocha'}) //filter
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          //matching with earlier test
          assert.equal(res.body[0].assigned_to, 'Chai and Mocha');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({_id: id2})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.equal(res.body[0].open, true);
          assert.equal(res.body[0].issue_title, 'Test B');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({}) //no id
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'ID Error');
          done();
        });  
      });
      
      //match with earlier id created
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id: id2})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'Successfully deleted '+id2);
          done();
        });  
      });
      
    });

});
