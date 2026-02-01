export const calculateCartSummery = (cartItems) => {
  let subTotal = 0;
  let totalDiscount = 0;
  let grandTotal = 0;

  //loop throw each cart items
  cartItems.forEach((item) => {
    const { sellingPrice, finalPrice,gst ,GlobalDiscount} = item.productVariant;

    const quantity = item.quantity;  
    const totalPrice=finalPrice * quantity;
    const itemGst=gst*quantity
    const discountValue=parseFloat(GlobalDiscount?.discountValue) || 0
    const itemDiscount = discountValue * quantity;

    subTotal += sellingPrice * quantity;
    totalDiscount += (sellingPrice - finalPrice) * quantity;
    // grandTotal += (finalPrice * quantity) + itemGst - itemDiscount;
    grandTotal += (finalPrice * quantity)  - itemDiscount;
    
     ;
     
    
     
  });

  //the number of unique cart items
  const cartItemsCount = cartItems.length;

  return {
    cartItemsCount,
    subTotal,
    totalDiscount,
    grandTotal,
 
  };
};
