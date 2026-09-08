import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import jaxios from '../../utils/jwtUtil';
import './ItemPayment.css';

// 수업시간에 사용한 결제위젯 테스트 클라이언트 키입니다.
// 클라이언트 키는 브라우저에서 사용하는 공개 키이므로 .env에 넣지 않아도 됩니다.
const CLIENT_KEY = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';

// 별도 npm 설치 없이 토스 SDK v2를 불러옵니다.
const loadTossPayments = () => new Promise((resolve, reject) => {
    if (window.TossPayments) {
        resolve(window.TossPayments);
        return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v2/standard';
    script.onload = () => resolve(window.TossPayments);
    script.onerror = () => {
        reject(
            new Error('토스 결제 모듈을 불러오지 못했습니다.')
        );
    };

    document.head.appendChild(script);
});


function ItemPayment() {
    const { itemId } = useParams();
    const loginUser = useSelector(
        (state) => state.user
    );
    const widgetsRef = useRef(null);
    const [item, setItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [order, setOrder] = useState(null);
    const [preparing, setPreparing] = useState(false);

    /* =====================================================
       상품 정보 조회
    ===================================================== */
    useEffect(() => {
        axios.get(`/api/item/view/${itemId}`)
            .then((result) => {
                setItem(result.data.item);
            })
            .catch((error) => {
                console.error(error);
                alert('상품을 불러오지 못했습니다.');
            });

    }, [itemId]);

    /* =====================================================
       결제 준비
    ===================================================== */
    const preparePayment = async () => {
        if (preparing) return;
        setPreparing(true);
        try {
            const result = await jaxios.post('/api/payment/ready',
                {
                    userId: loginUser.userid,
                    itemId: Number(itemId),
                    quantity: quantity
                }
            );
            const readyOrder = result.data;
            const TossPayments = await loadTossPayments();
            const tossPayments =TossPayments(CLIENT_KEY);
            const widgets =tossPayments.widgets({ customerKey:`FEELOG_USER_${loginUser.userid}`});

            /* 결제 금액 설정 */
            await widgets.setAmount({
                currency: 'KRW',
                value: readyOrder.totalPrice
            });

            /* 결제수단 + 약관 렌더링 */
            await Promise.all([
                widgets.renderPaymentMethods({
                    selector: '#item-payment-method',
                    variantKey: 'DEFAULT'
                }),
                widgets.renderAgreement({
                    selector: '#item-payment-agreement',
                    variantKey: 'AGREEMENT'
                })
            ]);

            widgetsRef.current = widgets;
            setOrder(readyOrder);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message ||error.message ||'결제를 준비하지 못했습니다.');
        } finally {
            setPreparing(false);
        }
    };
    /* =====================================================
       실제 결제 요청
    ===================================================== */
    const requestPayment = async () => {
        if (!widgetsRef.current || !order) {
            return;
        }
        try {
            await widgetsRef.current.requestPayment({
                orderId: order.orderId,
                orderName: order.itemName,
                successUrl:
                    `${window.location.origin}/paymentResult`,
                failUrl:
                    `${window.location.origin}/paymentResult?failed=true`,
                customerEmail:
                    order.buyerEmail,
                customerName:
                    loginUser.name ||
                    loginUser.nickname
            });
        } catch (error) {
            console.error(error);
            if (error.code !== 'USER_CANCEL') { alert(error.message ||'결제를 요청하지 못했습니다.');}
        }
    };

    /* =====================================================
       상품 로딩
    ===================================================== */

    if (!item) {
        return (
            <main className="item-payment-page">
                <section className="item-payment-loading">
                    상품을 불러오는 중입니다.
                </section>
            </main>
        );

    }
    /* =====================================================
       화면
    ===================================================== */
    return (
        <main className="item-payment-page">
            <section className="item-payment-container">
                {/* 상단 안내 */}
                <div className="item-payment-header">
                    <span>AI FRIEND SHOP</span>
                    <h1>선물 준비하기</h1>
                    <p>AI 친구에게 마음을 전해보세요.</p>
                </div>
                {/* 결제 카드 */}
                <article className="item-payment-card">
                    {/* 상품 정보 */}
                    <div className="item-payment-product">
                        <div className="item-payment-product-icon">
                            {item.itemImage ? (
                                <img
                                    src={item.itemImage}
                                    alt={item.itemName}
                                />
                            ) : (
                                <span>🎁</span>
                            )}
                        </div>

                        <div className="item-payment-product-info">
                            <h2>{item.itemName}</h2>
                            <p>{item.itemDescription}</p>
                        </div>
                    </div>

                    {/* 수량 */}
                    <div className="item-payment-quantity">
                        <span>수량</span>
                        <input
                            type="number"
                            min="1"
                            max="99"
                            value={quantity}
                            disabled={order !== null}
                            onChange={(event) => {
                                const value =
                                    Number(event.target.value);
                                setQuantity(
                                    Math.min(
                                        99,
                                        Math.max(1, value)
                                    )
                                );

                            }}
                        />
                    </div>

                    {/* 총 금액 */}
                    <div className="item-payment-total">
                        <span>결제 금액</span>
                        <strong>
                            {(item.price * quantity).toLocaleString()}
                            <small>원</small>
                        </strong>
                    </div>
                    {/* 결제수단 불러오기 */}
                    {!order && (
                        <button
                            type="button"
                            className="item-payment-load-button"
                            onClick={preparePayment}
                            disabled={preparing}
                        >
                            {preparing
                                ? '결제수단을 불러오는 중...'
                                : '결제수단 불러오기'
                            }
                        </button>
                    )}
                    {/* Toss 결제수단 */}
                    <div id="item-payment-method" className="item-payment-method"/>
                    {/* Toss 약관 */}
                    <div id="item-payment-agreement"className="item-payment-agreement"/>
                    {/* 결제하기 */}
                    {order && (
                        <button type="button" className="item-payment-submit-button" onClick={requestPayment}>
                            결제하기
                        </button>
                    )}
                </article>
            </section>
        </main>

    );
}

export default ItemPayment;
