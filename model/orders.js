const AV = require('../libs/leancloud-storage.js');

class Orders extends AV.Object {
  get tradeId() { return this.get('tradeId'); }
  set tradeId(value) { this.set('tradeId', value); }

  get quantity() { return this.get('quantity'); }
  set quantity(value) { this.set('quantity', value); }

  get user() { return this.get('user'); }
  set user(value) { this.set('user', value); }

  get proObjectId() { return this.get('proObjectId'); }
  set proObjectId(value) { this.set('proObjectId', value); }

  get oState() { return this.get('oState'); }
  set oState(value) { this.set('oState', value); }

  get ip() { return this.get('ip'); }
  set ip(value) { this.set('ip', value); }

  get tradeType() { return this.get('tradeType'); }
  set tradeType(value) { this.set('tradeType', value); }

  get prepayId() { return this.get('prepayId'); }
  set prepayId(value) { this.set('prepayId', value); }

  get serObjectId() { return this.get('serObjectId'); }
  set serObjectId(value) { this.set('serObjectId', value); }

  get addressObjectId() { return this.get('addressObjectId'); }
  set addressObjectId(value) { this.set('addressObjectId', value); }

  get address() { return this.get('address'); }
  set address(value) { this.set('address', value); }

  get unitId() { return this.get('unitId'); }
  set unitId(value) { this.set('done', unitId); }

  get amount() { return this.get('amount'); }
  set amount(value) { this.set('amount', value); }

  get paidAt() { return this.get('paidAt'); }
  set paidAt(value) { this.set('paidAt', value); }
}
AV.Object.register(Orders);

module.exports = Orders;
