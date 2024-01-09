export default interface Order {
    _id?: string,
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
    orderStatus: string,
    orderDate: string,
};