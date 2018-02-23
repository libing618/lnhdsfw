const AV = require('../libs/leancloud-storage.js');

class supplies extends AV.Object {
  get tradeId() { return this.get('tradeId'); }
//  set tradeId(value) { this.set('tradeId', value); }

  get user() { return this.get('user'); }
//  set user(value) { this.set('user', value); }

  get ip() { return this.get('ip'); }
//  set ip(value) { this.set('ip', value); }

  get quantity() { return this.get('quantity'); }
//  set quantity(value) { this.set('quantity', value); 数量

  get product() { return this.get('product'); }
//  set product(value) { this.set('product', value); }产品ID
  get proName() { return this.get('proName'); }      //产品名称

  get tradeType() { return this.get('tradeType'); }
//  set tradeType(value) { this.set('tradeType', value); }

  get prepayId() { return this.get('prepayId'); }
//  set prepayId(value) { this.set('prepayId', value); }

  get serFamily() { return this.get('serFamily'); }
//  set serFamily(value) { this.set('serFamily', value); }服务类型

  get goods() { return this.get('goods'); }
  //  set goods(value) { this.set('goods', value); }商品ID

  get goodsName() { return this.get('goodsName'); }      //商品名称

  get specs() { return this.get('specs'); }
  //  set specs(value) { this.set('specs', value); }规格ID

  get specsName() { return this.get('specsName'); }      //规格名称

  get cargo() { return this.get('cargo'); }
//  set cargo(value) { this.set('cargo', value); }成品ID
  get cargoName() { return this.get('cargoName'); }      //成品名称

  get address() { return this.get('address'); }
//  set address(value) { this.set('address', value); }

  get unitId() { return this.get('unitId'); }
//  set unitId(value) { this.set('done', unitId); }单位ID

  get amount() { return this.get('amount'); }
//  set amount(value) { this.set('amount', value); }

  get paidAt() { return this.get('paidAt'); }
//  set paidAt(value) { this.set('paidAt', value); }

  get confirmer() { return this.get('confirmer'); }      //订单确认出库人ID
  set confirmer(value) { this.set('confirmer', value); }

  get confirmAt() { return this.get('confirmAt'); }      //订单确认出库时间
  set confirmAt(value) { this.set('confirmAt', value); }

  get deliver() { return this.get('deliver'); }      //发货人ID
  set deliver(value) { this.set('deliver', value); }

  get deliverArr() { return this.get('deliverArr'); }      //发货人ID
  set deliverArr(value) { this.set('deliverArr', value); }

  get deliverTotal() { return this.get('deliverTotal'); }
  set deliverTotal(value) { this.set('deliverTotal', value); }

  get receipt() { return this.get('receipt'); }
  set receipt(value) { this.set('receipt', value); }

  get receiptArr() { return this.get('receiptArr'); }
  set receiptArr(value) { this.set('receiptArr', value); }

  get receiptTotal() { return this.get('receiptTotal'); }
  set receiptTotal(value) { this.set('receiptTotal', value); }
}
AV.Object.register(supplies);

module.exports = supplies;
