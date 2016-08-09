'use strict';

const path = require('path'),
  assign = require('lodash.assign'),
  MongoClient = require('mongodb').MongoClient;

var dburl = 'mongodb://localhost:27017/sitespeed';
module.exports = {
  name() {
    return path.basename(__dirname);
  },

  open(context, options) {
   // console.log(context);
    this.dbArray=[];
  },

  processMessage(message) {

   switch (message.type) {
      case 'url':
      {
       this.pageurl=message.url;
       break;
      }

      case 'error':
      {
        console.log('error');
        break;
      }
      case 'browsertime.run':
      case 'browsertime.pageSummary':
      case 'browsertime.har':
      case 'webpagetest.run':
      case 'webpagetest.pageSummary':
      case 'gpsi.data':
      case 'gpsi.pageSummary':
      case 'pagexray.run':
      case 'pagexray.pageSummary':
      case 'coach.run':
      case 'coach.pageSummary':
      case 'assets.aggregate':
      case 'domains.summary':
      case 'webpagetest.summary':
      case 'coach.summary':
      case 'pagexray.summary':
      case 'browsertime.summary':
      {
        this.dbArray.push(assign({},message,{url:this.pageurl,data:JSON.stringify(message.data)}));
      }
    }
  },
  close() {
    var that=this;
     MongoClient.connect(dburl, function(err, db) {
      console.log("Connected correctly to server.");
      db.collection('speedinfos').insert(that.dbArray, function(err, result) {
        if(err){
          console.log(err);
        }
        console.log("Inserted documents into collection.");
        db.close();
      });
    });
    console.log("Finished");
  }
};
