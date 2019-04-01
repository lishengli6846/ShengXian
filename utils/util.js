const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatMoney = m =>{
  return m.toFixed(2);
}

const calculateMoney = function (goods) {
  var re = 0;
  for (var i = 0; i < goods.length; i++) {
    if (goods[i].isChecked) re += goods[i].money;
  }
  return re;
}

const calculateMoneyAndFormat = function (goods) {
  return formatMoney(calculateMoney(goods));
}

module.exports = {
  formatTime: formatTime,
  formatMoney: formatMoney,
  calculateMoneyAndFormat: calculateMoneyAndFormat
}
