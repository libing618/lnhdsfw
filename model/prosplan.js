const AV = require('../libs/leancloud-storage.js');

class prosPlan extends AV.Object {
  get unitId() { return this.get('unitId'); }
  set unitId(value) { this.set('done', unitId); }

  get proObjectId() { return this.get('proObjectId'); }
  set proObjectId(value) { this.set('proObjectId', value); }

  get cant() { return this.get('cant'); }
  set cant(value) { this.set('cant', value); }

  get yieldt() { return this.get('yieldt'); }
  set yieldt(value) { this.set('yieldt', value); }

  get deliveryt() { return this.get('deliveryt'); }
  set deliveryt(value) { this.set('deliveryt', value); }

  get arrivalt() { return this.get('arrivalt'); }
  set arrivalt(value) { this.set('arrivalt', value); }
}

AV.Object.register(prosPlan, 'prosPlan');
module.exports = prosPlan;
