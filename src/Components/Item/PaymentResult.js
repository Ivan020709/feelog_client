import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../utils/jwtUtil';
import './PaymentResult.css';

function PaymentResult() {
    const navigate = useNavigate();
    const loginUser = useSelector(state => state.user);
    const requested = useRef(false);
    const [result, setResult] = useState({
        loading: true,
        success: false,
        message: ''
    });

    useEffect(() => {
        // 로그인 정보가 아직 준비되지 않았다면 기다립니다.
        if (!loginUser?.userid) {
            return;
        }

        // 결제 승인 API가 중복으로 호출되는 것을 방지합니다.
        if (requested.current) {
            return;
        }

        requested.current = true;


        const query = new URLSearchParams(
            window.location.search
        );

        /* =====================================================
           결제 실패 / 취소
        ===================================================== */
        if (query.get('failed') === 'true') {

            setResult({
                loading: false,
                success: false,
                message:
                    query.get('message') ||
                    '결제가 취소되었거나 실패했습니다.'
            });
            return;
        }

        /* =====================================================
           토스 결제 결과값
        ===================================================== */
        const paymentKey =
            query.get('paymentKey');
        const orderId =
            query.get('orderId');
        const amount =
            Number(query.get('amount'));
        /* =====================================================
           결제 결과값 검증
        ===================================================== */
        if (
            !paymentKey ||
            !orderId ||
            !amount
        ) {
            setResult({
                loading: false,
                success: false,
                message:
                    '결제 결과 정보가 없습니다.'
            });
            return;
        }

        /* =====================================================
           서버 결제 승인
        ===================================================== */
        jaxios.post('/api/payment/complete', { userId: loginUser.userid, paymentKey: paymentKey, orderId: orderId, amount: amount })
            .then(() => {
                setResult({ loading: false, success: true, message: '결제가 정상적으로 처리되었습니다.', orderId: orderId, amount: amount });
            })
            .catch(error => {
                console.error('결제 승인 오류:', error);
                setResult({ loading: false, success: false, message: error.response?.data?.message || '결제 승인에 실패했습니다.' });
            });
    }, [loginUser?.userid]);
    /* =========================================================
       결제 승인 중
    ========================================================= */
    if (result.loading) {
        return (
            <main className="item-shop">
                <article className="item-card payment-card payment-loading">
                    <div className="payment-loading-icon">
                        ...
                    </div>
                    <h1> 결제를 승인하는 중입니다.</h1>
                    <p>잠시만 기다려주세요.</p>
                </article>
            </main>
        );
    }
    /* =========================================================
       결제 결과
    ========================================================= */
    return (
        <main className="item-shop">
            <article
                className={`item-card payment-card ${result.success
                        ? 'payment-success'
                        : 'payment-fail'
                    }`}
            >

                {/* =================================================
                    결과 아이콘
                ================================================= */}

                <div className="payment-result-icon">

                    {result.success
                        ? '✓'
                        : '!'
                    }

                </div>


                {/* =================================================
                    제목
                ================================================= */}

                <h1>

                    {result.success
                        ? '결제가 완료되었습니다.'
                        : '결제에 실패했습니다.'
                    }

                </h1>


                {/* =================================================
                    결과 메시지
                ================================================= */}

                <p className="payment-result-message">

                    {result.message}

                </p>


                {/* =================================================
                    결제 성공 정보
                ================================================= */}

                {result.success && (

                    <div className="payment-info">

                        <div className="payment-info-row">

                            <span>
                                주문번호
                            </span>

                            <strong>
                                {result.orderId}
                            </strong>

                        </div>


                        <div className="payment-info-row">

                            <span>
                                결제 금액
                            </span>

                            <strong className="payment-amount">

                                {Number(
                                    result.amount
                                ).toLocaleString()}
                                원

                            </strong>

                        </div>

                    </div>

                )}


                {/* =================================================
                    안내 문구
                ================================================= */}

                {result.success && (

                    <p className="payment-success-notice">

                        🎁 구매한 아이템이
                        <br />
                        내 아이템 목록에 추가되었습니다.

                    </p>

                )}


                {!result.success && (

                    <p className="payment-fail-notice">

                        결제에 문제가 발생했습니다.
                        <br />
                        다시 시도하거나 상점으로 돌아가 주세요.

                    </p>

                )}


                {/* =================================================
                    버튼
                ================================================= */}

                <button
                    className="payment-result-button"
                    onClick={() =>
                        navigate(
                            result.success
                                ? '/selectAi'
                                : '/itemShop'
                        )
                    }
                >

                    {result.success
                        ? '필로그와 대화하기'
                        : '상점으로 돌아가기'
                    }

                </button>

            </article>

        </main>

    );

}


export default PaymentResult;
