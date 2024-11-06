import React from 'react';

function Shop({ addItemToCart }) {
    const products = [
        { id: 1, name: 'Necklace', price: 100 },
        { id: 2, name: 'Bracelet', price: 50 },
        { id: 3, name: 'Earrings', price: 30 },
    ];

    return (
        <div>
            <h1>Shop</h1>
            <div>
                {products.map((product) => (
                    <div key={product.id}>
                        <h3>{product.name}</h3>
                        <p>${product.price}</p>
                        <button onClick={() => addItemToCart(product.id, 1)}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Shop;