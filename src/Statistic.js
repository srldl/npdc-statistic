'use strict';

function Statistic( NpolarApiSecurity, StatisticResource) {
  'ngInject';

  const schema = 'http://api.npolar.no/schema/statistic';

  return Object.assign(StatisticResource, {

     schema,

     create: function() {

      let availability ="by negotiation";
      let lang = "en";
      let draft = "no";

      //let id = PublicationResource.randomUUID();
      let e = {  availability, lang, draft };
      console.debug(e);
      return e;

    }


 });

}
module.exports = Statistic;
