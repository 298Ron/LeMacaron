
export default interface Cart {
    userId: string,
    cards:

    [{
        _id?: string,
        price: number,
        quantity: number,
    }]
    ,
    totalToPay: number,
    totalItemsInCart: number,
    orderDiscountCode?: string,
    _id?: string,
};