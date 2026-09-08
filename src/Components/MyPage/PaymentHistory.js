import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import jaxios from '../../utils/jwtUtil';
import { logoutAction } from '../../store/userSlice';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import './PaymentHistory.css';

function PaymentHistory() {

    const navigate = useNavigate();
    const cookies = new Cookies();
    const dispatch = useDispatch();

    const loginUser = useSelector(s => s.user);

    const [payments, setPayments] = useState([]);

    useEffect(() => {

        if (loginUser?.userid) {

            jaxios.get('/api/payment/myList', {
                params: {
                    userId: loginUser.userid
                }
            })
                .then(r => {
                    setPayments(r.data.payments || []);
                })
                .catch(e => {
                    console.error(e);
                });
        }

    }, [loginUser?.userid]);

    function deleteMember() {
        if (!window.confirm(
            '회원탈퇴 시 필로그와의 모든 대화가 삭제됩니다.\n탈퇴하시겠습니까?'
        )) {
            return;
        }

        jaxios.delete('/api/member/deleteMember', { params: { email: loginUser.email } })
            .then(() => {
                alert('회원탈퇴가 완료되었습니다')
                navigate('/')
                dispatch(logoutAction())
                cookies.remove('user')
                navigate('/')
            })
            .catch((err) => {
                console.error(err);
                alert('회원탈퇴 중 오류가 발생했습니다.');
            });
    }

    return (

        <div className="payment-layout">

            {/* =========================
                사이드바
            ========================= */}

            <aside className="payment-sidebar">

                <div className="payment-sidebar-title">
                    마이페이지
                </div>

                <div className="payment-sidebar-menu">

                    <Link
                        to="/mypage"
                        className="payment-sidebar-item"
                    >
                        회원정보 수정
                    </Link>

                    <Link
                        to="/paymentHistory"
                        className="payment-sidebar-item active"
                    >
                        결제 내역
                    </Link>

                </div>

                <div className="payment-sidebar-bottom">

                    <button
                        type="button"
                        className="mypage-sidebar-delete"
                        onClick={deleteMember}
                    >
                        회원탈퇴
                    </button>

                </div>

            </aside>


            {/* =========================
                결제 내역
            ========================= */}

            <main className="payment-content">

                <div className="payment-wrapper">

                    <h2 className="payment-title">
                        결제 내역
                    </h2>

                    {payments.length === 0 ? (

                        <div className="payment-empty">
                            <div className="payment-empty-icon">
                                ♡
                            </div>

                            <p>결제 내역이 없습니다.</p>

                            <span>
                                아이템을 구매하면 이곳에서 확인할 수 있어요.
                            </span>
                        </div>

                    ) : (

                        <div className="payment-history-list">

                            {payments.map(p => (

                                <article
                                    key={p.paymentId}
                                    className="payment-card"
                                >

                                    <div className="payment-card-main">

                                        <div className="payment-item-info">

                                            <b>
                                                {p.items?.map(i =>
                                                    `${i.itemName} ${i.quantity}개`
                                                ).join(', ')}
                                            </b>

                                            <small>
                                                주문번호&nbsp; {p.merchantUid}
                                            </small>

                                        </div>

                                        <strong className="payment-price">
                                            {p.totalPrice?.toLocaleString()}원
                                        </strong>

                                    </div>


                                    <div className="payment-card-bottom">

                                        <span
                                            className={`payment-status ${p.paymentStatus}`}
                                        >
                                            {p.paymentStatus === 'PAID'
                                                ? '완료'
                                                : p.paymentStatus === 'READY'
                                                    ? '진행중 취소'
                                                    : p.paymentStatus}
                                        </span>

                                        <time>
                                            {new Date(p.paidAt || p.createdAt).toLocaleString('ko-KR', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </time>
                                    </div>

                                </article>

                            ))}

                        </div>

                    )}

                </div>

            </main>

        </div>

    );
}

export default PaymentHistory;