export function totalPhoneBill(data, plan) {
    const splitData = data.split(",");
    let sum = 0;
  
    for (let i = 0; i < splitData.length; i++) {
      const action = splitData[i].trim();
      if (action === "call") {
        sum += plan.call_price;
      } else if (action === "sms") {
        sum += plan.sms_price;
      }
    }
  
    const result = "R" + sum.toFixed(2);
    return result;
  }