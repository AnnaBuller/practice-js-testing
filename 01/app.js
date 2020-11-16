function getProductList() {
    return [
        {name: 'JavaScript: podstawy', type: 'book', count: 3, price: 67.19, discount: 0.21},
        {name: 'React: podstawy', type: 'book', count: 4, price: 79.17, discount: 0.27}
    ]
}

function getTotalPrice(productList) {
    if (productList.length > 0) {
        const sum = productList.reduce((acc, product) => {
            return (getDetailPrice(acc) + getDetailPrice(product));
        });
        return sum.toFixed(2)
    } else {
        return 0
    }
}

function getDetailPrice({ count, price, discount }) {
    return (price - (price * discount)) * count
}

const totalPrice = getTotalPrice( getProductList() );
console.log(totalPrice); // prawidłowa wartość: 390.42 (należy zaaokrąglić do 2 miejsc po przecinku)