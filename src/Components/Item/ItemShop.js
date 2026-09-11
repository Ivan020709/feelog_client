import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ItemShop.css';

function ItemShop() {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/item/list')
            .then(result => {
                console.log('아이템 목록:', result.data.items);
                setItems(result.data.items || []);
            })
            .catch(error => {
                console.error('아이템 목록 조회 실패:', error);
            });
    }, []);

    return (
        <main className="item-shop-page">

            {/* =========================
                상점 Header
            ========================= */}
            <header className="item-shop-header">
                <span className="item-shop-badge">
                    FEELOG FRIEND SHOP
                </span>

                <h1>친밀도 아이템 상점</h1>

                <p>
                    필로그 친구들에게 선물하고<br className="item-shop-mobile-break" />
                    친밀도를 올려보세요.
                </p>
            </header>


            {/* =========================
                상품 목록
            ========================= */}
            <section className="item-shop-grid">

                {items.map(item => (
                    <article
                        key={item.itemId}
                        className="item-shop-card"
                    >

                        {/* 상품 이미지 */}
                        <div className="item-shop-image">

                            {item.itemImage ? (
                                <img
                                    src={item.itemImage}
                                    alt={item.itemName}
                                />
                            ) : (
                                <div className="item-shop-placeholder">
                                    🎁
                                </div>
                            )}

                        </div>


                        {/* 상품 정보 */}
                        <div className="item-shop-info">

                            <h2>{item.itemName}</h2>

                            <p className="item-shop-description">
                                {item.itemDescription}
                            </p>

                            <div className="item-shop-exp">
                                <span>친밀도 경험치</span>
                                <strong>
                                    +{item.expValue} EXP
                                </strong>
                            </div>

                            <div className="item-shop-price">
                                {item.price.toLocaleString()}
                                <span>원</span>
                            </div>

                        </div>


                        {/* 구매 버튼 */}
                        <button
                            type="button"
                            className="item-shop-buy-button"
                            onClick={() =>
                                navigate(`/itemPayment/${item.itemId}`)
                            }
                        >
                            구매하기
                            <span>→</span>
                        </button>

                    </article>
                ))}

            </section>

        </main>
    );
}

export default ItemShop;
